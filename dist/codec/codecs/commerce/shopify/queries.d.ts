export declare const productShared = "\nid\ntitle\ndescription\ncollections(first: 100) {\n  edges {\n\tnode {\n\t  id\n\t  handle\n\t  title\n\t}\n\tcursor\n  }\n}\ntags\nvariants(first: 100) {\n  edges {\n\tnode {\n\t  id\n\t  title\n\t  sku\n\t  selectedOptions {\n\t\tname\n\t\tvalue\n\t  }\n\t  price {\n\t\tcurrencyCode\n\t\tamount\n\t  }\n\t  unitPrice {\n\t\tcurrencyCode\n\t\tamount\n\t  },\n\t  compareAtPrice {\n\t\tcurrencyCode\n\t\tamount\n\t  }\n\t  image {\n\t\tid\n\t\turl\n\t\taltText\n\t  }\n\t}\n\tcursor\n  }\n}\nimages(first: 100) {\n  edges {\n\tnode {\n\t  id\n\t  url\n\t  altText\n\t}\n\tcursor\n  }\n}\navailableForSale\nhandle";
export declare const productsByQuery: string;
export declare const productById: string;
export declare const productsByCategory: string;
