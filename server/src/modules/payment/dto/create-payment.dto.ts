export class CreatePaymentDto {
    totalPayment: number;
    userId?: number;
    // type is "momo", 'zalopay'
    type: string;
    status: boolean;
    isActive?: boolean;
    image?: string;
}
