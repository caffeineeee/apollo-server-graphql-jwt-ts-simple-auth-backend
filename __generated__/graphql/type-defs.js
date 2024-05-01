"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
exports.default = (0, apollo_server_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\ntype User {\n    username: String,\n    email: String,\n    password: String,\n    token: String\n}\n\ninput RegisterInput {\n    username: String,\n    email: String,\n    password: String,\n    confirmPassword: String\n}\n\ninput LoginInput {\n    email: String,\n    password: String \n}\n\ntype Query {\n    user(id: ID!): User\n}\n\ntype Mutation {\n    registerUser(registerInput: RegisterInput): User\n    loginUser(loginInput: LoginInput): User\n}\n"], ["\ntype User {\n    username: String,\n    email: String,\n    password: String,\n    token: String\n}\n\ninput RegisterInput {\n    username: String,\n    email: String,\n    password: String,\n    confirmPassword: String\n}\n\ninput LoginInput {\n    email: String,\n    password: String \n}\n\ntype Query {\n    user(id: ID!): User\n}\n\ntype Mutation {\n    registerUser(registerInput: RegisterInput): User\n    loginUser(loginInput: LoginInput): User\n}\n"])));
var templateObject_1;
