"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
// Tell winston that you want to link the colors
winston_1.default.addColors(colors);
// Define which level to log based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
// Define format for logs
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Define format for file logs (without colors)
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
// Define transports
const transports = [
    // Console transport
    new winston_1.default.transports.Console({
        format,
    }),
    // Error log file
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // Combined log file
    new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'combined.log'),
        format: fileFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];
// Create the logger
exports.logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format: fileFormat,
    transports,
    exitOnError: false,
});
// Create a stream object for Morgan HTTP logging
exports.stream = {
    write: (message) => {
        exports.logger.http(message.trim());
    },
};
// Log uncaught exceptions
exports.logger.exceptions.handle(new winston_1.default.transports.File({
    filename: path_1.default.join('logs', 'exceptions.log'),
    format: fileFormat,
}));
// Log unhandled promise rejections
exports.logger.rejections.handle(new winston_1.default.transports.File({
    filename: path_1.default.join('logs', 'rejections.log'),
    format: fileFormat,
}));
// Create logs directory if it doesn't exist
const fs_1 = __importDefault(require("fs"));
const logsDir = path_1.default.join(process.cwd(), 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map