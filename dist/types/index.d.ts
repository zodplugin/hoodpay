export interface HoodpayApiClientConfig {
    baseUrl?: string;
    timeout?: number;
}
export interface HoodpayApiError {
    message?: string;
    result: number;
}
export interface HoodpayApiResponse<T> {
    result: number;
    message?: string;
    data?: T;
}
export interface HoodpayPayment {
    message: string;
    data: Record<string, any>;
    url: string;
    id: string;
    amount: number;
    currency: string;
    status: string;
    customer_email?: string;
    payment_method?: string;
    created_at: string;
    updated_at: string;
    note?: string;
    metadata?: Record<string, any>;
}
export interface CreatePaymentRequest {
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    paymentMethods?: Record<string, string[]>;
    redirectUrl?: string;
    notifyUrl?: string;
    customerEmail?: string;
    customerIp?: string;
    customerUserAgent?: string;
    metadata?: object;
}
export type WebhookEventType = 'PAYMENT_CREATED' | 'PAYMENT_METHOD_SELECTED' | 'PAYMENT_EXPIRED' | 'PAYMENT_CANCELLED' | 'PAYMENT_COMPLETED' | 'PAYMENT_PROCESSING';
export interface WebhookConfig {
    url: string;
    description: string;
    events: WebhookEventType[];
}
//# sourceMappingURL=index.d.ts.map