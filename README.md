
pegjs-otf
=========

This is a small wrapper class around the [PEG.js](http://pegjs.org/) API and a companion
[Browserify](http://browserify.org/) transform for on-the-fly (OTF) compiling [PEG.js](http://pegjs.org/) grammars into
parser code under a syntactically identical usage for both [Node](http://nodejs.org/)/NPM and
Browser/[Browserify](http://browserify.org/) environments.

<p/>
<img src="https://nodei.co/npm/pegjs-otf.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/pegjs-otf.png" alt=""/>

Installation
------------

```shell
$ npm install pegjs-otf
$ npm install browserify
```

Usage
-----

With a sample grammar `sample.pegjs` like this...

```
sample
    = _ "hello" _ who:[A-Za-z]+ _ { return who.join(""); }

_ "blank"
    = (co / ws)*

co "comment"
    = "//" (![\r\n] .)*
    / "/*" (!"*/" .)* "*/"

ws "whitespaces"
    = [ \t\r\n]+
```

...instead of using a `sample.js` driver...

```js
var PEG = require("pegjs-otf");
var fs = require("fs");
var parser = PEG.generate(
    fs.readFileSync(__dirname + "/sample.pegjs", "utf8"),
    { optimize: "size" }
);
console.log(parser.parse("hello world") === "world" ? "OK" : "FAIL");
```

...now use a `sample.js` driver like this:

```js
var PEG = require("pegjs-otf");
var parser = PEG.generateFromFile(
    __dirname + "/sample.pegjs",
    { optimize: "size" }
);
console.log(parser.parse("hello world") === "world" ? "OK" : "FAIL");
```

Then it will work in both Node (through on-the-fly run-time compilation)...

```shell
$ node sample.js
OK
```

...and the Browser (with the help of Browserify through on-the-fly compile-time compilation):

```shell
$ browserify -t pegjs-otf/transform -o sample.browser.js sample.js
$ node sample.browser.js
OK
```

Intention & How It Works
------------------------

The API returned by `require("pegjs-otf")` is really just the PEG.js
API with an additional injected method `generateFromFile(filename,
options)`. And this `generateFromFile(filename, options)`
is actually *not* really some sort of an important
convenience function, because it technically is just
`require("pegjs").generate(require("fs").readFileSync(filename),
options)` and this would not warrant an extra wrapper API, of course.
Instead the `pegjs-otf` module and its distinct `generateFromFile`
method is actually a *marker*.

In a regular [Node](http://nodejs.org/)
environment it really just performs its simple
`require("pegjs").generate(require("fs").readFileSync(filename),
options)` operation. But when the application code is transpiled
for a Browser environment with the help of the excellent
[Browserify](http://browserify.org/), then the `pegjs-otf/transform`
transform can kick in and replaces the `var xx = require("pegjs-otf")`
call with nothing and the `xx.generateFromFile(filename, options)`
call with the corresponding on-the-fly compiled parser code.

This way you need no extra build-time step for neither Node nor Browser
environments just because of PEG.js usage. And both Node and Browser
environments behave identically without having to alter the source.

Rationale
---------

There is another Browserify transform named
[browserify-pegjs](https://github.com/tyler-johnson/browserify-pegjs)
which transpiles `require("sample.pegjs")` calls into the actual
on-the-fly compiled parser code. It has two drawbacks compared to
pegjs-otf: this is fine for Browser environments, but it fails in
regular Node environments and the only way to pass options to PEG.js'
`generate` is via external Browserify options.

The second of the two above drawbacks cannot be resolved. The first
of the two above drawbacks can be circumvented with another module
named [pegjs-require](https://github.com/dbalcomb/pegjs-require).
Unfortunately, this has the same drawback as `browserify-pegjs`: it also
does not allow the passing of options to the underlying `generate`
method.

For those reasons I've written pegjs-otf, as it supports both Node
and Browserify environments and allows the passing of options to
`generate`.

License
-------

Copyright (c) 2014-2021 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

