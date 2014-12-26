
node-pegjs-otf
==============

On-The-Fly Compilation for PEG.js (in Node and via Browserify)

<p/>
<img src="https://nodei.co/npm/node-pegjs-otf.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/node-pegjs-otf.png" alt=""/>

About
-----

This is a small wrapper class for the PEG.js API and a companion
Browserify transform for on-the-fly (OTF) compiling PEG.js grammars into
parsers.

Getting Started
---------------

```shell
npm install pegjs-otf --save-dev
```

```shell
browserify -t pegjs-otf/transform sample.js
```

See Also
--------

- [PEG.js](http://pegjs.org/)

License
-------

Copyright (c) 2014 Ralf S. Engelschall (http://engelschall.com/)

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

