# Origami Navigation Service

Provides consistent navigation for FT applications.

## Service Tier

Platinum

## Lifecycle Stage

Production

## Primary URL

https://www.ft.com/__origami/service/navigation/v2

## Host Platform

Heroku

## Contains Personal Data

no

## Contains Sensitive Data

no

## Delivered By

origami-team

## Supported By

origami-team

## Known About By

* lee.moody
* jake.champion
* rowan.manning

## Dependencies

* origami-navigation-service-data
* dyn-dns
* ft-fastly
* heroku

## Healthchecks

* origami-navigation-service-eu.herokuapp.com-https
* origami-navigation-service-us.herokuapp.com-https

## Failover Architecture Type

ActiveActive

## Failover Process Type

FullyAutomated

## Failback Process Type

FullyAutomated

## Data Recovery Process Type

Manual

## Release Process Type

PartiallyAutomated

## Rollback Process Type

PartiallyAutomated

## Key Management Process Type

Manual

## Architecture

This is mostly a Node.js application but with the following external components:

  - An S3 bucket which contains the navigation data as JSON

### Loading Data

1. When this service starts, the first thing it does is fetches a JSON file from an S3 bucket
2. Having loaded the navigation data, the application can begin serving requests
3. While running, this application polls the S3 bucket for new data at a regular interval. If the S3 bucket is not available when it's requested, then a stale in-memory copy is served



## More Information

See the live service for more information on how to use.

## First Line Troubleshooting

There are a few things you can try before contacting the Origami team:

1. Verify that S3 is up. See [Navigation Data's `__gtg` endpoint](https://www.ft.com/__origami/service/navigation-data/__gtg).
2. Restart all of the dynos across the production EU and US Heroku apps ([pipeline here](https://dashboard.heroku.com/pipelines/17603799-00d6-4e45-af5c-c21fb88321aa))

## Second Line Troubleshooting

If the application is failing entirely, you'll need to check a couple of things:

1. Did a deployment just happen? If so, roll it back to bring the service back up (hopefully)
2. Check the Heroku metrics page for both EU and US apps, to see what CPU and memory usage is like ([pipeline here](https://dashboard.heroku.com/pipelines/17603799-00d6-4e45-af5c-c21fb88321aa))
2. Check the Splunk logs (see the monitoring section of this runbook for the link)

If only a few things aren't working, the Splunk logs (see monitoring) are the best place to start debugging. Always roll back a deploy if one happened just before the thing stopped working – this gives you the chance to debug in the relative calm of QA.

## Monitoring

* [Grafana dashboard][grafana]: graph memory, load, and number of requests
* [Pingdom check (Production EU)][pingdom-eu]: checks that the EU production app is responding
* [Pingdom check (Production US)][pingdom-us]: checks that the US production app is responding
* [Sentry dashboard (Production)][sentry-production]: records application errors in the production app
* [Sentry dashboard (QA)][sentry-qa]: records application errors in the QA app
* [Splunk (Production)][splunk]: query application logs

[grafana]: http://grafana.ft.com/dashboard/db/origami-navigation-service
[pingdom-eu]: https://my.pingdom.com/newchecks/checks#check=2287222
[pingdom-us]: https://my.pingdom.com/newchecks/checks#check=2287223
[sentry-production]: https://sentry.io/nextftcom/origami-navigation-service-pro/
[sentry-qa]: https://sentry.io/nextftcom/origami-navigation-service-qa/
[splunk]: https://financialtimes.splunkcloud.com/en-US/app/search/search?q=search%20index%3Dheroku%20source%3D%2Fvar%2Flog%2Fapps%2Fheroku%2Forigami-navigation-service-*

## Failover Details

Our Fastly config automatically routes requests between the production EU and US Heroku applications. If one of those regions is down, Fastly will route all requests to the other region.

## Data Recovery Details

If the data is lost, the S3 bucket would need to be recreated manually. This process should involve a single deploy of the Origami Navigation Data service, so it's relatively simple.

## Release Details

The application is deployed to QA whenever a new commit is pushed to the `master` branch of this repo on GitHub. To release to production, the QA application must be [manually promoted through the Heroku interface](https://dashboard.heroku.com/pipelines/17603799-00d6-4e45-af5c-c21fb88321aa).

## Key Management Details

This service uses two keys:

1. GitHub (with read permissions only)
2. AWS (read/write permissions for a single S3 bucket)

The process for rotating these keys is manual, via the GitHub and AWS interfaces.

