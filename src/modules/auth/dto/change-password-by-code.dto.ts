import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString
} from 'class-validator';

export class ChangePasswordByCodeDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    password: string
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    code: string
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    username: string
    
}