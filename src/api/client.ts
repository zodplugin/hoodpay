import ky from 'ky';
import {
  HoodpayApiResponse,
  HoodpayApiClientConfig,
  HoodpayApiError,
} from '../types/index.js';
import { HOODPAY_API_BASE_URL, DEFAULT_TIMEOUT } from '../constants/index.js';

export class HoodpayApiClient {
  private readonly client: typeof ky;
  private readonly apiKey: string;

  constructor(apiKey: string, config: Partial<HoodpayApiClientConfig> = {}) {
    this.apiKey = apiKey;

    const baseUrl = config.baseUrl || HOODPAY_API_BASE_URL;
    const timeout = config.timeout || DEFAULT_TIMEOUT;

    this.client = ky.create({
      prefixUrl: baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/*+json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      hooks: {
        beforeError: [
          async (error) => {
            const { response } = error;
            if (response && response.body) {
              error.name = 'HoodpayApiError';
            }
            return error;
          },
        ],
      },
    });
  }

  async post<T>(
    endpoint: string,
    options: { json: Record<string, any> },
  ): Promise<T> {
    try {
      const response = await this.client
        .post(endpoint, {
          ...options,
        })
        .json<HoodpayApiResponse<T>>();

      // if (response.result !== 100) {
      //   throw new Error(response.message || 'Unknown error');
      // }

      return response as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.client
        .get(endpoint)
        .json<HoodpayApiResponse<T>>();

      // if (response.result !== 100) {
      //   throw new Error(response.message || 'Unknown error');
      // }

      return response as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error occurred');
    }
  }

  async put<T>(
    endpoint: string,
    options: { json: Record<string, any> },
  ): Promise<T> {
    try {
      const response = await this.client
        .put(endpoint, {
          ...options,
        })
        .json<HoodpayApiResponse<T>>();

      // if (response.result !== 100) {
      //   throw new Error(response.message || 'Unknown error');
      // }

      return response as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error occurred');
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.client
        .delete(endpoint)
        .json<HoodpayApiResponse<T>>();

      // if (response.result !== 100) {
      //   throw new Error(response.message || 'Unknown error');
      // }

      return response as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error occurred');
    }
  }
}
