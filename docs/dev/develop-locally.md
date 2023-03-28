# Develop locally

Developing for `dc-demostore-integration` is as easy as forking the repository, cloning it locally, and then committing and making a pull request back to the main project. 

For help with specific aspects of development, see the following documents:

- [Add an Integration](./add-integration.md)
- [Modify an Integration](./modify-integration.md)
- [Unit Testing](./unit-testing.md)

## Testing new integrations and changes

As `dc-demostore-integration` is just a library, there isn't anything in this project that you can use to manually call and test the methods that you've implemented. For this purpose, we've created a tool called [`dc-integration-tester`](https://github.com/amplience/dc-integration-tester), which imports the `dc-demostore-integration` project and provides a command line interface for each of the codec methods you implement in this project.

By default, the `dc-integration-tester` project will pull a version of `dc-demostore-integration` from Github. You can make it pull your development version by running `npm i <relative directory to dc-demostore-integration>`, which will allow you to test any changes you make to the integration library.

When this project has been changed, you can run `npm run build` to rebuild the contents of the `dist/` folder. Since local directory installs are done via symlink, this will automatically update the package in the projects importing your local copy, so for `dc-integration-tester` you don't need to re-import the library to see your latest changes on the next run of `npm run dev`.

To configure the codecs you use with `dc-integration-tester`, you place their configurations in `integrations.json` with a property name matching the vendor name. There is more information on this in the [`dc-integration-tester` Github Repository.](https://github.com/amplience/dc-integration-tester)

A similar approach can be used on other projects, such as [`dc-extension-ecomm-toolkit`](https://github.com/amplience/dc-extension-ecomm-toolkit), which you can use to test things such as the commonly used product and category selectors within DC. When hosting that extension locally, it will also host its own instance of the middleware, which will allow the extension to circumvent any CORS restrictions placed by codec vendors.

### Custom versions and importing into applications

If you have made changes that you don't want to upstream, but want to use in your own application or extension, then you can either import your modified library locally as above, or clone the repository and import it from there. An example way of importing from a repository:

`npm i https://github.com/amplience/dc-demostore-integration.git#branch-name`
(where `branch-name` is the name of your target branch)

See [Host](./host.md) and [Import](./import.md) for more information.

Note that you need to `npm run build` and commit the changes made to `dest/` for users of the library to see your changes.
