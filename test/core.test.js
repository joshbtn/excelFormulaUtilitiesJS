//REMOVE ME
module("core");

test("Test extend with simple objects", function() {
  var target = {foo: "foo"};
  var object = {bar: "bar"};
  var merged = window.excelFormulaUtilities.core.extend(target, object);
  equals(typeof merged.foo, "string", "foo exsits");
  equals(typeof merged.bar, "string", "bar exsits");
});

test("Test extend with a simple object extending a function", function() {
  var target = function(){return true;}
  target.foo = "foo";
  var object = {bar: "bar"};
  var merged = window.excelFormulaUtilities.core.extend(target, object);
  
  ok(merged(), "merged() is working");
  equals(typeof merged.foo, "string", "foo exsits");
  equals(typeof merged.bar, "string", "bar exsits");
});

module("string");

test("formatStr()", function() {
	var target = "{0}";
	var target2 = "{0} {1}";
	var append = "hi";
	var append2 = "there";
	var expected1 = "hi";
	var expected2 = "hi there";
	
	equals(window.excelFormulaUtilities.string.formatStr(target, append), expected1, "test one")
	equals(window.excelFormulaUtilities.string.formatStr(target2, append, append2), expected2, "test two")
	
});