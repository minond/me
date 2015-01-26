-include .scaffold/plugins/js.mk

default:: lint test

test: js-test
lint: js-lint
check: lint test test-integration js-mocha-coverage

test-integration: export STORAGE_COLL=points-test
test-integration: export STORAGE_NAME=me-test
test-integration: js-mocha-integration

dependecies:
	git submodule update --init

install: dependecies
	npm install

sync:
	@DEBUG=* node sync --since 2015-01-01
