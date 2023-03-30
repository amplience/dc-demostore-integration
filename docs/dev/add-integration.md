# Add an integration

## Commerce Codec

Commerce Codecs are focused on accessing commerce focused entities, such as products, categories and customer groups. Currently, they are the only codec type supported by this project, though that may change in the future.

You can find a detailed description of all types and methods shared by Commerce Codecs [here](./commerce-codec.md). You should reference this closely when implementing the commerce codec methods for your vendor.

### Template Codec
There is a [template commerce codec](../../src/codec/codecs/commerce/template.ts) that can be used as a starting point when making a new commerce codec. Copy this file into a new folder for your codec (with name `<vendor>/`) and rename it to `index.ts`. You can then begin implementing each commerce codec method.

There are two components to a codec - its codec type, which describes how it is registered and found by users, and the codec itself. Each codec should have its own version of both, with unique names.

The most important thing you should change is the vendor string that the codec type returns:
```ts
    get vendor(): string {
        return 'template'
    }
```
This will let users find your integration. `get properties()` describes what properties should be present in the vendor-specific config in JSON schema format.

Alongside the methods in the template, it's important to implement `cacheCategoryTree` as it is required to fetch any category or the category tree. This method should fetch all categories for the given credentials in a tree structure.

The template codec is very similar to the existing codecs for various vendors, so you can look at those for an example of how methods are implemented, how shared methods are used to query an API with OAuth, or how pagination should be handled.

### Useful Methods
The existing Commerce Codecs share a bunch of helper methods that make it a lot easier to do common tasks, such as OAuth authentication. Here's a list of the ones you should be aware of:

- `axios`: A library for performing HTTP requests. All existing test framework code expects codecs to use axios to access their APIs, so this should be used when doing any HTTP requests for consistency.
- `OAuthRestClient`: An axios powered client that needs to authenticate with OAuth and a client+secret pair. You give this client the credentials, the api base url, and the auth URL. On the first request (and on future requests if the token has expired) it will automatically perform authentication before sending your request. If authentication fails, it will throw a CodecError.
- `paginate`: A method that allows you to get a list of results back from a paginated endpoint, with the requested offset and size. This exists in both page number and cursor variants, which may be useful for different types of API. It is also provided with a method which is used to get a page, which allows it to be used for many different ways of doing pagination. If no offset and size are provided, the method will attempt to fetch all pages.
  - `getPageByQuery`: 
  - `getPageByQueryAxios`: The same as above, but is instead provided with an axios instance to perform requests with, rather than an OAuth client.
- `CodecError`: A common error type that can be returned through the middleware, and returns the same error codes for similar errors in each codec. Additional information can be included in the `info` property. If anything is to go wrong in your codec, it should throw an error of this type.
- `catchAxiosErrors`: This method wraps around any code that can produce an axios error, and converts it into a more friendly `CodecError` that can be returned through the middleware. Can convert common error codes to their appropriate `CodecErrorType`.
- `logResponse`: This method is used to optionally log responses from axios when the user defines the environment variable `LOG_INTEGRATION`. This environment variable is useful for testing your integration, or getting responses to use in unit testing, so it's suggested that you wrap any axios requests with this method.

### Necessary Components

All codec methods should be implemented to the best of your ability. If some functionality does not exist in your target vendor, you should implement it in the codec yourself. Some examples include:

- If your vendor has certain information in the root product instead of the variants, then it should replicate that information to all variants.
- If your vendor doesn't have product variants (or the root product is separate), then it should create at least one representing the root product.
- If your vendor does not support a product search by keyword, it would be confusing if the ecomm toolkit product selector search didn't work at all. You should implement a method that lists all products and filters them manually. 

#### Unit testing

All codec types should have a suite of unit tests that cover the methods defined in the codec interface. A key component of commerce codec testing is providing mock responses from the API for the codec's vendor, and ensuring the codec handles them properly. 

These unit tests should be done in a file called `<vendor>.test.ts`, and fixtures should be placed in a `tests/` folder.

For more information on the unit tests and which key behaviours should be tested, see [this document.](./unit-testing.md)

#### Registration

Finally, you should register your Commerce Codec in `src/codec/index.ts` at the end with the others:

```ts
import ExampleCommerceCodecType from './codecs/commerce/example'
registerCodec(new ExampleCommerceCodecType())
```