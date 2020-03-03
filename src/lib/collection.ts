import { eventHandlerFactory } from './event-factory';
import { WrapperConfig } from './config';

export const collection = (config: WrapperConfig): Function => {
  config.outputType = 'collection';
  return eventHandlerFactory(config, ['GET']);
};
