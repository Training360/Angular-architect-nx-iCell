import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'store',

  shared: (libraryName, sharedConfig) => {
    if (libraryName.match('@angular')) { return {
      singleton: true,
      strictVersion: true,
      eager: true,
    }}
    return sharedConfig;
  },

  remotes: ['product', 'checkout'],
};

export default config;
