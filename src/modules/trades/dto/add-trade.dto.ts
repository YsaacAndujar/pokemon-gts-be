import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AddTradeDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    collectionId: number;

    @ApiProperty({ type: [Number] })
    @IsOptional()
    @IsNumber({}, { each: true })
    pokemonsWanted: number[];
}