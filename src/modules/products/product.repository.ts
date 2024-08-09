import { NotAcceptableException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDTO } from './dto/create-product.dto';
import { DeleteProductDTO } from './dto/delete-product.dto';
import { GetProductDTO } from './dto/get-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { SearchProductsDTO } from './dto/search-product.dto';

export class ProductsRepository {
  prisma = new PrismaClient();

  async createProduct(data: CreateProductDTO) {
    try {
      return await this.prisma.product.create({ data: { ...data } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async listProducts(data: SearchProductsDTO) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          name: data.name
            ? { contains: data.name, mode: 'insensitive' }
            : undefined,
          description: data.description
            ? { contains: data.description, mode: 'insensitive' }
            : undefined,
          price: data.price ? data.price : undefined,
          stockQuantity: data.stockQuantity ? data.stockQuantity : undefined,
          createdAt:
            data.date_start && data.date_end
              ? {
                  gte: new Date(data.date_start),
                  lte: new Date(data.date_end),
                }
              : undefined,
        },
        take: data.records_per_page,
        skip: (data.page - 1) * data.records_per_page,
      });
      return { products };
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async detailProduct(data: GetProductDTO) {
    try {
      return await this.prisma.product.findUnique({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateProduct(data: UpdateProductDTO) {
    try {
      const { id, ...parameters } = data;
      return await this.prisma.product.update({
        where: {
          id: id,
        },
        data: { ...parameters },
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteProduct(data: DeleteProductDTO) {
    try {
      return await this.prisma.product.delete({ where: { id: data.id } });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }
}
