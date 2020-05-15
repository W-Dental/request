import fetchMock from 'jest-fetch-mock'
import Handler, { objectToQueryString, getFormatedUrl, getHeaders, doRequest } from '../src/request'

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

test.each`
  token
  ${undefined}
  ${'123'}
`('getHeaders() should return expected Headers', ({ token }) => {
  if (token) {
    localStorage.setItem('token', token)
  }
  const headers = getHeaders()
  expect(headers.get('content-type')).toEqual('application/json')
  expect(headers.get('Authorization')).toEqual(token ? `bearer ${token}` : null)
})

test('doRequest should return expected data', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }))
  const result = await doRequest<{ a: number }>({ url: '/', options: { method: 'get' } })
  expect(result).toEqual({ a: 1 })
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
