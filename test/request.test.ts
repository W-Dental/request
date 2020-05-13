import { objectToQueryString, getFormatedUrl, getHeaders } from '../src/request'

afterEach(localStorage.clear)

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
  payload      | expected
  ${undefined} | ${''}
  ${null}      | ${''}
  ${'a=1'}     | ${'?a=1'}
  ${'?a=1'}    | ${'?a=1'}
  ${{ a: 1 }}  | ${'?a=1'}
`('getFormatedUrl should return api/$expected', ({ payload, expected }) => {
  const handler = getFormatedUrl('api')
  expect(handler(payload)).toEqual(`api/${expected}`)
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
/*
import HttpHandler from './httpHandler'
import { clear, setItem } from '../../storage'

beforeEach(clear)

test('url should be {api} + {resource}', () => {
  const handler = new HttpHandler('/resource', 'host')

  expect(handler.url).toEqual('host/resource')
})

test.each`
  payload         | expected
  ${undefined}  | ${''}
  ${null}       | ${''}
  ${{ a: 1 }}   | ${'?a=1'}
`('should convert object to querystring', ({ payload, expected }) => {
  const handler = new HttpHandler('/resource', 'host')
  expect(handler._jsonToQueryString(payload)).toEqual(expected)
})

test.each`
  params        | expected
  ${undefined}  | ${''}
  ${null}       | ${''}
  ${{ a: 1 }}   | ${'?a=1'}
  ${'?a=1'}     | ${'?a=1'}
`('should generate an expected url', ({ params, expected }) => {
  const handler = new HttpHandler('/resource', 'host')
  expect(handler._buildUrl(params)).toEqual(`host/resource/${expected}`)
})

test.each`
  token
  ${undefined}
  ${'abc'}
`('should return an object if has no token else an auth bearer', ({ token }) => {
  const handler = new HttpHandler('/resource', 'host')
  if (token) {
    setItem('token', token)
  }
  expect(handler._getAuthorizationHeader())
    .toEqual(token ? { Authorization: `bearer ${token}` } : {})
})

test.each`
  method      | body
  ${'get'}    | ${undefined}
  ${'post'}   | ${undefined}
  ${'post'}   | ${{ a: 1 }}
  ${'put'}    | ${undefined}
  ${'put'}    | ${{ a: 1 }}
  ${'delete'} | ${undefined}
  ${'patch'}  | ${undefined}
  ${'patch'}  | ${{ a: 1 }}
`('should return expected configuration', ({ method, body }) => {
  const handler = new HttpHandler('/resource', 'host')
  expect(handler.getConf(method, body))
    .toEqual({
      method,
      headers: { 'content-type': 'application/json' },
      mode: 'cors',
      body: body ? JSON.stringify(body) : undefined
    })
})

test('getConf should call getAuthorizationHeader', () => {
  const handler = new HttpHandler('/resource', 'host')
  const spy = jest.spyOn(handler, '_getAuthorizationHeader')
  handler.getConf('get')
  expect(spy).toHaveBeenCalled()
})

test('request write should throws an error when it has no body', async () => {
  const handler = new HttpHandler('/resource', 'host')
  await expect(handler.requestWrite())
    .rejects.toThrow('This request needs body')
})

test('request write should throws an error when it has no method', async () => {
  const handler = new HttpHandler('/resource', 'host')
  await expect(handler.requestWrite({ a: 1 }))
    .rejects.toThrow('This request needs method')
})

test('requestWrite should return a response', async () => {
  const responseData = { data: { hasValue: true } }
  fetch.mockResponseOnce(JSON.stringify(responseData))

  const handler = new HttpHandler('/resource', 'host')
  const result = await handler.requestWrite({}, 'post')

  expect(result).toEqual(responseData)
})

test('requestWrite should throw an error', async () => {
  const error = new Error('Fail')
  fetch.mockRejectOnce(error)
  const handler = new HttpHandler('/resource', 'host')

  await expect(handler.requestWrite({}, 'post')).rejects.toThrow(error)
})

test('requestWrite should call onError', async () => {
  fetch.mockResponseOnce(() => Promise.resolve({
    body: JSON.stringify({ hasError: true }),
    status: 400
  }))
  const handler = new HttpHandler('/resource', 'host')
  const spy = jest.spyOn(handler, 'onError')
  try {
    await handler.requestWrite({}, 'post')
  } catch (e) {
    expect(e.message).toEqual('Ocorreu um erro inesperado.')
    expect(spy).toHaveBeenCalledWith({
      statusCode: 400,
      data: { hasError: true }
    })
  }
})

test.each`
  messages                          | expected
  ${undefined}                      | ${'Ocorreu um erro inesperado.'}
  ${null}                           | ${'Ocorreu um erro inesperado.'}
  ${[]}                             | ${'Ocorreu um erro inesperado.'}
  ${[{ text: 'test' }]}             | ${'test'}
  ${[{ text: 'a' }, { text: 'b' }]} | ${'a, b'}
`('requestWrite should throw expected error message',
  async ({ messages, expected }) => {
    fetch.mockResponseOnce(() => Promise.resolve({
      body: JSON.stringify({
        hasError: true,
        messages
      }),
      status: 400
    }))
    const handler = new HttpHandler('/resource', 'host')
    await expect(handler.requestWrite({}, 'post'))
      .rejects.toThrow(expected)
  }) */
