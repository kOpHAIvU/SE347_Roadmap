export class CreatePaymentDto {
    totalPayment: number;
    userId?: number;
    // type is "momo", 'zalopay'
    type: string;
    isActive?: boolean;
}
