import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {  UserList } from './_db.js';
import { typeDefs } from './schema/type-defs.js';
import resolvers from './schema/resolvers.js';

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);