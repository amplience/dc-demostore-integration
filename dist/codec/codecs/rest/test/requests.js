"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translationsRequest = exports.customerGroupRequest = exports.productRequest = exports.categoryRequest = void 0;
const config_1 = require("./config");
exports.categoryRequest = {
    config: {
        url: config_1.config.categoryURL
    },
    url: config_1.config.categoryURL
};
exports.productRequest = {
    config: {
        url: config_1.config.productURL
    },
    url: config_1.config.productURL
};
exports.customerGroupRequest = {
    config: {
        url: config_1.config.customerGroupURL
    },
    url: config_1.config.customerGroupURL
};
exports.translationsRequest = {
    config: {
        url: config_1.config.translationsURL
    },
    url: config_1.config.translationsURL
};
