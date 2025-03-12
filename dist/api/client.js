var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ky from 'ky';
import { HOODPAY_API_BASE_URL, DEFAULT_TIMEOUT } from '../constants/index.js';
export class HoodpayApiClient {
    constructor(apiKey, config = {}) {
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
                    (error) => __awaiter(this, void 0, void 0, function* () {
                        const { response } = error;
                        if (response && response.body) {
                            error.name = 'HoodpayApiError';
                        }
                        return error;
                    }),
                ],
            },
        });
    }
    post(endpoint, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client
                    .post(endpoint, Object.assign({}, options))
                    .json();
                // if (response.result !== 100) {
                //   throw new Error(response.message || 'Unknown error');
                // }
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error('Unknown error occurred');
            }
        });
    }
    get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client
                    .get(endpoint)
                    .json();
                // if (response.result !== 100) {
                //   throw new Error(response.message || 'Unknown error');
                // }
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error('Unknown error occurred');
            }
        });
    }
    put(endpoint, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client
                    .put(endpoint, Object.assign({}, options))
                    .json();
                // if (response.result !== 100) {
                //   throw new Error(response.message || 'Unknown error');
                // }
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error('Unknown error occurred');
            }
        });
    }
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client
                    .delete(endpoint)
                    .json();
                // if (response.result !== 100) {
                //   throw new Error(response.message || 'Unknown error');
                // }
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error('Unknown error occurred');
            }
        });
    }
}
