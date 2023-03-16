/**
 * GraphQL request to fetch product information (minimal set required for conversion).
 */
export declare const productShared = "\nid\ntitle\ndescription\ncollections(first: 100) {\n\tedges {\n\t\tnode {\n\t\t\tid\n\t\t\thandle\n\t\t\ttitle\n\t\t\timage {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t\taltText\n\t\t\t}\n\t\t}\n\t\tcursor\n\t}\n\tpageInfo {\n\t\thasNextPage\n\t\tendCursor\n\t}\n}\ntags\nvariants(first: 100) {\n\tedges {\n\t\tnode {\n\t\t\tid\n\t\t\ttitle\n\t\t\tsku\n\t\t\tselectedOptions {\n\t\t\t\tname\n\t\t\t\tvalue\n\t\t\t}\n\t\t\tprice {\n\t\t\t\tcurrencyCode\n\t\t\t\tamount\n\t\t\t}\n\t\t\tunitPrice {\n\t\t\t\tcurrencyCode\n\t\t\t\tamount\n\t\t\t}\n\t\t\tcompareAtPrice {\n\t\t\t\tcurrencyCode\n\t\t\t\tamount\n\t\t\t}\n\t\t\timage {\n\t\t\t\tid\n\t\t\t\turl\n\t\t\t\taltText\n\t\t\t}\n\t\t}\n\t\tcursor\n\t}\n\tpageInfo {\n\t\thasNextPage\n\t\tendCursor\n\t}\n}\nimages(first: 100) {\n\tedges {\n\t\tnode {\n\t\t\tid\n\t\t\turl\n\t\t\taltText\n\t\t}\n\t\tcursor\n\t}\n\tpageInfo {\n\t\thasNextPage\n\t\tendCursor\n\t}\n}\navailableForSale\nhandle";
/**
 * GraphQL request to fetch products by query. (paginated)
 */
export declare const productsByQuery: string;
/**
 * GraphQL request to fetch a product by ID.
 */
export declare const productById: string;
/**
 * GraphQL request to fetch products by category. (paginated)
 */
export declare const productsByCategory: string;
/**
 * GraphQL request to fetch segments. (paginated)
 */
export declare const segments = "\nquery getSegments($pageSize: Int!, $after: String) {\n\tsegments(first: $pageSize, after: $after) {\n\t\tedges {\n\t\t\tnode {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tcursor\n\t\t}\n\t\tpageInfo {\n\t\t\thasNextPage\n\t\t\tendCursor\n\t\t}\n\t}\n}";
/**
 * GraphQL request to fetch collections. (paginated)
 */
export declare const collections = "\nquery getCollections($pageSize: Int!, $after: String){\n\tcollections(first: $pageSize, after: $after) {\n\t\tedges {\n\t\t\tnode {\n\t\t\t\tid\n\t\t\t\thandle\n\t\t\t\ttitle\n\t\t\t\timage {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t\taltText\n\t\t\t\t}\n\t\t\t}\n\t\t\tcursor\n\t\t}\n\t\tpageInfo {\n\t\t\thasNextPage\n\t\t\tendCursor\n\t\t}\n\t}\n}";
