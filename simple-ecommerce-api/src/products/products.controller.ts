import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthRolesGuard } from 'src/auth/guards/auth-roles.guards';
import { JwtPayload } from 'src/common/utils/types';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/users/enums/user-type.enum';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  create(@Body() body: CreateProductDto, @CurrentUser() payload: JwtPayload) {
    return this.productService.create(body, payload.id);
  }

  @Get()
  findAll(
    @Query('title') title: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    return this.productService.findAll(title, minPrice, maxPrice);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put('/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.update(id, body);
  }

  @Delete('/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
