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
/**
 * Paginates Dynamic Content fetch methods.
 * @param pagableFn Method to paginate with
 * @param options Options to pass to the function.
 * @returns Array of the requested resource type.
 */
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
/**
 * Paginates the Dynamic Content facet method with a given query.
 * @param query Facet query
 * @param hub Target hub
 * @returns List of faceted content items
 */
const facetPaginator = (query, hub) => (options) => hub.related.contentItems.facet(query, options);
exports.facetPaginator = facetPaginator;
/**
 * Paginates the Dynamic Content search index list method with a given hub.
 * @param hub The hub to list search indexes for
 * @returns List of search indexes
 */
const searchIndexPaginator = (hub) => (options) => hub.related.searchIndexes.list(undefined, undefined, options);
exports.searchIndexPaginator = searchIndexPaginator;
/**
 * Paginates the Dynamic Content replica list method with a given search index.
 * @param index The search index to list replicas for
 * @returns List of search index replicas.
 */
const replicaPaginator = (index) => (options) => index.related.replicas.list(undefined, options);
exports.replicaPaginator = replicaPaginator;
