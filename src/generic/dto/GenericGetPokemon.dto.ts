import { GenericGetPaginatedDto } from 'src/generic/dto';
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GenericGetPokemonDto {
    @ApiProperty({ required: false })
    @IsOptional()
    name?: string;
    
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    type?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;
}