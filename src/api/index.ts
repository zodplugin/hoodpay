import { HOODPAY_API_ENDPOINTS } from '../constants/index.js';
import { HoodpayApiClient } from './client.js';
import {
  HoodpayPayment,
  CreatePaymentRequest,
  WebhookConfig,
  WebhookEventType,
} from '../types/index.js';

interface MethodInfo {
  path: string;
}

interface Methods {
  [key: string]: MethodInfo;
}

/**
 * A class representing a client for interacting with the Hoodpay API.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} businessId - The business ID.
 * @example
 * const client = new Hoodpay('your-api-key', 'your-business-id');
 */
export class Hoodpay {
  private methods!: Methods;
  private apiClient: HoodpayApiClient;
  private apiKey: string;
  private businessId: string;

  constructor(apiKey: string, businessId: string) {
    this.apiKey = apiKey;
    this.businessId = businessId;
    this.apiClient = new HoodpayApiClient(apiKey);

    // Process all endpoint categories
    this.methods = {
      // Process PAYMENTS endpoints
      ...Object.entries(HOODPAY_API_ENDPOINTS.PAYMENTS).reduce(
        (acc, [key, path]) => {
          acc[`payments_${key.toLowerCase()}`] = { path };
          return acc;
        },
        {} as Methods,
      ),

      // Process LIVE_PAYMENTS endpoints
      ...Object.entries(HOODPAY_API_ENDPOINTS.LIVE_PAYMENTS).reduce(
        (acc, [key, path]) => {
          acc[`live_payments_${key.toLowerCase()}`] = { path };
          return acc;
        },
        {} as Methods,
      ),

      // Process WEBHOOKS endpoints
      ...Object.entries(HOODPAY_API_ENDPOINTS.WEBHOOKS).reduce(
        (acc, [key, path]) => {
          acc[`webhooks_${key.toLowerCase()}`] = { path };
          return acc;
        },
        {} as Methods,
      ),

      // Add GET_ALL_BUSINESSES
      get_all_businesses: { path: HOODPAY_API_ENDPOINTS.GET_ALL_BUSINESSES },
    };
  }

  /**
   * Make a request to the Hoodpay API
   * @param method The method name from the methods object
   * @param reqData Request data for POST/PUT requests
   * @param httpMethod HTTP method to use
   */
  private async request<T>(
    method: keyof Methods,
    httpMethod: 'get' | 'post' | 'put' | 'delete',
    paymentId?: string,
    reqData?: object,
    webhookId?: string,
  ): Promise<T> {
    console.log('[Hoodpay] Request:', method, this.methods[method]?.path);

    let path = this.methods[method].path;

    if (paymentId) {
      Object.entries({ paymentId: paymentId }).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value);
      });
    }

    if (webhookId) {
      Object.entries({ webhookId: webhookId }).forEach(([key, value]) => {
        path = path.replace(`{${key}}`, value);
      });
    }

    Object.entries({ businessId: this.businessId }).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, value);
    });

    try {
      let response;
      console.log('[Hoodpay] Final Request URL:', path);
      if (httpMethod === 'post') {
        response = await this.apiClient.post<T>(path, {
          json: {
            ...reqData,
          },
        });
      } else if (httpMethod === 'get') {
        response = await this.apiClient.get<T>(path);
      } else if (httpMethod === 'put') {
        response = await this.apiClient.put<T>(path, {
          json: {
            ...reqData,
          },
        });
      } else {
        response = await this.apiClient.delete<T>(path);
      }

      console.log('[Hoodpay] Response:', JSON.stringify(response, null, 2));

      return response;
    } catch (err) {
      console.error('❌ [Hoodpay] Request Failed:', err);
      throw err;
    }
  }

  /**
   * Get all payments by a certain business id
   */
  async getPayments(): Promise<HoodpayPayment> {
    return this.request('payments_get_payments', 'get');
  }

  async createPayment(
    createPaymentRequest: CreatePaymentRequest,
  ): Promise<HoodpayPayment> {
    return this.request(
      'payments_create_payment',
      'post',
      undefined,
      createPaymentRequest,
    );
  }

  /**
   * Get a specific payment
   * @param paymentId - ID of the payment to retrieve
   */
  async getPayment(paymentId: string): Promise<HoodpayPayment> {
    return this.request('payments_get_one_payment', 'get', paymentId);
  }

  /**
   * Update payment note
   * @param paymentId - ID of the payment
   * @param note - New note text to set
   */
  async updatePaymentNote(
    paymentId: string,
    note: string,
  ): Promise<HoodpayPayment> {
    return this.request('payments_edit_payment_note', 'put', paymentId, {
      note,
    });
  }

  /**
   * Get payment from the hosted checkout page
   * @param paymentId - ID of the payment
   */
  async getLivePayment(paymentId: string): Promise<HoodpayPayment> {
    return this.request('live_payments_get_payment_by_id', 'get', paymentId);
  }

  /**
   * Select payment method for a payment
   * @param paymentId - ID of the payment
   * @param paymentMethod - Payment method to select
   */
  async selectPaymentMethod(
    paymentId: string,
    paymentMethod: string,
  ): Promise<HoodpayPayment> {
    return this.request(
      'live_payments_select_payment_method',
      'post',
      paymentId,
      {
        payment_method: paymentMethod,
      },
    );
  }

  /**
   * Update customer email for a payment
   * @param paymentId - ID of the payment
   * @param email - Customer email
   */
  async updateCustomerEmail(
    paymentId: string,
    email: string,
  ): Promise<HoodpayPayment> {
    return this.request(
      'live_payments_fill_customer_email',
      'post',
      paymentId,
      { email },
    );
  }

  /**
   * Cancel a payment
   * @param paymentId - ID of the payment
   */
  async cancelPayment(paymentId: string): Promise<HoodpayPayment> {
    return this.request('live_payments_cancel_payment', 'post', paymentId);
  }

  /**
   * Get all webhooks
   */
  async getWebhooks(): Promise<WebhookConfig[]> {
    return this.request('webhooks_get_webhooks', 'get');
  }

  /**
   * Create a webhook
   * @param url - Webhook URL
   * @param events - Webhook events to subscribe to
   * @param description - Webhook events description
   */
  async createWebhook(
    url: string,
    description: string,
    events: WebhookEventType[],
  ): Promise<WebhookConfig> {
    return this.request('webhooks_create_webhook', 'post', undefined, {
      url,
      description,
      events,
    });
  }

  /**
   * Reset webhook secret
   */
  async resetWebhookSecret(): Promise<{ secret: string }> {
    return this.request('webhooks_reset_webhook_secret', 'post');
  }

  /**
   * Delete webhook
   * @param webhookId - ID of the webhook to delete
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    return this.request(
      'webhooks_delete_webhook',
      'delete',
      undefined,
      undefined,
      webhookId,
    );
  }

  /**
   * Get all businesses (for reference)
   */
  async getBusinesses(): Promise<any[]> {
    return this.request('get_all_businesses', 'get');
  }

  /**
   * Get checkout URL for a payment
   * @param paymentId - ID of the payment
   */
  getCheckoutUrl(paymentId: string): string {
    return `https://checkout.hoodpay.io/${paymentId}`;
  }
}
