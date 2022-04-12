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
exports.replicaPaginator = exports.searchIndexPaginator = exports.facetPaginator = exports.paginator = exports.DEFAULT_SIZE = void 0;
exports.DEFAULT_SIZE = 100;
const paginator = (pagableFn, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = yield pagableFn(Object.assign(Object.assign({}, options), { size: exports.DEFAULT_SIZE }));
    if (currentPage.page &&
        currentPage.page.number !== undefined &&
        currentPage.page.totalPages !== undefined &&
        currentPage.page.number + 1 < currentPage.page.totalPages) {
        return [
            ...currentPage.getItems(),
            ...(yield (0, exports.paginator)(pagableFn, Object.assign(Object.assign({}, options), { page: currentPage.page.number + 1 })))
        ];
    }
    return currentPage.getItems();
});
exports.paginator = paginator;
const facetPaginator = (query, hub) => (options) => hub.related.contentItems.facet(query, options);
exports.facetPaginator = facetPaginator;
const searchIndexPaginator = (hub) => (options) => hub.related.searchIndexes.list(undefined, undefined, options);
exports.searchIndexPaginator = searchIndexPaginator;
const replicaPaginator = (index) => (options) => index.related.replicas.list(undefined, options);
exports.replicaPaginator = replicaPaginator;
