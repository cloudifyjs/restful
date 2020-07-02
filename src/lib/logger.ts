const noop = (...messages: any[]) => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const logger = {
  log: noop,
  debug: noop,
  info: noop,
  error: noop,
  warn: noop,
};
