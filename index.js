/*
**  pegjs-otf -- On-The-Fly Compilation for PEG.js
**  Copyright (c) 2014-2025 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module: false */
/* global require: false */

/*  built-in requirements  */
var fs      = require("fs");

/*  external requirements  */
var _       = require("lodash");
var peggy   = require("peggy");

/*  provide a minimum wrapper class around PEG.js API  */
module.exports = _.extend({
	/*  provide an additional method which is like "generate",
	    but gets a grammar filename instead of the grammar text  */
    generateFromFile: function (filename, options) {
        var source = fs.readFileSync(filename, { encoding: "utf8" });
        return peggy.generate(source, options);
    }
}, peggy);

