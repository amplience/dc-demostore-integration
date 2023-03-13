"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translationsRequest = exports.customerGroupRequest = exports.productRequest = exports.categoryRequest = void 0;
const config_1 = require("./config");
exports.categoryRequest = {
    config: {
        url: config_1.config.codec_params.categoryURL
    },
    url: config_1.config.codec_params.categoryURL
};
exports.productRequest = {
    config: {
        url: config_1.config.codec_params.productURL
    },
    url: config_1.config.codec_params.productURL
};
exports.customerGroupRequest = {
    config: {
        url: config_1.config.codec_params.customerGroupURL
    },
    url: config_1.config.codec_params.customerGroupURL
};
exports.translationsRequest = {
    config: {
        url: config_1.config.codec_params.translationsURL
    },
    url: config_1.config.codec_params.translationsURL
};
