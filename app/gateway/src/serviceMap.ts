import type { MercuriusGatewayService } from 'mercurius';

type GQLService = {
  name: string;
  url: Record<string, string>;
};

const serviceList: GQLService[] = [
  {
    name: 'products',
    url: {
      local: 'http://localhost:4003/graphql',
      dev: process.env.GRAPHQL_PRODUCTS_API as string,
    },
  },
  {
    name: 'admin',
    url: {
      local: 'http://localhost:4001/graphql',
      dev: process.env.GRAPHQL_ADMIN_API as string,
    },
  },
];

export const getServices = (): MercuriusGatewayService[] => {
  const env = process.env.NODE_ENV as string;
  return serviceList.map(({ name, url }) => {
    return { name, url: url[env] };
  });
};
