-include .scaffold/plugins/js.mk

dependecies:
	git submodule update --init

install: dependecies
	npm install

clean::
	-rm -r build node_modules
