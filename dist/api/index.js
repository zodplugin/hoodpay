var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HOODPAY_API_ENDPOINTS } from '../constants/index.js';
import { HoodpayApiClient } from './client.js';
/**
 * A class representing a client for interacting with the Hoodpay API.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} businessId - The business ID.
 * @example
 * const client = new Hoodpay('your-api-key', 'your-business-id');
 */
export class Hoodpay {
    constructor(apiKey, businessId) {
        this.apiKey = apiKey;
        this.businessId = businessId;
        this.apiClient = new HoodpayApiClient(apiKey);
        // Process all endpoint categories
        this.methods = Object.assign(Object.assign(Object.assign(Object.assign({}, Object.entries(HOODPAY_API_ENDPOINTS.PAYMENTS).reduce((acc, [key, path]) => {
            acc[`payments_${key.toLowerCase()}`] = { path };
            return acc;
        }, {})), Object.entries(HOODPAY_API_ENDPOINTS.LIVE_PAYMENTS).reduce((acc, [key, path]) => {
            acc[`live_payments_${key.toLowerCase()}`] = { path };
            return acc;
        }, {})), Object.entries(HOODPAY_API_ENDPOINTS.WEBHOOKS).reduce((acc, [key, path]) => {
            acc[`webhooks_${key.toLowerCase()}`] = { path };
            return acc;
        }, {})), { 
            // Add GET_ALL_BUSINESSES
            get_all_businesses: { path: HOODPAY_API_ENDPOINTS.GET_ALL_BUSINESSES } });
    }
    /**
     * Make a request to the Hoodpay API
     * @param method The method name from the methods object
     * @param reqData Request data for POST/PUT requests
     * @param httpMethod HTTP method to use
     */
    request(method, httpMethod, paymentId, reqData, webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('[Hoodpay] Request:', method, (_a = this.methods[method]) === null || _a === void 0 ? void 0 : _a.path);
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
                    response = yield this.apiClient.post(path, {
                        json: Object.assign({}, reqData),
                    });
                }
                else if (httpMethod === 'get') {
                    response = yield this.apiClient.get(path);
                }
                else if (httpMethod === 'put') {
                    response = yield this.apiClient.put(path, {
                        json: Object.assign({}, reqData),
                    });
                }
                else {
                    response = yield this.apiClient.delete(path);
                }
                console.log('[Hoodpay] Response:', JSON.stringify(response, null, 2));
                return response;
            }
            catch (err) {
                console.error('❌ [Hoodpay] Request Failed:', err);
                throw err;
            }
        });
    }
    /**
     * Get all payments by a certain business id
     */
    getPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('payments_get_payments', 'get');
        });
    }
    createPayment(createPaymentRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('payments_create_payment', 'post', undefined, createPaymentRequest);
        });
    }
    /**
     * Get a specific payment
     * @param paymentId - ID of the payment to retrieve
     */
    getPayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('payments_get_one_payment', 'get', paymentId);
        });
    }
    /**
     * Update payment note
     * @param paymentId - ID of the payment
     * @param note - New note text to set
     */
    updatePaymentNote(paymentId, note) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('payments_edit_payment_note', 'put', paymentId, {
                note,
            });
        });
    }
    /**
     * Get payment from the hosted checkout page
     * @param paymentId - ID of the payment
     */
    getLivePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('live_payments_get_payment_by_id', 'get', paymentId);
        });
    }
    /**
     * Select payment method for a payment
     * @param paymentId - ID of the payment
     * @param paymentMethod - Payment method to select
     */
    selectPaymentMethod(paymentId, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('live_payments_select_payment_method', 'post', paymentId, {
                payment_method: paymentMethod,
            });
        });
    }
    /**
     * Update customer email for a payment
     * @param paymentId - ID of the payment
     * @param email - Customer email
     */
    updateCustomerEmail(paymentId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('live_payments_fill_customer_email', 'post', paymentId, { email });
        });
    }
    /**
     * Cancel a payment
     * @param paymentId - ID of the payment
     */
    cancelPayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('live_payments_cancel_payment', 'post', paymentId);
        });
    }
    /**
     * Get all webhooks
     */
    getWebhooks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('webhooks_get_webhooks', 'get');
        });
    }
    /**
     * Create a webhook
     * @param url - Webhook URL
     * @param events - Webhook events to subscribe to
     * @param description - Webhook events description
     */
    createWebhook(url, description, events) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('webhooks_create_webhook', 'post', undefined, {
                url,
                description,
                events,
            });
        });
    }
    /**
     * Reset webhook secret
     */
    resetWebhookSecret() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('webhooks_reset_webhook_secret', 'post');
        });
    }
    /**
     * Delete webhook
     * @param webhookId - ID of the webhook to delete
     */
    deleteWebhook(webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('webhooks_delete_webhook', 'delete', undefined, undefined, webhookId);
        });
    }
    /**
     * Get all businesses (for reference)
     */
    getBusinesses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get_all_businesses', 'get');
        });
    }
    /**
     * Get checkout URL for a payment
     * @param paymentId - ID of the payment
     */
    getCheckoutUrl(paymentId) {
        return `https://checkout.hoodpay.io/${paymentId}`;
    }
}
