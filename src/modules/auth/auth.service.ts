import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, } from '@nestjs/common';
import { FindOptionsWhere, MoreThan, Not, Repository } from 'typeorm';
import { encryptPassword } from 'src/utils/encryptPassword';
import { JwtService } from '@nestjs/jwt'
import { generateCode } from 'src/utils/gererateCode';
import { User, UserCode } from './entities';
import { ChangePasswordByCodeDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, SigninDto, UpdateProfileDto } from './dto';
const credentialsMsg = 'Wrong credentials'
@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserCode)
        private readonly userCodesRepository: Repository<UserCode>,
        private readonly _jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne(({
            where: {
                ...loginDto,
                password: encryptPassword(loginDto.password)
            }
        }))

        if (!user) {
            throw new BadRequestException(credentialsMsg)
        }

        return await this.generateToken(user)
    }

    private async validateUsername(username: string, id: number = undefined) {
        const where: FindOptionsWhere<User> = {
            username,
        }
        if (id) {
            where.id = Not(id)
        }
        const user = await this.userRepository.findOne({
            where
        })
        if (user) {
            throw new BadRequestException("The username is already in use")
        }
    }

    private async getUserByIdOrThrow(id: number) {
        const user = await this.userRepository.findOne({
            where: { id }
        })
        if (!user) {
            throw new BadRequestException("User not found")
        }
        return user
    }

    async changePassword({ newPassword, oldPassword }: ChangePasswordDto, userId: number) {
        const user = await this.getUserByIdOrThrow(userId)
        if(user.password != encryptPassword(oldPassword)){
            throw new BadRequestException(credentialsMsg)
        }
        user.password = encryptPassword(newPassword)
        await this.userRepository.update(userId, user)
    }

    async updateProfile(updateProfileDto: UpdateProfileDto, userId: number) {
        const user = await this.getUserByIdOrThrow(userId)
        await this.validateUsername(updateProfileDto.username, userId)
        const newData: User = {
            ...user,
            ...updateProfileDto
        }
        await this.userRepository.update(userId, newData)
    }

    async getProfile(id: number) {
        const { password, ...user } = await this.getUserByIdOrThrow(id)
        return user

    }

    async forgotPassword({ username }: ForgotPasswordDto) {
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        })
        if (!user) return
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        const code: UserCode = {
            id: undefined,
            user,
            code: generateCode(),
            expires,
        }
        await this.userCodesRepository.save(code)
        //todo send code through email
    }

    async changePasswordByCode({ username, code, password }: ChangePasswordByCodeDto) {
        const error = new BadRequestException(credentialsMsg)
        const user = await this.userRepository.findOne({
            where: {
                username
            }
        })
        if (!user) throw error
        const currentDate = new Date();
        const codeEntity = await this.userCodesRepository.findOne({
            where: {
                user: { username },
                code,
                expires: MoreThan(currentDate),
            },
        })
        if (!codeEntity) throw error

        user.password = encryptPassword(password)
        await this.userRepository.update(user.id, user)
        return await this.generateToken(user)
    }

    async signin(signinDto: SigninDto) {
        await this.validateUsername(signinDto.username)
        const user = await this.userRepository.save(({
            ...signinDto,
            password: encryptPassword(signinDto.password)
        }))

        return await this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = {
            userId: user.id,
            username: user.username
        }
        const token = await this._jwtService.signAsync(payload, {
            secret: process.env.PRIVATE_KEY,
            expiresIn: process.env.EXPIRES_IN,
        })
        return { token }
    }

}
