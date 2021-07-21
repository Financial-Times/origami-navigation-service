
Origami Navigation Service Data
===============================

Provides the data consumed via [origami-navigation-service].

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]


Table Of Contents
-----------------

  * [How to edit navigation data](#how-to-edit-navigation-data)
  * [Requirements](#requirements)
  * [Operational Documentation](#operational-documentation)
  * [Testing](#testing)
  * [Deployment](#deployment)
  * [Monitoring](#monitoring)
  * [Trouble-Shooting](#trouble-shooting)
  * [License](#license)


How to edit navigation data
---------------------------

The navigation data is written in YAML and can be edited via the Github edit tool.

Steps to edit navigation data:

- Open the navigation data file in the [Github edit tool](https://github.com/Financial-Times/origami-navigation-data/edit/master/data/navigation.yaml)
- Make the necessary changes
- Press the "Commit changes" button
- Add a comment which explains what you are changing and why
- Press the "Create pull request" button
- Someone from [Origami](https://github.com/orgs/Financial-Times/teams/origami-core) will review your changes before merging them into production


Requirements
------------

Running Origami Navigation Service Data requires [Node.js] 10 and [npm].


Testing
-------

The tests are split into unit tests and integration tests. To run tests on your machine you'll need to install [Node.js] and run `make install`. Then you can run the following commands:

```sh
make test              # run all the tests
make test-unit         # run the unit tests
make test-integration  # run the integration tests
```

You can run the unit tests with coverage reporting, which expects 90% coverage or more:

```sh
make test-unit-coverage verify-coverage
```

The code will also need to pass linting on CI, you can run the linter locally with:

```sh
make verify
```

We run the tests and linter on CI, you can view [results on CI][ci]. `make test` and `make lint` must pass before we merge a pull request.


Deployment
----------

The production data is stored in Fastly. We deploy continuously to production via [CI][ci], you should never need to deploy manually.


Monitoring
----------


Trouble-Shooting
----------------


License
-------

The Financial Times has published this software under the [MIT license][license].


[license]: http://opensource.org/licenses/MIT
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[origami-navigation-service]: https://www.ft.com/__origami/service/navigation/v2
[production-url]: https://www.ft.com/__origami/service/navigation-data/
