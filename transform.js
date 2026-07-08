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
/* global Buffer: false */

/*  built-in requirements  */
var fs          = require("fs");
var path        = require("path");

/*  external requirements  */
var peggy       = require("peggy");
var acorn       = require("acorn");
var MagicString = require("magic-string");
var staticEval  = require("static-eval");
var through     = require("through");

/*  compile a single "generateFromFile(...)" call into parser source  */
var compile = function (filename, options) {
    /*  read the grammar definition  */
    var source = fs.readFileSync(filename, { encoding: "utf8" });

    /*  enfore source code output  */
    options = options || {};
    options.output = "source";

    /*  generate the parser with regular PEG.js API  */
    var parser = peggy.generate(source, options);

    /*  return the parser source, wrapped for use as an expression  */
    return "(" + parser + ")";
};

/*  recursively walk an AST, invoking a callback for every node  */
var walk = function (node, callback) {
    if (node === null || typeof node !== "object")
        return;
    if (typeof node.type === "string")
        callback(node);
    for (var key in node) {
        if (key === "type" || !Object.prototype.hasOwnProperty.call(node, key))
            continue;
        var child = node[key];
        if (Array.isArray(child)) {
            for (var i = 0; i < child.length; i++)
                walk(child[i], callback);
        }
        else if (child !== null && typeof child === "object" && typeof child.type === "string")
            walk(child, callback);
    }
};

/*  Browserify transform  */
module.exports = function (file /*, options */) {
    /*  act on JavaScript files only  */
    if (path.extname(file) !== ".js")
        return through();

    /*  buffer the entire file content, as we have to parse it as a whole  */
    var chunks = [];
    return through(function (chunk) {
        chunks.push(chunk);
    }, function () {
        var stream = this;
        var code   = Buffer.concat(chunks.map(function (chunk) {
            return Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        })).toString("utf8");

        try {
            /*  parse the JavaScript source into an AST  */
            var ast = acorn.parse(code, {
                ecmaVersion: "latest",
                allowReturnOutsideFunction: true,
                allowHashBang: true,
                sourceType: "module"
            });

            /*  determine the set of local bindings which reference "pegjs-otf",
                i.e., the "xx" in "var xx = require(\"pegjs-otf\")"  */
            var bindings = {};
            var requires = [];
            walk(ast, function (node) {
                if (   node.type === "VariableDeclarator"
                    && node.id.type === "Identifier"
                    && node.init
                    && node.init.type === "CallExpression"
                    && node.init.callee.type === "Identifier"
                    && node.init.callee.name === "require"
                    && node.init.arguments.length === 1
                    && node.init.arguments[0].type === "Literal"
                    && node.init.arguments[0].value === "pegjs-otf") {
                    bindings[node.id.name] = true;
                    requires.push(node.init);
                }
            });

            /*  bail out early if module "pegjs-otf" is not used at all  */
            if (Object.keys(bindings).length === 0) {
                stream.queue(code);
                stream.queue(null);
                return;
            }

            /*  provide the variables allowed inside the statically evaluated arguments  */
            var vars = {
                /*  allow "__dirname" to be used in "generateFromFile(...)" calls  */
                __dirname: path.dirname(file)
            };

            /*  surgically replace all "xx.generateFromFile(...)" calls  */
            var magic = new MagicString(code);
            walk(ast, function (node) {
                if (   node.type === "CallExpression"
                    && node.callee.type === "MemberExpression"
                    && node.callee.object.type === "Identifier"
                    && bindings[node.callee.object.name] === true
                    && node.callee.property.type === "Identifier"
                    && node.callee.property.name === "generateFromFile"
                    && !node.callee.computed) {
                    /*  statically evaluate the call arguments  */
                    var filename = staticEval(node.arguments[0], vars);
                    var options  = node.arguments.length > 1 ? staticEval(node.arguments[1], vars) : {};
                    if (filename === undefined)
                        throw new Error("pegjs-otf: cannot statically evaluate grammar filename argument");

                    /*  replace the "generateFromFile(...)" call with the generated parser  */
                    magic.overwrite(node.start, node.end, compile(filename, options));
                }
            });

            /*  neutralize the "require(\"pegjs-otf\")" calls, as the module is
                no longer needed at run-time once all calls are inlined  */
            for (var j = 0; j < requires.length; j++)
                magic.overwrite(requires[j].start, requires[j].end, "{}");

            stream.queue(magic.toString());
            stream.queue(null);
        }
        catch (err) {
            stream.emit("error", err);
        }
    });
};

