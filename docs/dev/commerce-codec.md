# Commerce Codecs

Codecs implement a common interface defined by the class `CommerceCodec`, with additional static information defined in `CommerceCodecType`. This document will explain the data types that commerce codec methods can return, the methods that need to be implemented, and how edge cases should be dealt with.

## Types

### Common Types

Both ID and name are core to all types, and must be present in your converted data. The name can also be thought of as the label.

Some types also have a `slug`, such as categories. This is typically present when the ID is a random string, and the resource needs a more memorable identifier. One example would be a product category - its ID could be a GUID, but its slug could be the human readable string `new_arrivals`.

```ts
/**
 * Base resource type with identifiable ID and Name.
 */
export type Identifiable = {
    id: string
    name: string
}

/**
 * Commerce Object with a slug
 */
export type CommerceObject = Identifiable & {
    slug: string
}
```

### Customer Group

Customer groups are used for personalisation. An example use case would be setting a banner ad to appear for different age groups.
Generally, we just want to return all existing group ids and names, so that they can be displayed as options in a selector.

```ts
/**
 * Customer Group
 */
export type CustomerGroup = Identifiable & {
    // id: string (from Identifiable)
    // name: string (from Identifiable)
}
```

### Product

-   On platforms where data we expect to be found in the variant is instead found on the product, duplicate it across all variants.
-   On platforms without variants, just return one variant.
-   You might have to do additional requests to fill out all required information in product variants.
-   Categories and variant lists are mandatory. `parent`, `products` and `children` do not need to be fully hydrated on linked categories.

```ts
/**
 * Product with descriptions, images, categories and variants.
 */
export type Product = CommerceObject & {
    // id: string (from Identifiable)
    // name: string (from Identifiable)
    // slug: string (from CommerceObject)
    shortDescription?: string
    longDescription?: string
    imageSetId?: string
    categories: Category[]
    variants: Variant[]
}
```

### Category

Represents a category of products, with identifiers, an image, tree structure (parent+child) and optionally products.

-   Category slug is used to fetch products by category. It is intended to be a user readable ID that you might find in a URL.
-   `products` does not need to be hydrated unless the user specifically requests the category.

```ts
/**
 * Category with images, products, children and a parent.
 */
export type Category = CommerceObject & {
    // id: string (from Identifiable)
    // name: string (from Identifiable)
    // slug: string (from CommerceObject)
    parent?: Category
    image?: Image
    children: Category[]
    products: Product[]
}
```

### Variant

Variants are versions of a product with unique sku, price and image.

-   ID should be uniquely identifying. Can be equal to SKU, if the platform doesn't have a separate ID.
-   SKU and prices must be defined, and appropriately localized. An empty string SKU is allowed, where the ID should be used as the identifier.
-   Attributes include any other generic data associated with the variant.
-   Ideally a variant should include images with public URL and thumb.

```ts
/**
 * Variant identified by SKU, with price, images and attributes.
 */
export type Variant = {
    id: string
    sku: string
    listPrice: string
    salePrice: string
    defaultImage?: Image
    images: Image[]
    attributes: Dictionary<string>
}

/**
 * Simple image type with an URL and thumbnail URL.
 */
export type Image = {
    url: string
    thumb?: string
}
```

### Promotion

Promotions are currently not used.

```ts
/**
 * Promotion with description, code, an image and activity status.
 */
export type Promotion = Identifiable & {
    // id: string (from Identifiable)
    // name: string (from Identifiable)
    description: string
    promoCode?: string
    isActive: boolean
    image?: Image
}
```

## Methods

#### `getProduct`

Get a single product by ID. This method calls getProducts internally.

##### Edge Cases

-   Product does not exist:
    -   It will receive undefined from getProducts, this will pass undefined as a result.

#### `getProducts` (multiple)

Get multiple products by ID. Returned data must be in the same order as the request.
Missing products must return undefined entries in the list, so that the length of the request and response lists are identical even when assets are missing.

##### Edge Cases

-   One product does not exist:
    -   In the list of returned products, missing IDs correspond to undefined.
-   All products do not exist:
    -   Return a list of all undefined.

#### `getProducts` (keyword)

Get multiple products by keyword.

##### Edge Cases

-   Vendors that don't support keyword filtering should implement it by fetching all products and filtering them in the codec.

#### `getProducts` (category)

Get multiple products by category.

##### Edge Cases

-   Category does not exist:
    -   Must return []. Only getCategory should throw.

#### `getRawProducts`

Get products by ID, without any conversion from the source format.

##### Edge Cases

-   Same as GetProducts, order must be preserved.

#### `getCategory`

Get a category by slug. This must hydrate all fields in the requested category, including products.
For an unhydrated category, look to getCategoryTree.

##### Edge Cases

-   Category does not exist:
    -   Throw a CodecError (NotFound)

#### `getCategoryTree`

Get a list of root level categories.
Sub-categories should be contained in children as a tree, should not appear at root level.

##### Edge Cases

-   If there is no tree of categories, just list all categories.
-   If there are no categories at all, it is valid to return an empty array.

#### `getCustomerGroups`

Get a list of customer groups.

##### Edge Cases

-   When no customer groups are present, it should just return [].

### Special edge cases

-   API error:
    -   When vendors return an error that we don't understand, it should throw a CodecError with `CodecErrorType.ApiError`, and provide the status and message returned by the API as info. The helper method `catchAxiosErrors` can provide this and `NotFound` type errors automatically.
-   Not authenticated:
    -   Vendors which use OAuth should throw an appropriate CodecError if authentication fails for some reason. The default oauth client does this already.
-   Not supported by vendor:
    -   Some vendors do not support all methods. If this is the case, throw a CodecError with `CodecErrorType.NotSupported`.
