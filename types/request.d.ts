declare type RequestDefaultMethods = 'post' | 'get' | 'put' | 'patch';
declare type RequestFunctions = RequestDefaultMethods | 'del';
declare type UrlParams = Record<string, string> | string | null;
declare type RequestMethod = <ResponseData, Body = undefined>(payload: {
    options?: RequestInit | {
        body: Body;
    };
    params?: UrlParams;
    url: string;
}) => Promise<ResponseData> | never;
declare type RequestOptions = {
    url: string;
    options?: RequestInit;
};
export declare type Requests = {
    [key in RequestFunctions]: RequestMethod;
};
export declare const objectToQueryString: (params?: string | Record<string, string> | null | undefined) => string;
export declare const getFormatedUrl: ({ url, params }: {
    url: string;
    params?: string | Record<string, string> | null | undefined;
}) => string;
export declare const getHeaders: () => Headers;
export declare const doRequest: <ResponseData>({ url, options, }: RequestOptions) => Promise<ResponseData>;
declare const _default: (baseUrl: string) => Requests;
export default _default;
