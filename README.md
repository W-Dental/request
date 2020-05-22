# Request
[![DeepScan grade](https://deepscan.io/api/teams/9337/projects/11812/branches/175573/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=9337&pid=11812&bid=175573)
[![codecov](https://codecov.io/gh/W-Dental/request/branch/master/graph/badge.svg)](https://codecov.io/gh/W-Dental/request)
![Minified Size](https://img.shields.io/bundlephobia/min/@w.dental/request)
![Minzipped Size](https://img.shields.io/bundlephobia/minzip/@w.dental/request)

A tiny request handler to facilitate writing requests

## Installation
`npm i @w.dental/request`

### CDN Installation
This package is available on CDNs too ([JSDelivr](https://www.jsdelivr.com/) and [UNPKG](https://unpkg.com/)).

```html
<!-- Using JSDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@w.dental/request"></script>

<!-- Using UNPKG -->
<script src="https://unpkg.com/@w.dental/request"></script>

<script>
  const req = Request.default('https://YOUR.API.com')

  req.get({ url: '/search' })
    .then(data => console.log(data))
</script>
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

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FW-Dental%2Frequest.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FW-Dental%2Frequest?ref=badge_large)