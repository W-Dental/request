type RequestDefaultMethods = 'post' | 'get' | 'put' | 'patch';
type RequestMethods = RequestDefaultMethods | 'delete';
type RequestFunctions = RequestDefaultMethods | 'del';

type UrlParams = Record<string, string> | string | null

type RequestMethod = <ResponseData, Body = undefined>(payload: {
  options?: RequestInit | { body: Body };
  params?: UrlParams;
  url: string;
}) => Promise<ResponseData> | never;

type RequestOptions = {
  url: string;
  options?: RequestInit;
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

export const doRequest = <ResponseData>({
  url,
  options = {},
}: RequestOptions): Promise<ResponseData> | never => {
  validateRequest(options)
  return fetch(url, { ...options, ...getHeaders() })
    .then(
      async (response: Response & { json: () => Promise<ResponseData> }): Promise<ResponseData> =>
        response.json()
    )
}

const handler = (baseUrl: string, method: RequestMethods) =>
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
      }
    })
  }

export default (baseUrl: string): Requests => ({
  get: handler(baseUrl, 'get'),
  post: handler(baseUrl, 'post'),
  put: handler(baseUrl, 'put'),
  patch: handler(baseUrl, 'patch'),
  del: handler(baseUrl, 'delete'),
})
