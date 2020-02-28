import { collection } from './lib/collection';
import { document } from './lib/document';
import * as l from './lib/logger';
import * as v from './lib/vendors';

export const api = {
  collection,
  document
};

export const logger = l.logger;
export const vendors = v.vendors;
