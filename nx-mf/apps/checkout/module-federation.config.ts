import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'checkout',
  exposes: {
    './Routes': 'apps/checkout/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
