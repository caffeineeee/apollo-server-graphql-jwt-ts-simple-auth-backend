"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@libsql/client");
var apollo_server_1 = require("apollo-server");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var uuid_1 = require("uuid");
var JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "secret";
var db = (0, client_1.createClient)({
    url: "file:local.db",
});
exports.default = {
    Mutation: {
        registerUser: function (_1, _a) {
            return __awaiter(this, arguments, void 0, function (_, _b) {
                var rows, isOldUserExists, hashedPassword, token, transaction, e_1, newUserData, newUser;
                var _c = _b.registerInput, username = _c.username, email = _c.email, password = _c.password;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            email = email.toLowerCase();
                            return [4 /*yield*/, db.execute({
                                    sql: "\n\t\t\t\tSELECT *\n\t\t\t\tFROM users\n\t\t\t\tWHERE email = (?);",
                                    args: [email],
                                })];
                        case 1:
                            rows = (_d.sent()).rows;
                            isOldUserExists = rows[0];
                            if (!!isOldUserExists) return [3 /*break*/, 10];
                            hashedPassword = bcryptjs_1.default.hashSync(password, 10);
                            token = jsonwebtoken_1.default.sign({
                                user_id: (0, uuid_1.v4)(), // uuidv4() ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                                email: email,
                            }, JWT_SECRET, {
                                expiresIn: "2h",
                            });
                            return [4 /*yield*/, db.transaction("write")];
                        case 2:
                            transaction = _d.sent();
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 6, 7, 8]);
                            // do some operations with the transaction here
                            return [4 /*yield*/, transaction.execute({
                                    sql: "\n\t\t\t\t\t\tINSERT INTO users\n\t\t\t\t\t\t(id, username, email, password, token)\n\t\t\t\t\t\tVALUES (?, ?, ?, ?, ?);\n\t\t\t\t\t\t",
                                    args: [(0, uuid_1.v4)(), username, email, hashedPassword, token],
                                })];
                        case 4:
                            // do some operations with the transaction here
                            _d.sent();
                            // await transaction.execute({
                            // 	sql: "UPDATE books SET name = ? WHERE name = ?",
                            // 	args: ["Pride and Prejudice", "First Impressions"],
                            // });
                            // if all went well, commit the transaction
                            return [4 /*yield*/, transaction.commit()];
                        case 5:
                            // await transaction.execute({
                            // 	sql: "UPDATE books SET name = ? WHERE name = ?",
                            // 	args: ["Pride and Prejudice", "First Impressions"],
                            // });
                            // if all went well, commit the transaction
                            _d.sent();
                            return [3 /*break*/, 8];
                        case 6:
                            e_1 = _d.sent();
                            throw new Error("Error occurred when adding new user\u274C\u274C\u274C\u274C\u274C: ".concat(e_1));
                        case 7:
                            // make sure to close the transaction, even if an exception was thrown
                            // console.log("\nNew user successfully inserted to DB!");
                            transaction.close();
                            return [7 /*endfinally*/];
                        case 8: return [4 /*yield*/, db.execute({
                                sql: "\n\t\t\t\t\tSELECT *\n\t\t\t\t\tFROM users\n\t\t\t\t\tWHERE email = (?)\n\t\t\t\t\tORDER BY created_at DESC\n\t\t\t\t\tLIMIT 1;",
                                args: [email],
                            })];
                        case 9:
                            newUserData = _d.sent();
                            newUser = newUserData.rows[0];
                            // console.log("\nNew user from registerUser: ", newUser);
                            return [2 /*return*/, __assign({}, newUser)];
                        case 10: throw new apollo_server_1.AuthenticationError("A user is already registered with the email.", ["USER_ALREADY_EXISTS"]);
                    }
                });
            });
        },
        loginUser: function (_1, _a) {
            return __awaiter(this, arguments, void 0, function (_, _b) {
                var rows, user, isOneUserExists, token, transaction, e_2, rows_1, user_1;
                var _c = _b.loginInput, email = _c.email, password = _c.password;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            // console.log("\nemail for loginUser(): ", email);
                            // console.log("\npassword for loginUser(): ", password);
                            email = email.toLowerCase();
                            return [4 /*yield*/, db.execute({
                                    sql: "\n\t\t\t\tSELECT *\n\t\t\t\tFROM users\n\t\t\t\tWHERE email = (?)\n\t\t\t\tORDER BY created_at DESC\n\t\t\t\tLIMIT 1;",
                                    args: [email],
                                })];
                        case 1:
                            rows = (_d.sent()).rows;
                            user = rows[0];
                            isOneUserExists = rows.length !== 0;
                            if (!(isOneUserExists &&
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                bcryptjs_1.default.compareSync(password, user.password))) return [3 /*break*/, 10];
                            token = jsonwebtoken_1.default.sign({
                                user_id: (0, uuid_1.v4)(),
                                email: email,
                            }, JWT_SECRET, {
                                expiresIn: "2h",
                            });
                            return [4 /*yield*/, db.transaction("write")];
                        case 2:
                            transaction = _d.sent();
                            _d.label = 3;
                        case 3:
                            _d.trys.push([3, 6, 7, 8]);
                            // do some operations with the transaction here
                            return [4 /*yield*/, transaction.execute({
                                    sql: "\n\t\t\t\t\t\tUPDATE users\n\t\t\t\t\t\tSET token = ?\n\t\t\t\t\t\tWHERE email = ?;",
                                    args: [token, email],
                                })];
                        case 4:
                            // do some operations with the transaction here
                            _d.sent();
                            // if all went well, commit the transaction
                            return [4 /*yield*/, transaction.commit()];
                        case 5:
                            // if all went well, commit the transaction
                            _d.sent();
                            return [3 /*break*/, 8];
                        case 6:
                            e_2 = _d.sent();
                            throw new Error("Error occurred when logging in user\u274C\u274C\u274C\u274C\u274C: ".concat(e_2));
                        case 7:
                            // make sure to close the transaction, even if an exception was thrown
                            transaction.close();
                            return [7 /*endfinally*/];
                        case 8: return [4 /*yield*/, db.execute({
                                sql: "\n\t\t\t\t\tSELECT *\n\t\t\t\t\tFROM users\n\t\t\t\t\tWHERE email = (?)\n\t\t\t\t\tORDER BY created_at DESC\n\t\t\t\t\tLIMIT 1;",
                                args: [email],
                            })];
                        case 9:
                            rows_1 = (_d.sent()).rows;
                            user_1 = rows_1[0];
                            // console.log("\n----------\nUser from loginUser from db: ", user);
                            return [2 /*return*/, __assign({}, user_1)];
                        case 10: throw new apollo_server_1.AuthenticationError("Incorrect credentials", [
                            "INVALID_CREDENTIALS",
                        ]);
                    }
                });
            });
        },
    },
    Query: {
        user: function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
            var rows, user;
            var id = _b.id;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.execute({
                            sql: "\n\t\t\t\tSELECT *\n\t\t\t\tFROM users\n\t\t\t\tWHERE id = (?)\n\t\t\t\tORDER BY created_at DESC\n\t\t\t\tLIMIT 1;",
                            args: [id],
                        })];
                    case 1:
                        rows = (_c.sent()).rows;
                        user = rows[0];
                        if (user) {
                            return [2 /*return*/, __assign({}, user)];
                        }
                        throw new apollo_server_1.AuthenticationError("User not found", ["USER_NOT_EXISTS"]);
                }
            });
        }); },
    },
};
