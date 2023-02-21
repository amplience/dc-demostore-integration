"use strict";
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
