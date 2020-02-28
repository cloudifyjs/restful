import { eventHandlerFactory } from './event-factory';
import { WrapperConfig } from './config';

export const collection = (config: WrapperConfig): Function => {
  return eventHandlerFactory(config, ['GET']);
};
