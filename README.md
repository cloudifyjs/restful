# @cloudifyjs/restful

[![CircleCI](https://circleci.com/gh/cloudifyjs/restful.svg?style=svg)](https://circleci.com/gh/cloudifyjs/restful)
![npm](https://img.shields.io/npm/v/@cloudifyjs/restful)
![npm](https://img.shields.io/npm/dw/@cloudifyjs/restful)
[![dependencies Status](https://david-dm.org/diegotremper/aws-serverless-restful-wrapper/status.svg)](https://david-dm.org/diegotremper/aws-serverless-restful-wrapper)
[![devDependencies Status](https://david-dm.org/cloudifyjs/restful/dev-status.svg)](https://david-dm.org/cloudifyjs/restful?type=dev)
[![codecov](https://codecov.io/gh/cloudifyjs/restful/branch/master/graph/badge.svg)](https://codecov.io/gh/cloudifyjs/restful)
[![Greenkeeper badge](https://badges.greenkeeper.io/cloudifyjs/restful.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/cloudifyjs/restful/badge.svg?targetFile=package.json)](https://snyk.io/test/github/cloudifyjs/restful?targetFile=package.json)

The @cloudifyjs/restful is a microframework that aims to make the development of RESTful Web Services on top of FaaS free from cloud providers implementations. Develop first and choose the cloud provider later!

## Install

Install with npm:
```
npm install @cloudifyjs/restful --save
```

Install with yarn:
```
yarn add @cloudifyjs/restful
```

## Features

* Provides cloud agnostic wrappers for RESTful Web Services.
* Minimal configuration.
* Supports [HATEOAS](https://restfulapi.net/hateoas/) principle.
* Supports request validation with [@hapijs/joi](https://github.com/hapijs/joi).
* Supports [RESTful](https://restfulapi.net/) principle.
* Extensible: Plug you own hypster cloud provider as you need.
* async/await oriented / No Callback Hell.

## Examples

### api.document(request)

```javascript
const api = require('@cloudifyjs/restful').api

// GET /cars/{id}
module.exports.get = api.document({
  target: async (request) => ({
    id: 1,
    name: 'Model S',
    vendor: 'Tesla'
  })
})

```
**Response:**
```json
HTTP 200
Content-Type: application/json

{
  "id": 1,
  "name": "Model S",
  "vendor": "Tesla"
}
```

Wow! The above example demostrates how to response a document by wrappping a business function that returns a simple JSON.

### api.collection(request)

```javascript
const api = require('@cloudifyjs/restful').api

// GET /cars
module.exports.list = api.collection({
  target: async (request) => ([
    {
      id: 1,
      name: 'Model S',
      vendor: 'Tesla'
    },
    {
      id: 2,
      name: 'Model 3',
      vendor: 'Tesla'
    }
  ])
})

```
**Response:**
```json
HTTP 200
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Model S",
    "vendor": "Tesla"
  },
  {
    "id": 2,
    "name": "Model 3",
    "vendor": "Tesla"
  }
]
```

The @cloudifyjs/restful provides the methods `api.document` and `api.collection` to exposes your RESTful endpoints. These methods handle requests received from the cloud provider (like aws, google, etc.) and deliver to the `target` function a normalized request object.

### Options

- `consumes` `<String[]>` *(Optional)*: list of allowed values in Content-Type header, current only supports JSON formats (e.g. `application/x-javascript`, `text/x-json`). Default: `application/json`
- `vendor` `<String>` *(Optional)*: When specified, will not try automatically detect the cloud environment, currently the build-in vendors are `aws` and `google`.
- `decorator` `<Function>` *(Optional)*: used to provide custom response modification before serialize the `target` function response.
- `links` `<Object>` *(Optional)*: When provided will add links (HATEOAS) for each document returned.
- `target` `<Function>` *(Required)*: Indicates the function that will handle the incoming normalized requests.
- `validators` `<Joi.ObjectSchema>` *(Optional)*: Optional validation to be applied before the incoming request reach the target function, when invalid a `HTTP 400` is returned.
  - `body` `<Joi.ObjectSchema>` *(Optional)* Joi Schema to validate the request body.
  - `headers` `<Joi.ObjectSchema>` *(Optional)* Joi Schema to validate the request headers.
  - `pathParameters` `<Joi.ObjectSchema>` *(Optional)* Joi Schema to validate the request pathParameters.
  - `queryStringParameters` `<Joi.ObjectSchema>` *(Optional)* Joi Schema to validate the request queryStringParameters.

### Logging
TBD

### Custom cloud provider
TBD

## License

This source code is licensed under the MIT license found in
the [LICENSE.txt](https://github.com/cloudifyjs/restful/blob/master/LICENSE) file.
