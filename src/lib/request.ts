const headerValue = (request: any, header): string => {
  const headerKey = Object.keys(request.headers).find(
    key => key.toLowerCase() === header
  );
  return request.headers[headerKey];
};

export class UnsupportedMediaTypeError extends Error {
  public name = 'UnsupportedMediaTypeError';
  constructor(public message: string) {
    super(message);
  }
}

export const bodyDeserializer = (request: any, consumes: string[]) => {
  const contentType = headerValue(request, 'content-type');

  if (!consumes.includes(contentType)) {
    throw new UnsupportedMediaTypeError(
      `Unsupported Media type ${contentType}`
    );
  }

  return JSON.parse(request.body);
};
