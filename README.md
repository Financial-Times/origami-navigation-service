
Origami Navigation Service
==========================

Provides consistent navigation for FT applications. See [the production service][production-url] for API information.

**:exclamation: If you need to edit the links that the Navigation Service provides, this isn't the right place – you need to edit files in the [Origami Navigation Data repo][navigation-data]**

**:warning: This is V2 of the navigation service, and is currently in development. If you're looking for the code that's running in production, see the [V1 Navigation Service repo](https://github.com/Financial-Times/origami-navigation-service-v1)**

[![Build status](https://img.shields.io/circleci/project/Financial-Times/origami-navigation-service.svg)][ci]
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]


Table Of Contents
-----------------

  * [Requirements](#requirements)
  * [Running Locally](#running-locally)
  * [Configuration](#configuration)
  * [Testing](#testing)
  * [Deployment](#deployment)
  * [Monitoring](#monitoring)
  * [Trouble-Shooting](#trouble-shooting)
  * [License](#license)


Requirements
------------

Running Origami Navigation Service requires [Node.js] 6.x and [npm].


Running Locally
---------------

Before we can run the application, we'll need to install dependencies:

```sh
make install
```

Run the application in development mode with

```sh
make run-dev
```

Now you can access the app over HTTP on port `8080`: [http://localhost:8080/](http://localhost:8080/)


Configuration
-------------

We configure Origami Navigation Service using environment variables. In development, configurations are set in a `.env` file. In production, these are set through Heroku config.

  * `PORT`: The port to run the application on.
  * `NODE_ENV`: The environment to run the application in. One of `production`, `development` (default), or `test` (for use in automated tests).
  * `LOG_LEVEL`: A Syslog-compatible level at which to emit log events to stdout. One of `trace`, `debug`, `info`, `warn`, `error`, or `crit`.
  * `RAVEN_URL`: The Sentry URL to send error information to.

The service can also be configured by sending HTTP headers, these would normally be set in your CDN config:

  * `FT-Origami-Service-Base-Path`: The base path for the service, this gets prepended to all paths in the HTML and ensures that redirects work when the CDN rewrites URLs.


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

We run the tests and linter on CI, you can view [results on CircleCI][ci]. `make test` and `make lint` must pass before we merge a pull request.


Deployment
----------

The production ([EU][heroku-production-eu]/[US][heroku-production-us]) and [QA][heroku-qa] applications run on [Heroku]. We deploy continuously to QA via [CircleCI][ci], you should never need to deploy to QA manually. We use a [Heroku pipeline][heroku-pipeline] to promote QA deployments to production.

You'll need to provide an API key for change request logging. You can get this from the Origami LastPass folder in the note named `Change Request API Keys`. Now deploy the last QA image by running the following:

```sh
CR_API_KEY=<API-KEY> make promote
```


Monitoring
----------

**TODO correct these URLs once we have them – some still point to the Image Service checks**

  * [Grafana dashboard][grafana]: graph memory, load, and number of requests
  * [Pingdom check (Production EU)][pingdom-eu]: checks that the EU production app is responding
  * [Pingdom check (Production US)][pingdom-us]: checks that the US production app is responding
  * [Sentry dashboard (Production)][sentry-production]: records application errors in the production app
  * [Sentry dashboard (QA)][sentry-qa]: records application errors in the QA app
  * [Splunk (Production)][splunk]: query application logs


Trouble-Shooting
----------------

We've outlined some common issues that can occur in the running of the Navigation Service:

### What do I do if memory usage is high?

For now, restart the Heroku dynos:

```sh
heroku restart --app origami-navigation-service-eu
heroku restart --app origami-navigation-service-us
```

If this doesn't help, then a temporary measure could be to add more dynos to the production applications, or switch the existing ones to higher performance dynos.

### What if I need to deploy manually?

If you _really_ need to deploy manually, you should only do so to QA. Production deploys should always be a promotion from QA.

You'll need to provide an API key for change request logging. You can get this from the Origami LastPass folder in the note named `Change Request API Keys`. Now deploy to QA using the following:

```sh
CR_API_KEY=<API-KEY> make deploy
```


License
-------

The Financial Times has published this software under the [MIT license][license].



[ci]: https://circleci.com/gh/Financial-Times/origami-navigation-service
[grafana]: http://grafana.ft.com/dashboard/db/origami-navigation-service-v2
[heroku-pipeline]: https://dashboard.heroku.com/pipelines/9cd9033e-fa9d-42af-bfe9-b9d0aa6f4a50
[heroku-production-eu]: https://dashboard.heroku.com/apps/origami-navigation-service-eu
[heroku-production-us]: https://dashboard.heroku.com/apps/origami-navigation-service-us
[heroku-qa]: https://dashboard.heroku.com/apps/origami-navigation-service-qa
[heroku]: https://heroku.com/
[license]: http://opensource.org/licenses/MIT
[navigation-data]: https://github.com/Financial-Times/origami-navigation-data
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[pingdom-eu]: https://my.pingdom.com/newchecks/checks#check=2301115
[pingdom-us]: https://my.pingdom.com/newchecks/checks#check=2301117
[production-url]: https://www.ft.com/__origami/service/navigation/v2
[sentry-production]: https://sentry.io/nextftcom/origami-navigation-service-producti/
[sentry-qa]: https://sentry.io/nextftcom/origami-navigation-service-qa/
[splunk]: https://financialtimes.splunkcloud.com/
