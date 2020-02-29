# @cloudifyjs/restful

[![Greenkeeper badge](https://badges.greenkeeper.io/cloudifyjs/restful.svg)](https://greenkeeper.io/)

> FaaS agnostic restful microframework

## Install

```$ npm install @cloudifyjs/restful```

## Features

* Provides cloud agnostic wrappers for RESTful Web Services.
* Minimal configuration.
* Supports [HATEOAS](https://restfulapi.net/hateoas/) principle.
* Supports request validation with [@hapijs/joi](https://github.com/hapijs/joi).
* Supports [RESTful](https://restfulapi.net/) principle.
* Extensible: Plug you own hypster cloud provider as you need.

## Usage

### Fetch a single document

```GET /todos/{id}```

```javascript
const api = require('@cloudifyjs/restful').api

module.exports.get = api.document({
  target: async (path, query, headers) => {
    return {
      id: '123',
      text: 'My task',
      checked: true
    }
  }
})
```

### API Gateway Response:
```json
HTTP 200
Content-Type: 'application/json'

{
  "id": "123",
  "text": "My task",
  "checked": true
}
```

### Fetch a collection

```javascript
const api = require('@cloudifyjs/restful').api

module.exports.get = api.collection({
  target: async (path, query, headers) => {
    return [
      {
        id: '1',
        text: 'My task 1',
        checked: true
      },
      {
        id: '2',
        text: 'My task 2',
        checked: true
      }
    ]
  }
})
```

### API Gateway Response:

```json
HTTP 200
Content-Type: 'application/json'

[
  {
    "id": "1",
    "text": "My task 1",
    "checked": true
  },
  {
    "id": "2",
    "text": "My task 2",
    "checked": true
  }
]
```

### Using Joi validation

```javascript
const Joi = require('@hapi/joi')
const api = require('@cloudifyjs/restful').api

module.exports.get = api.document({
  validators: {
    path: Joi.object({
      id: Joi.string().required()
    })
  },
  target: async (path, query, headers) => {
    return {
      text: 'My task',
      checked: true
    }
  }
})
```

## License

This source code is licensed under the MIT license found in
the [LICENSE.txt](https://github.com/cloudifyjs/restful/blob/master/LICENSE) file.
