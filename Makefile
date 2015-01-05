-include .scaffold/plugins/js.mk

default:: lint test

test-integration: js-mocha-integration
test: js-test
lint: js-lint

dependecies:
	git submodule update --init

install: dependecies
	npm install
