import { Module } from '@nestjs/common';
import { SalesReportService } from './sales-report.service';
import { SalesReportController } from './sales-report.controller';
import { SalesReportRepository } from './sales-report.repository';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Module({
  controllers: [SalesReportController],
  providers: [SalesReportService, SalesReportRepository, AwsS3Service],
})
export class SalesReportModule {}
