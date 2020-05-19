# Request
[![Code Quality](https://api.codacy.com/project/badge/Grade/d46e4e2fac6e439a92ab9f2f992c9de0)](https://app.codacy.com/gh/W-Dental/request?utm_source=github.com&utm_medium=referral&utm_content=W-Dental/request&utm_campaign=Badge_Grade_Dashboard)
[![Coverage Percentage](https://app.codacy.com/project/badge/Coverage/2a9b69c4e705403d9e222ddbde06ea48)](https://www.codacy.com/gh/W-Dental/request?utm_source=github.com&utm_medium=referral&utm_content=W-Dental/request&utm_campaign=Badge_Coverage)
![Minified Size](https://img.shields.io/bundlephobia/min/@w.dental/request)
![Minzipped Size](https://img.shields.io/bundlephobia/minzip/@w.dental/request)

A tiny request handler to facilitate writing requests

## Installation
```
npm i @w.dental/request
```

## How to use

```ts
import request from  'request'

const handler = request('base_url')

type ResponseData = {
  attr: number
}

type BodyParams = {
  param: number
}

handler.get<ResponseData>({
  url: '/api',
  params: { param: 1 }
});

handler.del<ResponseData>({
  url: '/api',
  params: { param: 1 }
});

handler.patch<ResponseData, BodyParams>({
  url: '/api',
  options: { body: { param: 1 } }
});

handler.post<ResponseData, BodyParams>({
  url: '/api',
  options: { body: { param: 1 } }
});

handler.put<ResponseData, BodyParams>({
  url: '/api',
  options: { body: { param: 1 } }
});
```

You can do your own custom request

```ts
import { doRequest } from 'request'

doRequest<{ a: number }>({ 
  url: '/', 
  options: { method: 'get' } 
})
```

`request` offers some function helpers to auxiliate you to create some options and urls to your requests

```ts
import {
  getFormatedUrl,
  getHeaders,
  objectToQueryString
} from 'request'

objectToQueryString('a=1')
objectToQueryString('?a=1')
objectToQueryString({ a: 1 })
// ?a=1

getFormatedUrl({ url: 'api/', params: { a: 1 } })
// this method uses objectToQueryString 
// and returns api/?a=1

getHeaders()
/* return a new Headers which contains
  { 
    'content-type': 'application/json',
    'Authorization': 'bearer {{token in localstorage}}'
  }
*/
```

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FW-Dental%2Frequest.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FW-Dental%2Frequest?ref=badge_large)