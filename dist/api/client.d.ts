import { HoodpayApiClientConfig } from '../types/index.js';
export declare class HoodpayApiClient {
    private readonly client;
    private readonly apiKey;
    constructor(apiKey: string, config?: Partial<HoodpayApiClientConfig>);
    post<T>(endpoint: string, options: {
        json: Record<string, any>;
    }): Promise<T>;
    get<T>(endpoint: string): Promise<T>;
    put<T>(endpoint: string, options: {
        json: Record<string, any>;
    }): Promise<T>;
    delete<T>(endpoint: string): Promise<T>;
}
//# sourceMappingURL=client.d.ts.map