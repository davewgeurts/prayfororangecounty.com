export declare function handler(event: any): Promise<{
    statusCode: any;
    headers: {
        'content-type': string;
        'cache-control': string;
    };
    body: string;
} | {
    statusCode: number;
    headers: {};
    body: string;
}>;
