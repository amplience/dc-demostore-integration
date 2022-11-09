"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
const demostoreBaseUri = process.env.NEXT_PUBLIC_DEMOSTORE_BASE_URI || 'https://demostore.amplience.com';
const demostoreSiteUri = `${demostoreBaseUri}/site`;
const demostoreIntegrationUri = `${demostoreSiteUri}/integration`;
const demostoreConfigUri = `${demostoreSiteUri}/demostoreconfig`;
const demostoreProductGridUri = `${demostoreBaseUri}/content/product-grid`;
exports.CONSTANTS = {
    demostoreBaseUri,
    demostoreSiteUri,
    demostoreIntegrationUri,
    demostoreConfigUri,
    demostoreProductGridUri
};
// initialize codecs
require("./codec");
__exportStar(require("./codec"), exports);
__exportStar(require("./amplience"), exports);
__exportStar(require("./common"), exports);
__exportStar(require("./middleware"), exports);
