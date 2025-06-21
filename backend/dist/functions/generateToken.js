"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = "ihwrgt89qou90rqo";
function generateToken(user_email) {
    const token = jsonwebtoken_1.default.sign({ email: user_email }, secret);
    return token;
}
