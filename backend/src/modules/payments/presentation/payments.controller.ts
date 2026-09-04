import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  type RequestUser,
} from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ProcessPaymentUseCase } from '../application/use-cases/process-payment.use-case';
import { CreatePaymentDto } from './dto/create-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post()
  pay(@CurrentUser() user: RequestUser, @Body() dto: CreatePaymentDto) {
    return this.processPaymentUseCase.execute({
      orderId: dto.orderId,
      method: dto.method,
      userId: user.id,
      role: user.role,
    });
  }
}
