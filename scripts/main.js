requireOnlyIfRequireExists = function(deps, func) { if (require) {require(deps, func);} else { func(); }};
requireOnlyIfRequireExists(["jquery.min", "lookup", "formfield/formfield"], function () {
	$(function() {
		var UDelLookups = UDelLookups || {};
		UDelLookups.lookupDecorator = function(node, field) {
			if (field.lookup) {
				$("#" + field.fieldName + "-Lookup", node).click( function(){
					return $.udelLookup(field.lookup);
				});
			}
		};
		FormField.defaultDecorators = function() {
			return [UDelLookups.lookupDecorator];
		};
		$("#testError1").formField({});
		$("#testError2").formField({fieldName:"testError2"});

		$("#test1").formField({fieldName:"test1", hidden:true});
		$("#test2").formField({fieldName:"test2", hidden:true, value:"a"});

		$("#test3").formField({fieldName:"test3", readonly:true});
		$("#test4").formField({fieldName:"test4", readonly:true, label:"Test 4"});
		$("#test5").formField({fieldName:"test5", readonly:true, value:"b"});
		$("#test6").formField({fieldName:"test6", readonly:true, translate:"answer"});
		$("#test7").formField({fieldName:"test7", readonly:true, label:"Test 7", translate:"answer", value:"b"});

		$("#test8").formField({fieldName:"test8", type:"text"});
		$("#test9").formField({fieldName:"test9", type:"text", value:"c"});
		$("#test10").formField({fieldName:"test10", type:"text", label:"Test 10"});
		$("#test11").formField({fieldName:"test11", type:"text", messages:"howdy partner"});
		$("#test12").formField({fieldName:"test12", type:"text", errors:"reach for the sky!"});
		$("#test13").formField({fieldName:"test13", type:"text", translate:"western"});
		$("#test14").formField({fieldName:"test14", type:"text", required:true});
		$("#test15").formField({fieldName:"test15", type:"text", lookup:{group:"people", populate:"emplid:test15"}});
		$("#test16").formField({fieldName:"test16", type:"text", value:"c", label:"Test 16", messages:"howdy partner", 
				errors:"reach for the sky!", translate:"western", required:true, 
				lookup:{group:"people", populate:"emplid:test16;name:test16-Translate"}});
		$("#test16").formField({fieldName:"test16-2", type:"text", value:"c", label:"Test 16-2", messages:"howdy partner", 
				errors:"reach for the sky!", translate:"western", required:true, 
				lookup:{group:"people", populate:"emplid:test16-2;name:test16-2-Translate"}});

		$("#test17").formField({fieldName:"test17", type:"text", value:"awesome", label:"Test 17", messages:"howdy partner", 
				errors:"reach for the sky!", translate:"western", required:true, 
				lookup:{group:"people", populate:"emplid:test17;name:test17-Translate"}});
		$("#test18").formField(
				[	{fieldName:"test18", type:"text", value:"awesome", label:"Test 18", messages:"howdy partner", 
							errors:"reach for the sky!", translate:"western", required:true, 
							lookup:{group:"people", populate:"emplid:test18;name:test18-Translate"}},
					{fieldName:"test19", type:"text", value:"awesome", label:"Test 19", messages:"howdy partner", 
							errors:"reach for the sky!", translate:"western", required:true, 
							lookup:{group:"people", populate:"emplid:test19;name:test19-Translate"}}]);
		$("#test20").formField([{fieldName:"test20", type:"text", value:"awesome", label:"Test 20", messages:"howdy partner", 
				errors:"reach for the sky!", translate:"western", required:true, 
				lookup:{group:"people", populate:"emplid:test20;name:test20-Translate"}}]);
		$("#test21").formField([{fieldName:"test21", type:"text", value:"awesome", label:"Test 21", messages:"howdy partner", 
				errors:"reach for the sky!", translate:"western", required:true, decorators:[], 
				lookup:{group:"people", populate:"emplid:test21;name:test21-Translate"}}]);
	});
});
