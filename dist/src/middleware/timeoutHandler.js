"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutHandler = void 0;
const p_timeout_1 = __importDefault(require("p-timeout"));
const timeoutHandler = ({ fn, time }) => {
    return (0, p_timeout_1.default)(fn(), {
        milliseconds: time || 10000,
    });
};
exports.timeoutHandler = timeoutHandler;
