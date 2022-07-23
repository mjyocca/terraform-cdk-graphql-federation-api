import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import mercurius, { IResolvers } from 'mercurius';

const buildContext = async (req: FastifyRequest, _reply: FastifyReply) => {
  return {
    authorization: req.headers?.authorization,
  };
};

const users: Record<any, any> = {
  1: {
    id: '1',
    name: 'John',
    username: '@john',
  },
  2: {
    id: '2',
    name: 'Jane',
    username: '@jane',
  },
};

const app = Fastify();
const schema = `
  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers: IResolvers = {
  Query: {
    me: () => {
      return users['1'];
    },
  },
  User: {
    __resolveReference: (source, args, context, info) => {
      return users[source.id];
    },
  },
};

app.register(mercurius, {
  schema,
  resolvers,
  context: buildContext,
  federationMetadata: true,
});

export default app;

const main = async () => {
  await app.listen({ port: 4001 });
  console.log('Admin: listening on port 4001');
};

if (require.main === module) main();
