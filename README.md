
Origami Navigation Service
==========================

Provides consistent navigation for FT applications. See [the production service][production-url] for API information.

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]


Table Of Contents
-----------------

- [Origami Navigation Service](#origami-navigation-service)
  - [Table Of Contents](#table-of-contents)
  - [How to edit navigation data](#how-to-edit-navigation-data)
  - [How to update example markup](#how-to-update-example-markup)
  - [Requirements](#requirements)
  - [Running Locally](#running-locally)
  - [Configuration](#configuration)
    - [Required everywhere](#required-everywhere)
    - [Required in Heroku](#required-in-heroku)
  - [Operational Documentation](#operational-documentation)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Monitoring](#monitoring)
  - [Trouble-Shooting](#trouble-shooting)
    - [What do I do if memory usage is high?](#what-do-i-do-if-memory-usage-is-high)
    - [What if I need to deploy manually?](#what-if-i-need-to-deploy-manually)
  - [License](#license)


How to edit navigation data
---------------------------

The navigation data is written in YAML and can be edited via the Github edit tool.

Steps to edit navigation data:

- Open the navigation data file in the [Github edit tool](https://github.com/Financial-Times/origami-navigation-service/edit/main/data/navigation.yaml)
- All requests for new or altered links, or other content changes to footer needs to be emailed and confirmed by [communications@ft.com](mailto:communications@ft.com) and all changes related to header will need to be consulted with editorial stakeholders.
- Make the necessary changes
- Press the "Commit changes" button
- Add a comment which explains what you are changing and why
- Press the "Create pull request" button
- Someone from [Origami](https://github.com/orgs/Financial-Times/teams/origami-core) will review your changes before merging them into production


How to update example markup
---------------------------

The [Origami Navigation Service example page](https://www.ft.com/__origami/service/navigation/v2/docs/example) displays [o-header](https://registry.origami.ft.com/components/o-header) and [o-footer](https://registry.origami.ft.com/components/o-footer) components populated with the latest navigation data.

To update the example page update the [Handlebars](https://handlebarsjs.com/) templates within the `/views` directory. Do not manually edit `views/partials/build`, files in this directory are generated using `npm run build`. This allows us to generate HTML for [o-header](https://registry.origami.ft.com/components/o-header) using its TSX templates, which can then be included within our Handlebars templates. At the time of writing [o-footer](https://registry.origami.ft.com/components/o-footer) does not yet provide TSX templates.

_Note: Some users choose to copy markup from the example page to get a snapshot of navigation data for o-header and o-footer components, though we do not recommend this in most cases as the data quickly becomes out of date._

Requirements
------------

Running Origami Navigation Service requires [Node.js] and [npm].


Running Locally
---------------

Before we can run the application, we'll need to install dependencies:

```sh
npm install
```
And then we'll need to build the application:

```sh
npm run build
```

Run the application in development mode with

```sh
make run-dev
```

Now you can access the app over HTTP on port `8080`: [http://localhost:8080/__origami/service/navigation/v2](http://localhost:8080/__origami/service/navigation/v2)


Configuration
-------------

We configure Origami Navigation Service using environment variables. In local development, we don't have to configure `.env` file unless you would like to specify `NODE_ENV` or `PORT`. In production, these are set through doppler project config.

### Required everywhere

  * `NODE_ENV`: The environment to run the application in. One of `production`, `development` (default), or `test` (for use in automated tests).
  * `PORT`: The port to run the application on.

### Required in Heroku

  * `CHANGE_API_KEY`: The change-log API key to use when creating and closing change-logs.
  * `CMDB_API_KEY`: The API key to use when performing CMDB operations
  * `FASTLY_PURGE_API_KEY`: A Fastly API key which is used to purge URLs (when somebody POSTs to the `/purge` endpoint)
  * `FT_GRAPHITE_APP_UUID`: The UUID of the application in Graphite.
  * `GRAPHITE_API_KEY`: The FT's internal Graphite API key.
  * `PURGE_API_KEY`: The API key to require when somebody POSTs to the `/purge` endpoint. This should be a non-memorable string, for example a UUID
  * `RELEASE_ENV`: The Salesforce environment to include in change-logs. One of `Test` or `Production`
  * `RELEASE_LOG_API_KEY`: The change request API key to use when creating and closing release logs
  * `RELEASE_LOG_ENVIRONMENT`: The environment to include in release-logs. One of `Test` or `Production`
  * `REGION`: The region the application is running in. One of `QA`, `EU`, or `US`
  * `SENTRY_DSN`: The Sentry URL to send error information to.
  * `SYSTEM_CODE`: The BizOps system code

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
