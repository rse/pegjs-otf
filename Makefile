##
##  pegjs-otf -- On-The-Fly Compilation for PEG.js
##  Copyright (c) 2014-2025 Dr. Ralf S. Engelschall <rse@engelschall.com>
##
##  Permission is hereby granted, free of charge, to any person obtaining
##  a copy of this software and associated documentation files (the
##  "Software"), to deal in the Software without restriction, including
##  without limitation the rights to use, copy, modify, merge, publish,
##  distribute, sublicense, and/or sell copies of the Software, and to
##  permit persons to whom the Software is furnished to do so, subject to
##  the following conditions:
##
##  The above copyright notice and this permission notice shall be included
##  in all copies or substantial portions of the Software.
##
##  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
##  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
##  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
##  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
##  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
##  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
##  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
##

NPM   = npm
GRUNT = ./node_modules/grunt-cli/bin/grunt

all: build

bootstrap:
	@if [ ! -x $(GRUNT) ]; then $(NPM) install; fi

build: bootstrap
	@$(GRUNT)

clean: bootstrap
	@$(GRUNT) clean:clean

distclean: bootstrap
	@$(GRUNT) clean:clean clean:distclean

test:
	@echo -n "Node usage: "; \
	rm -f node_modules/pegjs-otf; ln -s .. node_modules/pegjs-otf; \
	node sample.js
	@echo -n "Browserify usage: "; \
	browserify -t pegjs-otf/transform -o sample.browser.js sample.js; \
	node sample.browser.js; rm -f sample.browser.js

