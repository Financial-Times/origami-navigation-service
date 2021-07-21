
Origami Navigation Service
==========================

Provides consistent navigation for FT applications. See [the production service][production-url] for API information.

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]


Table Of Contents
-----------------

  * [How to edit navigation data](#how-to-edit-navigation-data)
  * [Requirements](#requirements)
  * [Running Locally](#running-locally)
  * [Configuration](#configuration)
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

- Open the navigation data file in the [Github edit tool](https://github.com/Financial-Times/origami-navigation-service/edit/master/data/navigation.yaml)
- Make the necessary changes
- Press the "Commit changes" button
- Add a comment which explains what you are changing and why
- Press the "Create pull request" button
- Someone from [Origami](https://github.com/orgs/Financial-Times/teams/origami-core) will review your changes before merging them into production

Requirements
------------

Running Origami Navigation Service requires [Node.js] 10 and [npm].


Running Locally
---------------

Before we can run the application, we'll need to install dependencies:

```sh
npm install
```

Run the application in development mode with

```sh
make run-dev
```

Now you can access the app over HTTP on port `8080`: [http://localhost:8080/](http://localhost:8080/)


Configuration
-------------

We configure Origami Navigation Service using environment variables. In development, configurations are set in a `.env` file. In production, these are set through Heroku config. Further documentation on the available options can be found in the [Origami Service documentation][service-options].

### Required everywhere

  * `NAVIGATION_DATA_STORE`: The location of the JSON navigation data that powers the service. This should be a URL.
  * `NODE_ENV`: The environment to run the application in. One of `production`, `development` (default), or `test` (for use in automated tests).
  * `PORT`: The port to run the application on.

### Required in Heroku

  * `CMDB_API_KEY`: The API key to use when performing CMDB operations
  * `FASTLY_PURGE_API_KEY`: A Fastly API key which is used to purge URLs (when somebody POSTs to the `/purge` endpoint)
  * `GRAPHITE_API_KEY`: The FT's internal Graphite API key.
  * `PURGE_API_KEY`: The API key to require when somebody POSTs to the `/purge` endpoint. This should be a non-memorable string, for example a UUID
  * `REGION`: The region the application is running in. One of `QA`, `EU`, or `US`
  * `CHANGE_API_KEY`: The change-log API key to use when creating and closing change-logs.
  * `RELEASE_ENV`: The Salesforce environment to include in change-logs. One of `Test` or `Production`
  * `SENTRY_DSN`: The Sentry URL to send error information to.

### Required locally

  * `GRAFANA_API_KEY`: The API key to use when using Grafana push/pull

### Headers

The service can also be configured by sending HTTP headers, these would normally be set in your CDN config:

  * `FT-Origami-Service-Base-Path`: The base path for the service, this gets prepended to all paths in the HTML and ensures that redirects work when the CDN rewrites URLs.


Operational Documentation
-------------------------

The source documentation for the [runbook](https://dewey.ft.com/origami-navigation-service.html) and [healthcheck](https://endpointmanager.in.ft.com/manage/origami-navigation-service-eu.herokuapp.com) [endpoints](https://endpointmanager.in.ft.com/manage/origami-navigation-service-us.herokuapp.com) are stored in the `operational-documentation` folder. These files are pushed to CMDB upon every promotion to production. You can push them to CMDB manually by running the following command:
```sh
make cmdb-update
```


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

The production ([EU][heroku-production-eu]/[US][heroku-production-us]) and [QA][heroku-qa] applications run on [Heroku]. We deploy continuously to QA via [CI][ci], you should never need to deploy to QA manually. We use a [Heroku pipeline][heroku-pipeline] to promote QA deployments to production.

You can promote either through the Heroku interface, or by running the following command locally:

```sh
make promote
```


Monitoring
----------

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

You'll need to provide an API key for change request logging. You can get this from Vault in `teams/origami/navigation-service`. Now deploy to QA using the following:

```sh
make deploy
```

License
-------

The Financial Times has published this software under the [MIT license][license].



[grafana]: http://grafana.ft.com/dashboard/db/origami-navigation-service
[heroku-pipeline]: https://dashboard.heroku.com/pipelines/9cd9033e-fa9d-42af-bfe9-b9d0aa6f4a50
[heroku-production-eu]: https://dashboard.heroku.com/apps/origami-navigation-service-eu
[heroku-production-us]: https://dashboard.heroku.com/apps/origami-navigation-service-us
[heroku-qa]: https://dashboard.heroku.com/apps/origami-navigation-service-qa
[heroku]: https://heroku.com/
[license]: http://opensource.org/licenses/MIT
[navigation-data]: https://github.com/Financial-Times/origami-navigation-data
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[pingdom-eu]: https://my.pingdom.com/newchecks/checks#check=2287222
[pingdom-us]: https://my.pingdom.com/newchecks/checks#check=2287223
[production-url]: https://www.ft.com/__origami/service/navigation/v2
[sentry-production]: https://sentry.io/nextftcom/origami-navigation-service-pro/
[sentry-qa]: https://sentry.io/nextftcom/origami-navigation-service-qa/
[service-options]: https://github.com/Financial-Times/origami-service#options
[splunk]: https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20(app%3Dorigami-navigation-v1-eu%20OR%20app%3Dorigami-navigation-v1-us)
