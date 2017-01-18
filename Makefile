include n.Makefile


# Environment variables
# ---------------------

EXPECTED_COVERAGE = 90


# Verify tasks
# ------------

verify-coverage:
	@istanbul check-coverage --statement $(EXPECTED_COVERAGE) --branch $(EXPECTED_COVERAGE) --function $(EXPECTED_COVERAGE)
	@$(DONE)


# Test tasks
# ----------

test: test-unit-coverage verify-coverage test-integration
	@$(DONE)

test-unit:
	@NODE_ENV=test mocha test/unit --recursive
	@$(DONE)

test-unit-coverage:
	@NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- test/unit --recursive
	@$(DONE)

test-integration:
	@NODE_ENV=test mocha test/integration --recursive --timeout 10000 --slow 2000
	@$(DONE)


# Deploy tasks
# ------------

deploy:
	@git push https://git.heroku.com/origami-navigation-service-qa.git
	@make change-request-qa
	@make grafana-push
	@$(DONE)

promote:
ifndef CR_API_KEY
	$(error CR_API_KEY is not set, change requests cannot be created. You can find the key in LastPass)
endif
	@make update-cmdb
	@heroku pipelines:promote --app origami-navigation-service-qa
	@make change-request-prod
	@echo "Purging all front-end endpoints, this will take 5 minutes, please don't cancel this command."
	@sleep 300 && node ./scripts/purge.js
	@$(DONE)

update-cmdb:
ifndef CMDB_API_KEY
	$(error CMDB_API_KEY is not set, cannot send updates to CMDB. You can find the key in LastPass)
endif
	@curl --silent --show-error -H 'Content-Type: application/json' -H 'apikey: ${CMDB_API_KEY}' -X PUT https://cmdb.ft.com/v2/items/endpoint/origami-navigation-service-eu.herokuapp.com -d @operational-documentation/health-and-about-endpoints.json -f > /dev/null
	@curl --silent --show-error -H 'Content-Type: application/json' -H 'apikey: ${CMDB_API_KEY}' -X PUT https://cmdb.ft.com/v2/items/endpoint/origami-navigation-service-us.herokuapp.com -d @operational-documentation/health-and-about-endpoints.json -f > /dev/null
	@curl --silent --show-error -H 'Content-Type: application/json' -H 'apikey: ${CMDB_API_KEY}' -X PUT https://cmdb.ft.com/v2/items/system/origami-navigation-service -d @operational-documentation/runbook.json -f > /dev/null


# Monitoring tasks
# ----------------

grafana-pull:
ifndef GRAFANA_API_KEY
	$(error GRAFANA_API_KEY is not set)
endif
	@grafana pull origami-navigation-service ./operational-documentation/grafana-dashboard.json

grafana-push:
ifndef GRAFANA_API_KEY
	$(error GRAFANA_API_KEY is not set)
endif
	@grafana push origami-navigation-service ./operational-documentation/grafana-dashboard.json --overwrite


# Change Request tasks
# --------------------

CR_EMAIL=rowan.manning@ft.com
CR_APPNAME=Origami Navigation Service
CR_DESCRIPTION=Release triggered by CI
CR_SERVICE_ID=Origami Navigation Service
CR_NOTIFY_CHANNEL=origami-deploys

change-request-qa:
ifndef CR_API_KEY
	$(error CR_API_KEY is not set, change requests cannot be created. You can find the key in LastPass)
endif
	@release-log \
		--environment "Test" \
		--api-key "$(CR_API_KEY)" \
		--summary "Releasing $(CR_APPNAME) to QA" \
		--description "$(CR_DESCRIPTION)" \
		--owner-email "$(CR_EMAIL)" \
		--service "$(CR_SERVICE_ID)" \
		--notify-channel "$(CR_NOTIFY_CHANNEL)" \
		|| true
	@$(DONE)

change-request-prod:
ifndef CR_API_KEY
	$(error CR_API_KEY is not set, change requests cannot be created. You can find the key in LastPass)
endif
	@release-log \
		--environment "Production" \
		--api-key "$(CR_API_KEY)" \
		--summary "Releasing $(CR_APPNAME) to production" \
		--description "$(CR_DESCRIPTION)" \
		--owner-email "$(CR_EMAIL)" \
		--service "$(CR_SERVICE_ID)" \
		--notify-channel "$(CR_NOTIFY_CHANNEL)" \
		|| true
	@$(DONE)


# Run tasks
# ---------

run:
	@npm start

run-dev:
	@nodemon --ext html,js,json index.js
