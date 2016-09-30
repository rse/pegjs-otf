
var peg = require("pegjs-otf");
var parser = peg.generateFromFile(__dirname + "/sample.pegjs", { optimize: "size" });
console.log(parser.parse("hello world") === "world" ? "OK" : "FAIL");

