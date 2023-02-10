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
exports.paginate = exports.getPageByQueryAxios = exports.getPageByQuery = void 0;
function applyParams(url, params) {
    const isRelative = url.startsWith('/');
    if (isRelative) {
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
function getPageByQuery(offsetQuery, countQuery, totalProp, resultProp) {
    return (client, url, params = {}) => (page, pageSize) => __awaiter(this, void 0, void 0, function* () {
        const allParams = Object.assign(Object.assign({}, params), { [offsetQuery]: page * pageSize, [countQuery]: pageSize });
        const newUrl = applyParams(url, allParams);
        console.log(newUrl);
        const response = yield client.get({ url: newUrl });
        return {
            data: response[resultProp],
            total: response[totalProp]
        };
    });
}
exports.getPageByQuery = getPageByQuery;
function getPageByQueryAxios(offsetQuery, countQuery, totalProp, resultProp) {
    return (axios, url, config, params = {}, dataMutator) => (page, pageSize) => __awaiter(this, void 0, void 0, function* () {
        const allParams = Object.assign(Object.assign({}, params), { [offsetQuery]: page * pageSize, [countQuery]: pageSize });
        url = applyParams(url, allParams);
        const response = yield axios.get(url, config);
        let data = response[resultProp];
        if (dataMutator) {
            data = dataMutator(data);
        }
        return {
            data,
            total: response[totalProp]
        };
    });
}
exports.getPageByQueryAxios = getPageByQueryAxios;
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
            const pagesReturned = Math.floor(data.length / pageCount);
            let dataCount = data.length;
            if (pagesReturned > 0) {
                dataCount = pagesReturned * pageCount;
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
