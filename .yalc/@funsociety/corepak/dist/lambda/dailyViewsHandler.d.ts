export interface DailyViewsLambdaEvent {
    requestContext?: {
        http?: {
            method?: string;
        };
    };
    rawPath?: string;
    body?: string;
    queryStringParameters?: Record<string, string | undefined>;
}
export interface DailyViewsLambdaResult {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}
export interface DailyViewsHandlerConfig {
    tableName?: string;
    heartbeatTtlSeconds?: number;
}
export type DailyReaction = 'up' | 'down';
export declare function createDailyViewsHandler(config?: DailyViewsHandlerConfig): (event: DailyViewsLambdaEvent) => Promise<DailyViewsLambdaResult>;
export declare const dailyViewsHandler: (event: DailyViewsLambdaEvent) => Promise<DailyViewsLambdaResult>;
