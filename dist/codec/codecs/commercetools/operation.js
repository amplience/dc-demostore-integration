"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const lodash_1 = __importDefault(require("lodash"));
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
/**
 * The base class for all operations.
 *
 * @public
 */
class Operation {
    constructor(config) {
        this.config = config;
    }
    import(native) {
        return native;
    }
    export(context) {
        return native => native;
    }
    get(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.method = 'get';
            return yield this.doRequest(context);
        });
    }
    post(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.method = 'post';
            return yield this.doRequest(context);
        });
    }
    put(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.method = 'put';
            return yield this.doRequest(context);
        });
    }
    delete(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.method = 'delete';
            return yield this.doRequest(context);
        });
    }
    getURL(context) {
        return `${this.getBaseURL()}${this.getRequestPath(context)}`;
    }
    getBaseURL() {
        throw "getBaseURL must be defined in an operation subclass";
    }
    getRequestPath(context) {
        return "";
    }
    getRequest(context) {
        return this.getURL(context).toString();
    }
    postProcessor(context) {
        return native => native;
    }
    doRequest(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the URL from the backend
            let url = this.getRequest(context);
            context.args = context.args || {};
            try {
                const httpsAgent = new https_1.default.Agent({ rejectUnauthorized: false });
                let requestParams = { url, method: context.method, headers: yield this.getHeaders() };
                if (context.args.body) {
                    requestParams.data = context.args.body;
                }
                console.log(`[ ${context.method.toUpperCase()} ] ${requestParams.url}`);
                // next, execute the request with headers gotten from the backend
                let response = yield axios_1.default(Object.assign(Object.assign({}, requestParams), { httpsAgent }));
                // log the response object
                // mask the auth token first if there is one
                if (requestParams.headers['authorization']) {
                    // requestParams.headers['authorization'] = requestParams.headers['authorization'].substring(0, requestParams.headers['authorization'].length - 8) + `********`
                }
                let x = yield this.translateResponse(response.data, lodash_1.default.bind(this.export(context), this));
                if (x) {
                    let px = yield this.postProcessor(context);
                    if (px) {
                        x.results = yield px(x.results);
                    }
                    if (context.args.id || context.args.slug || requestParams.url.indexOf('where=slug') > -1 || requestParams.url.indexOf('/key=') > -1) {
                        return lodash_1.default.first(x.results);
                    }
                    else {
                        return x;
                    }
                }
                else if (context.args.method === 'delete') {
                    return context.args.id;
                }
            }
            catch (error) {
                console.error(error);
            }
            return {};
        });
    }
    translateResponse(data, arg1) {
        throw "Method not implemented.";
    }
    getHeaders() {
        return {};
    }
}
exports.Operation = Operation;
