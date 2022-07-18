import Fastify from 'fastify'
import mercurius, { MercuriusGatewayService } from 'mercurius'

const app = Fastify({ logger: { name: 'gateway', level: 'info' } })

const errorHandler = (error: Error, service: MercuriusGatewayService) => {
  if (service.mandatory) {
    app.log.error(error)
  }
}

/* */
const services = [
  {
    name: 'admin',
    url: 'http://localhost:4001/graphql'
  }
]

app.register(mercurius, {
  graphiql: true,
  gateway: {
    services,
    errorHandler,
  }
})

export default app

/* run locally */
const main = async () => {
  await app.listen({ port: 4000 })
  console.log('listening on port 4000')
}

if (require.main === module) main()
/* run locally */