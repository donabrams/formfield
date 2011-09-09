require(["text!formfield/formfield.readonly.template.html", 
		"widget",
		"jquery.min",
		"jquery.jqote2.min"], function (template) {
	var jqoteWidgetFactory = WidgetFactory({
		compileTemplate: function(template) {
			return $.jqotec(template);
		},
		createDomNodeFromTemplate: function(template, data) {
			return $($.jqote(template, data));
		}
	});
	var UDelLookups = UDelLookups || {};
	UDelLookups.lookupDecorator = function(node, field) {
		if (field.lookup) {
			$("#" + field.fieldName + "-Lookup", node).click( function(){
				return $.udelLookup(field.lookup);
			});
		}
	};
	var widgetTemplate = {
			template: template, 
			css: "formfield/formfield.css", 
			decorators: [UDelLookups.lookupDecorator]};
	var widget = jqoteWidgetFactory.produce(widgetTemplate, {fieldName: "Tester", value:"You are"});
	widget.appendTo($("#test1")[0]);

	setInterval(function() {
		widget.value = new Date().toString();
		widget.refresh();
	}, 1000);
});
