type RequestDefaultMethods = 'post' | 'get' | 'put' | 'patch';
type RequestMethods = RequestDefaultMethods | 'delete';
type RequestFunctions = RequestDefaultMethods | 'del';

type UrlParams = Record<string, string> | string | null

type Interceptors = {
  transformResponse?: <ResponseData>(data: {}) => Promise<ResponseData>;
  onError?: <ResponseData>(data: {}) => Promise<ResponseData>|never;
}

type RequestMethod = <ResponseData, Body = undefined>(payload: {
  options?: RequestInit | { body: Body };
  params?: UrlParams;
  url: string;
}) => Promise<ResponseData> | never;

type RequestOptions = {
  url: string;
  options?: RequestInit;
  interceptors?: Interceptors;
}

export type Requests = {
  [key in RequestFunctions]: RequestMethod;
}

export const objectToQueryString = (params?: UrlParams): string =>
  params ? `?${new URLSearchParams(params).toString()}` : ''

export const getFormatedUrl = ({ url, params }: { url: string; params?: UrlParams }): string =>
  `${url}${url.endsWith('/') ? '' : '/'}${objectToQueryString(params)}`

export const getHeaders = (): Headers => {
  const headers = new Headers()
  headers.append('content-type', 'application/json')
  const token = window.localStorage.getItem('token')
  if (token) {
    headers.append('Authorization', `bearer ${token}`)
  }
  return headers
}

const validateRequest = ({ body, method = '' }: RequestInit): never | void => {
  if (['patch', 'post', 'put'].includes(method) && !body) {
    throw new Error(`A ${method} request must have a body`)
  }
}

export const doRequest =  <ResponseData> ({
  url,
  options = {},
  interceptors,
}: RequestOptions): Promise<ResponseData> | never => {
  validateRequest(options)
  return fetch(url, { ...options, ...getHeaders() })
    .then(
      async (response: Response & { json: () => Promise<ResponseData> }): Promise<ResponseData> => {
        if(response.ok)
          return response.json();
        throw await response.json();
      }
    )
    .then((result: ResponseData) => (
      interceptors && interceptors.transformResponse ? <Promise<ResponseData>>interceptors.transformResponse(result) : result
    ))
    .catch(async (error) => {
      if(interceptors && interceptors.onError)
        return error
      throw error
    })
}

const handler = (baseUrl: string, method: RequestMethods, interceptors?: Interceptors) =>
  <ResponseData, Body>({ options = {}, params, url }: {
    options?: RequestInit | { body: Body };
    params?: UrlParams;
    url: string;
  }): Promise<ResponseData> | never => {
    const { body, ...restOptions } = options;
    return doRequest({
      url: getFormatedUrl({ url: baseUrl + url, params }),
      options: {
        ...restOptions,
        method,
        body: (
          typeof body === 'object'
            ? JSON.stringify(body)
            : body
        ) as string
      },
      interceptors
    })
  }

export default (baseUrl: string, interceptors?: Interceptors): Requests => ({
  get: handler(baseUrl, 'get', interceptors),
  post: handler(baseUrl, 'post', interceptors),
  put: handler(baseUrl, 'put', interceptors),
  patch: handler(baseUrl, 'patch', interceptors),
  del: handler(baseUrl, 'delete', interceptors),
})
