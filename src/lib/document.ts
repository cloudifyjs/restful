import { eventHandlerFactory } from './event-factory';
import { WrapperConfig } from './config';

export const document = (config: WrapperConfig): Function => {
  return eventHandlerFactory(config, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
};
