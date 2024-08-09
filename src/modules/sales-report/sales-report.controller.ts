import { Controller } from '@nestjs/common';
import { SalesReportService } from './sales-report.service';

@Controller('sales-report')
export class SalesReportController {
  constructor(private readonly salesReportService: SalesReportService) {}
}
