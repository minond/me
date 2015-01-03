-include .scaffold/plugins/js.mk

default:: lint test

dependecies:
	git submodule update --init

install: dependecies
	npm install

test: js-test
lint: js-lint
