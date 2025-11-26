import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import mercadopago from 'mercadopago';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_KEY);
  
  constructor(private prisma: PrismaService) {
    mercadopago.configure({
      access_token: process.env.MP_TOKEN
    });
  }

  // CRIA PAGAMENTO PIX OU CARTÃO COM SPLIT
  async createPayment(rideId: number, amount: number, driverId: number) {
    const driver = await this.prisma.user.findUnique({ where: { id: driverId } });

    // Split: 70% motorista / 30% MoveJá
    const driverAmount = Math.floor(amount * 0.7);
    const platformAmount = amount - driverAmount;

    // Stripe PaymentIntent
    const payment = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'brl',
      payment_method_types: ['card', 'pix'],
      transfer_data: {
        amount: driverAmount * 100
      }
    });

    return payment;
  }
}
