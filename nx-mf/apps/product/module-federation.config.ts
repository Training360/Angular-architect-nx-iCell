import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'product',
  exposes: {
    './Routes': 'apps/product/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
