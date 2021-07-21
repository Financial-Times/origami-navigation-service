# Origami Service Makefile
# ------------------------
# This section of the Makefile should not be modified, it includes
# commands from the Origami service Makefile.
# https://github.com/Financial-Times/origami-service-makefile
include node_modules/@financial-times/origami-service-makefile/index.mk
# [edit below this line]
# ------------------------


# Configuration
# -------------

INTEGRATION_TIMEOUT = 10000
INTEGRATION_SLOW = 2000

SERVICE_NAME = Origami Navigation Service
SERVICE_SYSTEM_CODE = origami-navigation-service
SERVICE_SALESFORCE_ID = $(SERVICE_NAME)

HEROKU_APP_QA = $(SERVICE_SYSTEM_CODE)-qa
HEROKU_APP_EU = $(SERVICE_SYSTEM_CODE)-eu
HEROKU_APP_US = $(SERVICE_SYSTEM_CODE)-us
GRAFANA_DASHBOARD = $(SERVICE_SYSTEM_CODE)

# Test tasks
# ----------

# Default configurations for integration tests
export INTEGRATION_TIMEOUT := 5000
export INTEGRATION_SLOW := 4000

# Run all of the test tasks and verify coverage
test: test-unit-coverage verify-coverage test-integration
	@$(TASK_DONE)

# Run the unit tests using mocha
test-unit:
	@if [ -d test/unit ]; then mocha "test/unit/**/*.test.js" --recursive --bail --exit ${CI:+--forbid-only} && $(TASK_DONE); fi

# Run the unit tests using mocha and generating
# a coverage report if nyc or istanbul are installed
test-unit-coverage:
	@if [ -d test/unit ]; then \
		if [ -x $(NPM_BIN)/nyc ]; then \
			nyc --reporter=text --reporter=html $(NPM_BIN)/_mocha "test/unit/**/*.test.js" --recursive --bail --exit && $(TASK_DONE); \
		else \
			if [ -x $(NPM_BIN)/istanbul ]; then \
				istanbul cover $(NPM_BIN)/_mocha -- "test/unit/**/*.test.js" --recursive --bail --exit && $(TASK_DONE); \
			else \
				make test-unit; \
			fi \
		fi \
	fi

# Run the integration tests using mocha
test-integration:
	npm run build
	@if [ -d test/integration ]; then mocha "test/integration/**/*.test.js" --recursive --bail --exit ${CI:+--forbid-only} --timeout $(INTEGRATION_TIMEOUT) --slow $(INTEGRATION_SLOW) $(INTEGRATION_FLAGS) && $(TASK_DONE); fi
