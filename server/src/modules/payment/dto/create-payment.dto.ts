export class CreatePaymentDto {
    totalPayment: number;
    userId?: number;
    // type is "momo", "paypal"
    type: string;
    isActive?: boolean;
}
