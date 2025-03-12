import { HoodpayPayment, CreatePaymentRequest, WebhookConfig, WebhookEventType } from '../types/index.js';
/**
 * A class representing a client for interacting with the Hoodpay API.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} businessId - The business ID.
 * @example
 * const client = new Hoodpay('your-api-key', 'your-business-id');
 */
export declare class Hoodpay {
    private methods;
    private apiClient;
    private apiKey;
    private businessId;
    constructor(apiKey: string, businessId: string);
    /**
     * Make a request to the Hoodpay API
     * @param method The method name from the methods object
     * @param reqData Request data for POST/PUT requests
     * @param httpMethod HTTP method to use
     */
    private request;
    /**
     * Get all payments by a certain business id
     */
    getPayments(): Promise<HoodpayPayment>;
    createPayment(createPaymentRequest: CreatePaymentRequest): Promise<HoodpayPayment>;
    /**
     * Get a specific payment
     * @param paymentId - ID of the payment to retrieve
     */
    getPayment(paymentId: string): Promise<HoodpayPayment>;
    /**
     * Update payment note
     * @param paymentId - ID of the payment
     * @param note - New note text to set
     */
    updatePaymentNote(paymentId: string, note: string): Promise<HoodpayPayment>;
    /**
     * Get payment from the hosted checkout page
     * @param paymentId - ID of the payment
     */
    getLivePayment(paymentId: string): Promise<HoodpayPayment>;
    /**
     * Select payment method for a payment
     * @param paymentId - ID of the payment
     * @param paymentMethod - Payment method to select
     */
    selectPaymentMethod(paymentId: string, paymentMethod: string): Promise<HoodpayPayment>;
    /**
     * Update customer email for a payment
     * @param paymentId - ID of the payment
     * @param email - Customer email
     */
    updateCustomerEmail(paymentId: string, email: string): Promise<HoodpayPayment>;
    /**
     * Cancel a payment
     * @param paymentId - ID of the payment
     */
    cancelPayment(paymentId: string): Promise<HoodpayPayment>;
    /**
     * Get all webhooks
     */
    getWebhooks(): Promise<WebhookConfig[]>;
    /**
     * Create a webhook
     * @param url - Webhook URL
     * @param events - Webhook events to subscribe to
     * @param description - Webhook events description
     */
    createWebhook(url: string, description: string, events: WebhookEventType[]): Promise<WebhookConfig>;
    /**
     * Reset webhook secret
     */
    resetWebhookSecret(): Promise<{
        secret: string;
    }>;
    /**
     * Delete webhook
     * @param webhookId - ID of the webhook to delete
     */
    deleteWebhook(webhookId: string): Promise<void>;
    /**
     * Get all businesses (for reference)
     */
    getBusinesses(): Promise<any[]>;
    /**
     * Get checkout URL for a payment
     * @param paymentId - ID of the payment
     */
    getCheckoutUrl(paymentId: string): string;
}
//# sourceMappingURL=index.d.ts.map