/*
**  pegjs-otf -- On-The-Fly Compilation for PEG.js
**  Copyright (c) 2014-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
var path    = require("path");

/*  external requirements  */
var pegjs   = require("pegjs");
var sm      = require("static-module");
var through = require("through");

/*  Browserify transform  */
module.exports = function (file /*, options */) {
    /*  act on JavaScript files only  */
    if (path.extname(file) !== ".js")
        return through();

    /*  act on all calls to method "generateFromFile" of module "pegjs-otf"  */
    return sm({
        "pegjs-otf": {
            "generateFromFile": function (filename, options) {
                /*  read the grammar definition  */
                var source = fs.readFileSync(filename, { encoding: "utf8" });

                /*  enfore source code output  */
                options.output = "source";

                /*  generate the parser with regular PEG.js API  */
                var parser = pegjs.generate(source, options);

                /*  replace the "generateFromFile(...)" call with the generated parser  */
                return "(" + parser + ")";
            }
        }
    }, {
        vars: {
            /*  allow "__dirname" to be used in "generateFromFile(...)" calls  */
            __dirname: path.dirname(file)
        }
    });
};

