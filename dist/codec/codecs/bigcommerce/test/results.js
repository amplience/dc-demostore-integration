"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleProduct = exports.exampleMegaMenu = exports.exampleCustomerGroups = void 0;
// BigCommerce Customer Groups result
exports.exampleCustomerGroups = [
    {
        id: '1',
        name: 'High Value'
    }
];
// BigCommerce Category Hierarchy result
exports.exampleMegaMenu = [
    {
        "id": "23",
        "name": "Tout parcourir",
        "slug": "tout-parcourir",
        "children": [],
        "products": []
    },
    {
        "id": "18",
        "name": "Salle de bain",
        "slug": "salle-de-bain",
        "children": [],
        "products": []
    },
    {
        "id": "19",
        "name": "Jardin",
        "slug": "jardin",
        "children": [],
        "products": []
    },
    {
        "id": "21",
        "name": "Cuisine",
        "slug": "cuisine",
        "children": [],
        "products": []
    },
    {
        "id": "20",
        "name": "Publications",
        "slug": "publications",
        "children": [],
        "products": []
    },
    {
        "id": "22",
        "name": "Entretien",
        "slug": "entretien",
        "children": [],
        "products": []
    }
];
// BigCommerce Product result
const exampleProduct = (id) => ({
    id: id,
    "shortDescription": "<p>Née d'une véritable passion pour le café, la marque Able Brewing s'est mis en tête de créer une machine à café aussi esthétique que fonctionnelle. Pour cela, il a fallu imaginer un produit qui s'intégrerait facilement à la routine matinale de chacun et qui saurait mettre en valeur le filtre Kone, amoureusement perfectionné. Inspiré du design japonais et des années 50, cette cafetière infuse les cafés filtre avec élégance. Sa conception en plusieurs blocs permet de retirer la partie supérieure lorsque l'infusion est terminée et de se servir de la partie inférieure comme d'une verseuse. Le revêtement extérieur en céramique passe au lave-vaisselle.</p>\n<p>Fabriqué aux USA</p>\n<p>Dimensions en cm : 20,3 x 15,2</p>\n<p>Capacité : 946 ml</p>",
    "longDescription": "<p>Née d'une véritable passion pour le café, la marque Able Brewing s'est mis en tête de créer une machine à café aussi esthétique que fonctionnelle. Pour cela, il a fallu imaginer un produit qui s'intégrerait facilement à la routine matinale de chacun et qui saurait mettre en valeur le filtre Kone, amoureusement perfectionné. Inspiré du design japonais et des années 50, cette cafetière infuse les cafés filtre avec élégance. Sa conception en plusieurs blocs permet de retirer la partie supérieure lorsque l'infusion est terminée et de se servir de la partie inférieure comme d'une verseuse. Le revêtement extérieur en céramique passe au lave-vaisselle.</p>\n<p>Fabriqué aux USA</p>\n<p>Dimensions en cm : 20,3 x 15,2</p>\n<p>Capacité : 946 ml</p>",
    "slug": "sample-systeme-able-brewing",
    "name": "[Sample] Système Able Brewing",
    "categories": [],
    "variants": [
        {
            "sku": "ABS",
            "listPrice": "$225.00",
            "salePrice": "$0.00",
            "attributes": {}
        }
    ],
});
exports.exampleProduct = exampleProduct;
