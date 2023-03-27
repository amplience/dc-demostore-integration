# Develop locally


## Testing new integrations and changes
As `dc-demostore-integration` is just a library, there isn't anything in this project that you can use to manually call and test the methods that you've implemented. For this purpose, we've created a tool called [`dc-integration-tester`](https://github.com/amplience/dc-integration-tester), which imports the `dc-demostore-integration` project and provides a command line interface for each of the codec methods you implement in this project.

By default, the `dc-integration-tester` project will pull a version of `dc-demostore-integration` from Github. You can make it pull your development version by running `npm i <relative directory to dc-demostore-integration>`, which will allow you to test any changes you make to the integration library.

When this project has been changed, you can run `npm run build` to rebuild the contents of the `dist/` folder. Since local directory installs are done via symlink, this will automatically update the package in the projects importing your local copy, so for `dc-integration-tester` you don't need to re-import the library to see your latest changes on the next run of `npm run dev`.

To configure the codecs you use with `dc-integration-tester`, you place their configurations in `integrations.json` with a property name matching the vendor name. There is more information on this in the [`dc-integration-tester` Github Repository.](https://github.com/amplience/dc-integration-tester)

A similar approach can be used on other projects, such as [`dc-extension-ecomm-toolkit`](https://github.com/amplience/dc-extension-ecomm-toolkit), which you can use to test things such as the commonly used product and category selectors within DC. When hosting that extension locally, it will also host its own instance of the middleware, which will allow the extension to circumvent any CORS restrictions placed by codec vendors.
