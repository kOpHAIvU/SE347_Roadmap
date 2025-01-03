export class CreatePaymentDto {
    totalPayment: number;
    userId?: number;
    // type is "banking", 'zalopay'
    type: string;
    status: boolean;
    isActive?: boolean;
    image?: string; 
}
