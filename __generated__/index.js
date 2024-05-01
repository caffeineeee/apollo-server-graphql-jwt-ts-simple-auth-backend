"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
var resolvers_1 = __importDefault(require("./graphql/resolvers"));
var type_defs_1 = __importDefault(require("./graphql/type-defs"));
require("module-alias/register");
var server = new apollo_server_1.ApolloServer({
    typeDefs: type_defs_1.default,
    resolvers: resolvers_1.default,
    context: function (_a) {
        var req = _a.req;
        return ({ req: req });
    },
});
var apolloServerPort = (_a = process.env.APOLLO_SERVER_PORT) !== null && _a !== void 0 ? _a : 4000;
server
    .listen({ port: apolloServerPort })
    .then(function (res) { return console.log("\nServer running at ".concat(res.url)); });
