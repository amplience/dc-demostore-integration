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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateCursor = exports.paginate = exports.getPageByQueryAxios = exports.getPageByQuery = void 0;
const common_1 = require("./common");
/**
 * Get an URL with added params from the given object.
 * @param url The original URL
 * @param params The params to append to the URL
 * @returns The URL with the added params
 */
function applyParams(url, params) {
    const isRelative = url.startsWith('/');
    if (isRelative) {
        // TODO: better solution?
        url = 'http://a' + url;
    }
    const urlObj = new URL(url);
    for (const key of Object.keys(params)) {
        urlObj.searchParams.append(key, params[key]);
    }
    url = urlObj.toString();
    if (isRelative) {
        url = url.substring(8);
    }
    return url;
}
/**
 * Return a method that maps from an object to a property within it defined by the given string, if a custom one is not provided.
 * @param mapper Mapping string or method
 * @returns Mapping method
 */
function getPropMapper(mapper) {
    if (typeof mapper === 'string') {
        return (data) => data[mapper];
    }
    return mapper;
}
/**
 * Return a generator for a function that gets a page from an oauth endpoint with query parameters.
 * @param offsetQuery Query key to use for item offset
 * @param countQuery Query key to use for page size
 * @param totalProp Property to extract total assets from
 * @param resultProp Property to extract result items from
 * @returns A generator that takes a client, url and base params and generates a function that gets a page.
 */
function getPageByQuery(offsetQuery, countQuery, totalProp, resultProp) {
    const totalPropMap = getPropMapper(totalProp);
    const resultPropMap = getPropMapper(resultProp);
    return (client, url, params = {}) => (page, pageSize) => __awaiter(this, void 0, void 0, function* () {
        const allParams = Object.assign(Object.assign({}, params), { [offsetQuery]: page * pageSize, [countQuery]: pageSize });
        const newUrl = applyParams(url, allParams);
        const response = yield client.get({ url: newUrl });
        (0, common_1.logResponse)('get', newUrl, response);
        if (response == null) {
            return {
                data: [],
                total: 0
            };
        }
        return {
            data: resultPropMap(response),
            total: totalPropMap(response)
        };
    });
}
exports.getPageByQuery = getPageByQuery;
/**
 * Return a generator for a function that gets a page using an axios client with query parameters.
 * @param offsetQuery Query key to use for item offset
 * @param countQuery Query key to use for page size
 * @param totalProp Property to extract total assets from
 * @param resultProp Property to extract result items from
 * @returns A generator that takes a client, url and base params and generates a function that gets a page.
 */
function getPageByQueryAxios(offsetQuery, countQuery, totalProp, resultProp) {
    const totalPropMap = getPropMapper(totalProp);
    const resultPropMap = getPropMapper(resultProp);
    return (axios, url, config, params = {}) => (page, pageSize) => __awaiter(this, void 0, void 0, function* () {
        const allParams = Object.assign(Object.assign({}, params), { [offsetQuery]: page * pageSize, [countQuery]: pageSize });
        const newUrl = applyParams(url, allParams);
        const response = yield axios.get(newUrl, config);
        (0, common_1.logResponse)('get', newUrl, response.data);
        return {
            data: resultPropMap(response.data),
            total: totalPropMap(response.data)
        };
    });
}
exports.getPageByQueryAxios = getPageByQueryAxios;
/**
 * Iterate through fetching pages and build an array out of the results.
 * @param requestPage Method to use to request pages. Takes page number and size. Must return at least one page-size worth of items if the total allows it.
 * @param pageSize Page size (default: 20)
 * @param pageNum Page number to start at (default: 0)
 * @param pageCount Number of pages to fetch (default: all)
 * @returns List of items fetched from the paginated endpoint
 */
function paginate(requestPage, pageSize = 20, pageNum = 0, pageCount) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = [];
        if (pageCount === undefined) {
            pageCount = Infinity;
        }
        const startOffset = pageNum * pageSize;
        const targetCount = pageCount * pageSize;
        for (let i = 0; i < pageCount; i++) {
            const { data, total } = yield requestPage(pageNum + i, pageSize);
            // There's a possibility that the implementation has returned more than one page.
            // Allow multiple pages to be completed at a time.
            const pagesReturned = Math.floor(data.length / pageSize);
            let dataCount = data.length;
            if (pagesReturned > 0) {
                dataCount = pagesReturned * pageSize;
                i += pagesReturned - 1;
            }
            const targetMin = Math.min(total - startOffset, targetCount);
            const end = targetMin - result.length;
            const toAdd = Math.min(dataCount, end);
            result.push(...(data.slice(0, toAdd)));
            if (result.length === targetMin) {
                break;
            }
        }
        return result;
    });
}
exports.paginate = paginate;
function paginateCursor(requestPage, pageSize = 20, cursor, pageCount) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = [];
        if (pageCount === undefined) {
            pageCount = Infinity;
        }
        const targetCount = pageCount * pageSize;
        for (let i = 0; i < pageCount; i++) {
            const { data, hasNext, nextCursor } = yield requestPage(cursor, pageSize);
            const dataCount = data.length;
            const end = targetCount - result.length;
            const toAdd = Math.min(dataCount, end);
            result.push(...(data.slice(0, toAdd)));
            cursor = nextCursor;
            if (!hasNext) {
                return {
                    data: result,
                    hasNext: false,
                    nextCursor: cursor
                };
            }
            else if (result.length === targetCount) {
                break;
            }
        }
        return {
            data: result,
            hasNext: true,
            nextCursor: cursor
        };
    });
}
exports.paginateCursor = paginateCursor;
