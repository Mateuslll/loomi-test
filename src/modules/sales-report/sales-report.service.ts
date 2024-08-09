import { Injectable, NotAcceptableException } from '@nestjs/common';
import { createObjectCsvStringifier } from 'csv-writer';
import { CreateSalesReportDTO } from './dto/create-sales-report.dto';
import { DeleteSalesReportDTO } from './dto/delete-sales-report.dto';
import { UpdateSalesReportDTO } from './dto/update-sales-report.dto';
import { SalesReportRepository } from './sales-report.repository';
import { GetSalesReportDTO } from './dto/get-sales.report.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Injectable()
export class SalesReportService {
  constructor(
    private readonly salesReportRepository: SalesReportRepository,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async createSalesReport(data: CreateSalesReportDTO) {
    try {
      const generateSalesReportSQLQuery: string = `SELECT
        produto.name AS productName,
        itemPedido."unitPrice" AS productPrice,
        SUM(itemPedido.quantity) AS quantitySold,
        SUM(itemPedido.subtotal) AS totalSalesValue,
        (
          SELECT COUNT(*)
          FROM "OrderItem" itemPedido
          JOIN "Order" pedido ON itemPedido."orderId" = pedido.id
          WHERE itemPedido."productId" = produto.id
          AND pedido."orderStatus" IN ('DISPATCHED', 'DELIVERED')
        ) AS totalSales
      FROM
        "OrderItem" itemPedido
      JOIN
        "Product" produto ON itemPedido."productId" = produto.id
      JOIN
        "Order" pedido ON itemPedido."orderId" = pedido.id
      WHERE
        pedido."createdAt" BETWEEN '${data.date_start}' AND '${data.date_end}'
      AND pedido."orderStatus" IN ('DISPATCHED', 'DELIVERED')
      GROUP BY
        produto.id, produto.name, itemPedido."unitPrice";`;

      const salesReportOnPeriod =
        (await this.salesReportRepository.generateSalesReport(
          generateSalesReportSQLQuery,
        )) as unknown as {
          productName: string;
          productPrice: number;
          quantitySold: bigint;
          totalSales: bigint;
          totalSalesValue: number;
        }[];

      let totalSalesValue = 0;
      let productsSold = 0;

      for (const saleReport of salesReportOnPeriod) {
        totalSalesValue += Number(saleReport.totalSalesValue);
        productsSold += Number(saleReport.quantitySold);
      }

      const fileBuffer = await this.writeSalesReportOnCSV(salesReportOnPeriod);

      const fileUrl = await this.awsS3Service.uploadFileToS3({
        fileBuffer: fileBuffer,
        fileName: `sales-report-${data.date_start}-${data.date_end}.csv`,
      });

      return await this.salesReportRepository.createSalesReport({
        period: `${data.date_start}, ${data.date_end}`,
        totalSales: totalSalesValue,
        productsSold: productsSold,
        filePath: fileUrl,
      });
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async getSalesReport(data: GetSalesReportDTO) {
    try {
      return await this.salesReportRepository.getSalesReport(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async updateSalesReport(data: UpdateSalesReportDTO) {
    try {
      return await this.salesReportRepository.updateSalesReport(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async deleteSalesReport(data: DeleteSalesReportDTO) {
    try {
      return await this.salesReportRepository.deleteSalesReport(data);
    } catch (error) {
      return new NotAcceptableException(error);
    }
  }

  async writeSalesReportOnCSV(
    salesReport: {
      productName: string;
      productPrice: number;
      quantitySold: bigint;
      totalSales: bigint;
      totalSalesValue: number;
    }[],
  ) {
    try {
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'productName', title: 'Product Name' },
          { id: 'productPrice', title: 'Product Price' },
          { id: 'quantitySold', title: 'Quantity Sold' },
          { id: 'totalSales', title: 'Total Sales' },
          { id: 'totalSalesValue', title: 'Total Sales Value' },
        ],
      });

      const csvData =
        csvStringifier.getHeaderString() +
        '\n' +
        csvStringifier.stringifyRecords(salesReport);

      return Buffer.from(csvData, 'utf-8');
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
}
