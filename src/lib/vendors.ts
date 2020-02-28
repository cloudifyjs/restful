import google from './built-in-vendors/google';
import aws from './built-in-vendors/aws';

export const vendors = {
  aws,
  google
};

export const autoDetect = (...args: any[]) => {
  const isGoogle =
    args[0] && args[0].headers && args[0].headers['x-cloud-trace-context'];

  return isGoogle ? 'google' : 'aws';
};

export const translate = (vendor: string, ...args: any[]) => {
  return vendors[vendor].apply(null, args);
};
