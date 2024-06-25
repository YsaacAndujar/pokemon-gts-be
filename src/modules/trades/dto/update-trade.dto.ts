import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, IsNumber, IsOptional } from "class-validator";

export class UpdateTradeDto {
    @ApiProperty({ type: [Number] })
    @IsOptional()
    @IsNumber({}, { each: true })
    @ArrayMaxSize(10)
    pokemonsWanted: number[];
}