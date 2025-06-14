import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Between, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      title: createProductDto.title.toLocaleLowerCase(),
      user,
    });
    return await this.productsRepository.save(newProduct);
  }

  async findAll(title?: string, minPrice?: string, maxPrice?: string) {
    const filters = {
      ...(title ? { title: Like(`%${title.toLowerCase()}%`) } : {}),
      ...(minPrice && maxPrice
        ? { price: Between(Number(minPrice), Number(maxPrice)) }
        : {}),
    };

    return await this.productsRepository.find({ where: { ...filters } });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;

    return await this.productsRepository.save(product);
  }

  async delete(id: number) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);

    return { message: 'Product deleted successfully' };
  }
}
