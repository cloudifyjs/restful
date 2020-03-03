# HTTP Status Codes

## 200 (OK)
It indicates that the `target` function was successfully executed and returns a valid javascript object.

Applied when:
  * HTTP Method: `any`, API Type: `api.document`
  * HTTP Method: `any`, API Type: `api.collection`

## 204 (No Content)
It indicates that the `target` function was successfully executed and returns `null` or `undefined`.

Applied when:
  * `POST|PUT|PATCH|DELETE` - `api.document`

## 400 (Bad Request)
It indicates a malformed request body. For example: an invalid JSON.

The client SHOULD NOT repeat the request without modifications.

Applied when:
  * `POST|PUT|PATCH|DELETE` - `api.document`

## 404 (Not Found)
It indicates that the `target` function was successfully executed and returns `null` or `undefined` in a `GET` http method.

Applied when:
  * `GET` - `api.document`

## 405 (Method Not Allowed)
The API responds with a 405 error to indicate that the client tried to use an HTTP method that the resource does not allow.

Allowed methods:
  * `GET|POST|PUT|PATCH|DELETE` - `api.document`
  * `GET` - `api.collection`

## 412 (Precondition Failed)
The 412 error response indicates an request validation error.

Applied when:
  * `GET|POST|PUT|PATCH|DELETE` - `api.document`
  * `GET|POST|PUT|PATCH|DELETE` - `api.collection`

## 415 (Unsupported Media Type)
The 415 error response indicates that the API is not able to process the client’s supplied media type, as indicated by the Content-Type request header.

Applied when:
  * `GET|POST|PUT|PATCH|DELETE` - `api.document`
  * `GET|POST|PUT|PATCH|DELETE` - `api.collection`

## 500 (Internal Server Error)
500 is the generic REST API error response. Indicates a framework internal error or that the `target` throws an Error.

Applied when:
  * `GET|POST|PUT|PATCH|DELETE` - `api.document`
  * `GET|POST|PUT|PATCH|DELETE` - `api.collection`
