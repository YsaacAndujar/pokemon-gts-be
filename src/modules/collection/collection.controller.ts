import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { AddPokemonDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericGetPokemonPaginated } from 'src/generic/dto';

@Controller('collection')
@ApiTags('Collection')
@ApiBearerAuth()
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('add-pokemon')
  async addPokemon(@Body() dto: AddPokemonDto, @Req() request) {
    return await this.collectionService.addPokemon(dto, request.user.userId);
  }

  @Delete('remove-pokemon/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request) {
    return await this.collectionService.removePokemon(id, request.user.userId);
  }
  
  @Get()
  async findAllMine(@Req() request, @Query() dto: GenericGetPokemonPaginated) {
    return await this.collectionService.findAllMine(dto, request.user.userId);
  }
}
