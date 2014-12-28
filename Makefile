-include .scaffold/plugins/js.mk

dependecies:
	git submodule update --init

install: dependecies
	npm install
