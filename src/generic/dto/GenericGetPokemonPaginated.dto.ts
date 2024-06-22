import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { GenericGetPaginatedDto } from "./GenericGetPaginated.dto";

export class GenericGetPokemonPaginated extends GenericGetPaginatedDto {
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