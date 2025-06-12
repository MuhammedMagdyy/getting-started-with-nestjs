import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

type Product = {
  id: number;
  title: string;
  price: number;
};

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, title: 'Product 1', price: 100 },
    { id: 2, title: 'Product 2', price: 200 },
    { id: 3, title: 'Product 3', price: 300 },
  ];

  create({ title, price }: CreateProductDto) {
    const newProduct: Product = { id: this.products.length + 1, title, price };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    console.log(updateProductDto);

    return { message: 'Product updated successfully' };
  }

  delete(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { message: 'Product deleted successfully' };
  }
}
