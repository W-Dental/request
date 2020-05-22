import fetchMock from 'jest-fetch-mock'
import Handler, { objectToQueryString, getFormatedUrl, doRequest } from '../src/request'

afterEach(localStorage.clear)
beforeEach(fetchMock.resetMocks)

test.each`
  payload      | expected
  ${undefined} | ${''}
  ${null}      | ${''}
  ${'a=1'}     | ${'?a=1'}
  ${'?a=1'}    | ${'?a=1'}
  ${{ a: 1 }}  | ${'?a=1'}
`('objectToQueryString should return $expected', ({ payload, expected }) => {
  expect(objectToQueryString(payload)).toEqual(expected)
})

test.each`
  url       | params       | expected
  ${'api'}  | ${undefined} | ${''}
  ${'api'}  | ${null}      | ${''}
  ${'api'}  | ${'a=1'}     | ${'?a=1'}
  ${'api'}  | ${'?a=1'}    | ${'?a=1'}
  ${'api'}  | ${{ a: 1 }}  | ${'?a=1'}
  ${'api/'} | ${undefined} | ${''}
  ${'api/'} | ${null}      | ${''}
  ${'api/'} | ${'a=1'}     | ${'?a=1'}
  ${'api/'} | ${'?a=1'}    | ${'?a=1'}
  ${'api/'} | ${{ a: 1 }}  | ${'?a=1'}
`('getFormatedUrl should return api/$expected', ({ url, params, expected }) => {
  expect(getFormatedUrl({ url, params })).toEqual(`api/${expected}`)
})

test('doRequest should return expected data', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }))
  const result = await doRequest<{ a: number }>({ url: '/', options: { method: 'get' } })
  expect(result).toEqual({ a: 1 })
})

test('doRequest should return expected data with transform response adding {transformReponse: `activated`}', async () => {
  type Example = {
    a: number;
    transformReponse?: string;
  }
  fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }))
  const transformResponse = <Example>(data: Example) => { return {...data, transformReponse: `activated`} };
  const result = await doRequest<{ a: number }>({ url: '/', options: { method: 'get' }, config: {interceptors: { transformResponse }} })
  expect(result).toEqual({ a: 1, transformReponse: `activated` })
})

test('doRequest should return a message passing on interceptor onError throwing message onError: fail', async () => {
  type Example = {
    message: string;
  }
  fetchMock.mockRejectOnce( () => Promise.reject({message: 'error'}))
  const onError = <Example>(data: Example) => { return {...data} };
  const result = await doRequest({ url: '/', options: { method: 'get' }, config: {interceptors: { onError }} })
  expect(result).toEqual({message: 'error'})
})

test('doRequest should return on onError {message: "Bad Request"} if not response.ok ', async () => {
  type Example = {
    message: string;
  }
  fetchMock.mockResponseOnce(JSON.stringify({message: 'Bad Request'}), {status: 400});
  const onError = <Example>(data: Example) => { return {...data} };
  const result = await doRequest({ url: '/', options: { method: 'get' }, config: {interceptors: { onError }} })
  expect(result).toEqual({message: 'Bad Request'})
})

test('doRequest should throw an error passing on interceptor onError throwing message onError: fail', async () => {
  fetchMock.mockRejectOnce(new Error('fail'))
  const onError = <Error>(data: Error) => { throw new Error('onError: fail')};
  await expect(doRequest({ url: '/', options: { method: 'get' }, config: {interceptors: { onError }} }))
  .rejects.toThrow('onError: fail')
})


test('doRequest should throw an error', async () => {
  fetchMock.mockRejectOnce(new Error('fail'))
  await expect(doRequest({ url: '/', options: { method: 'get' } }))
    .rejects.toThrow('fail')
})

test('doRequest should not throw an error when it passes option undefined', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }))
  const result = await doRequest<{ a: number }>({ url: '/' })
  expect(result).toEqual({ a: 1 })
})

test.each`
  method
  ${'patch'}
  ${'post'}
  ${'put'}
`('handler.$method should throw an error because it has no body', async ({ method }: { method: 'patch' | 'post' | 'put' }) => {
  try {
    const handler = Handler('/base-url');
    await handler[method]({ url: '/' })
  } catch (error) {
    expect(error.message).toEqual(`A ${method} request must have a body`)
  }
})

test('request handler should return all request methods', () => {
  const methods = Handler('/base-url')
  for (const method of ['del', 'get', 'patch', 'post', 'put']) {
    expect(Object.keys(methods).includes(method)).toBeTruthy();
  }
})

test('post should parse body from object to BodyInit', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }))
  const handler = Handler('/base')
  const result = await handler.post<{ a: number }, { a: number }>({ url: '/api', options: { method: 'post', body: { a: 1 } } })
  expect(result).toEqual({ a: 1 })
})
