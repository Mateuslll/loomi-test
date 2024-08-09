import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDTO } from './dto/create-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { SearchProductsDTO } from './dto/search-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductsRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async createProduct(data: CreateProductDTO) {
    try {
      return await this.productsRepository.createProduct(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async detailProduct(data: GetProductDTO) {
    try {
      return await this.productsRepository.detailProduct(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async searchProducts(data: SearchProductsDTO) {
    try {
      return await this.productsRepository.listProducts(data);
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async updateProduct(data: UpdateProductDTO) {
    try {
      return await this.productsRepository.updateProduct(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteProduct(data: DeleteProductDTO) {
    try {
      return await this.productsRepository.deleteProduct(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async verifyProductAvailability(data: {
    productId: string;
    quantity: number;
  }) {
    try {
      const productstockQuantity = (
        (await this.productsRepository.detailProduct({
          id: data.productId,
        })) as unknown as Product
      ).stockQuantity;
      return data.quantity > productstockQuantity ? false : true;
    } catch (error) {
      return new NotFoundException(error);
    }
  }
}
