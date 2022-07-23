import Fastify from 'fastify';
import mercurius, { MercuriusGatewayService } from 'mercurius';
import { getServices } from './serviceMap';
import * as dotenv from 'dotenv-flow';
dotenv.config({ default_node_env: 'dev' });

const app = Fastify({ logger: { name: 'gateway', level: 'info' } });

const errorHandler = (error: Error, service: MercuriusGatewayService) => {
  if (service.mandatory) {
    app.log.error(error);
  }
};

app.register(mercurius, {
  graphiql: true,
  gateway: {
    services: getServices(),
    errorHandler,
  },
});

export default app;

const main = async () => {
  await app.listen({ port: 4000 });
  app.log.info(`Gateway: listening on port 4000`);
};

if (require.main === module) main();
