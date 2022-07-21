import type { MercuriusGatewayService } from 'mercurius'

type GQLService = {
  name: string, 
  url: Record<string, string>
}

const serviceList: { name: string, url: Record<string, string> }[] = [
  {
    name: 'products',
    url: {
      local: 'http://localhost:4003/graphql',
      dev: 'https://8qdrxmarq7.execute-api.us-west-2.amazonaws.com/graphql'
    },
  },
  {
    name: 'admin',
    url: {
      local: 'https://localhost:4001/graphql',
      dev: 'https://elov73gzal.execute-api.us-west-2.amazonaws.com/graphql'
    }
  }
]

export const getServices = (env: string): MercuriusGatewayService[] => {
  return serviceList.map(({ name, url }) => {
    return { name, url: url[env] }
  })
}