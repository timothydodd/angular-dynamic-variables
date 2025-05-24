import { Environment } from "../app/_services/config.service";

export const environment: Environment = {
  production: true,
  cache: {
    logging: false,
  },
  apiUrl: window.location.origin,
  favColor: 'yellow',
  favCatchPhrase: 'I like producing',
};
