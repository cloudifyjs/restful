import { eventHandlerFactory } from './event-factory';
import { WrapperConfig } from './config';

export const document = (config: WrapperConfig): Function => {
  config.outputType = 'document';
  return eventHandlerFactory(config, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
};
