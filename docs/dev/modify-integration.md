# Modify an integration

## Fixing bugs and upgrading APIs

See [Develop Locally](./develop-locally.md) for getting started with your own fork of the project.

If you've identified a part of an existing codec that needs changing, you should first consult the documentation to learn the expected behaviour, then make and test the changes thoroughly. Make sure that you rerun the unit tests against your code to ensure everything still works.

After your changes are complete, make a pull request to the main repository.

## Adding methods and types

The focus of the `dc-demostore-integration` project is providing codecs that translate vendor specific methods and entities into ones that are the same for all vendors, to make it much easier to develop cross-vendor applications. It's for this reason that we suggest implementing a new method for _all_ vendors rather than any specific vendor.

When a common method is added or modified, the `dc-integration-tester` should also be updated to reflect that, as well as the documentation in this project at [`/docs/dev/commerce-codec.md`](./commerce-codec.md), [`/docs/dev/unit-testing.md`](./unit-testing.md). It could also be useful to add this in parallel, to make it easier to test your new method.

## Unit tests

Make sure unit tests are appropriately updated to cover your new or changed functionality. If you fix a bug, then a new test case to verify the bug has been fixed would be useful to prevent it from recurring in the future.