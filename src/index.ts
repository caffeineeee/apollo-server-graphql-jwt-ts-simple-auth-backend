import { ApolloServer } from "apollo-server";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/type-defs";
import "module-alias/register";

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
});

const apolloServerPort = process.env.APOLLO_SERVER_PORT ?? 4000;

server
	.listen({ port: apolloServerPort })
	.then((res) => console.log(`\nServer running at ${res.url}`));
