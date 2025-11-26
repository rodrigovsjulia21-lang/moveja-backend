import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('create')
  createPayment(@Body() body) {
    return this.payments.createPayment(
      body.rideId,
      body.amount,
      body.driverId
    );
  }
}
