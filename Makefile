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
	@$(DONE)

promote:
ifndef CR_API_KEY
	$(error CR_API_KEY is not set, change requests cannot be created. You can find the key in LastPass)
endif
	@heroku pipelines:promote --app origami-navigation-service-qa
	@make change-request-prod
	@echo "Purging all front-end endpoints, this will take 5 minutes, please don't cancel this command."
	@sleep 300 && node ./scripts/purge.js
	@$(DONE)


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
