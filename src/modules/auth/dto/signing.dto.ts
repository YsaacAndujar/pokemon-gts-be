import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString
} from 'class-validator';

export class SigninDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    username: string

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    password: string
}