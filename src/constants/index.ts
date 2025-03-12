export const HOODPAY_API_BASE_URL = 'https://api.hoodpay.io/v1/';

export const DEFAULT_TIMEOUT = 30000;

export const HOODPAY_API_ENDPOINTS = {
  PAYMENTS: {
    GET_PAYMENTS: 'businesses/{businessId}/payments',
    CREATE_PAYMENT: 'businesses/{businessId}/payments',
    GET_ONE_PAYMENT: 'businesses/{businessId}/payments/{paymentId}',
    EDIT_PAYMENT_NOTE: 'businesses/{businessId}/payments/{paymentId}/note',
  },
  LIVE_PAYMENTS: {
    GET_PAYMENT_BY_ID: 'public/payments/hosted-page/{paymentId}',
    SELECT_PAYMENT_METHOD:
      'public/payments/hosted-page/{paymentId}/select-payment-method',
    FILL_CUSTOMER_EMAIL:
      'public/payments/hosted-page/{paymentId}/customer_email',
    CANCEL_PAYMENT: 'public/payments/hosted-page/{paymentId}/cancel',
  },
  WEBHOOKS: {
    GET_WEBHOOKS: 'dash/businesses/{businessId}/settings/developer/webhooks',
    CREATE_WEBHOOK: 'dash/businesses/{businessId}/settings/developer/webhooks',
    RESET_WEBHOOK_SECRET:
      'dash/businesses/{businessId}/settings/developer/webhooks/reset-secret',
    DELETE_WEBHOOK:
      'dash/businesses/{businessId}/settings/developer/webhooks/{webhookId}',
  },
  GET_ALL_BUSINESSES: 'dash/businesses',
};
