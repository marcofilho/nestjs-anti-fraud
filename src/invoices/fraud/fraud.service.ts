import { Injectable } from '@nestjs/common';
import { create } from 'domain';
import { ProcessInvoiceFraudDto } from 'src/dto/process-invoice-fraud.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FraudService {
  constructor(private prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async processInvoice(processInvoiceFraudDto: ProcessInvoiceFraudDto) {
    const { invoice_id, account_id, amount } = processInvoiceFraudDto;

    const invoice = await this.prismaService.invoice.findUnique({
      where: {
        id: invoice_id,
      },
    });

    if (invoice) {
      throw new Error('Invoice has already been processed');
    }

    this.prismaService.account.upsert({
      where: {
        id: account_id,
      },
      update: {},
      create: {
        id: account_id,
      },
    });
  }
}
