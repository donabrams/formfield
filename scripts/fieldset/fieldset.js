require(["text!fieldset/fieldset.template.html", 
		"text!fieldset/fieldSeparatingLabel.template.html", 
		"jquery.min", 
		"jquery.jqote2.min", 
		"formfield/formfield",
		"formbutton/formbutton",
		"cssx/cssx!fieldset/fieldset.css"], 
	function (fieldsetTemplate, fieldSeparatingLabelTemplate) {
		FieldSet = {
			fieldsetTemplate: $.jqotec(fieldsetTemplate),
			fieldSeparatingLabelTemplate: $.jqotec(fieldSeparatingLabelTemplate),
			create: function(args, target) {
				return $.doEvenIfArray(
						function(args, target) {
							var fieldset = target || args.target || {};
							fieldset.render = function() {
								var node = FieldSet.render(fieldset);
								node = $(node);
								//convert node to DOM element
								if (fieldset.fields) {
									var fieldsNode = $(".fields", node);
									for (var i =0;i<fieldset.fields.length;i++) {
										var field = fieldset.fields[i];
										if (field.type && field.type == 'separatingLabel') {
											fieldsNode.append(
													FieldSet.renderTemplate(FieldSet.fieldSeparatingLabelTemplate, field));
										}
										else {
											fieldsNode.formField(field);
										}
									}
								}
								if (fieldset.buttons) {
									$(".buttons", node).formButton(fieldset.buttons, node);
								}
								return node;
							};
							fieldset.decorate = function(node) {
								if (this.decorators) {
									var that = this;
									$.each(this.decorators, function(i, decorator) {
										decorator(node, that);
									});
								}
							};
							$.extend(true, fieldset, args);
							//The decorators are handled separately since an empty array and null/false 
							// will be overwritten if set before the extend.
							if (typeof fieldset.decorators == "undefined") {
								fieldset.decorators = FieldSet.defaultDecorators();
							}
							return fieldset;
						}, 
						args, target);
			},
			defaultDecorators: function() {
					return [];
			},
			render: function(fieldset) {
				var node = FieldSet.renderTemplate(FieldSet.fieldsetTemplate, fieldset);
				return node;
			},
			renderTemplate: function(template, fieldset) {
				return $.jqote(template, fieldset);
			}
		};
		$.fieldSet = function(args) {
			return FieldSet.create(args);	
		};
		$.fn.fieldSet = function(args) {
			var fieldSet = FieldSet.create(args);
			this.each(function(a) {
				$.doEvenIfArray(
						function(fieldSet,toAppendTo) {
							var node = $(toAppendTo).append(fieldSet.render());
							fieldSet.decorate(node);
						}, 
						fieldSet,
						this);
			});
			return this;
		};
});
