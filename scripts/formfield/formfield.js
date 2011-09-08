require(["text!formfield/formfield.hidden.template.html", 
		"text!formfield/formfield.readonly.template.html", 
		"text!formfield/formfield.editable.template.html",
		"jquery.min", 
		"jquery.jqote2.min", 
		"cssx/cssx!formfield/formfield.css"], 
	function (hiddenTemplate, readonlyTemplate, editableTemplate) {
		//add a function to do a function on a single object or an array of the objects and return the results similarly
		$.doEvenIfArray = function(func, obj) {
				if ($.isArray(obj)) {
					var toRet = [];
					for (var i = 0; i < obj.length;i++) {
						toRet.push(func.apply(this, [ obj[i] ].concat(
							Array.prototype.slice.call(arguments, 2))));
					}
					return toRet;
				}
				else {
					return func.apply(this,Array.prototype.slice.call(arguments, 1));
				}
		};
		FormField = {
			hiddenTemplate: $.jqotec(hiddenTemplate),
			readonlyTemplate: $.jqotec(readonlyTemplate),
			editableTemplate: $.jqotec(editableTemplate),
			create: function(args, target) {
				return $.doEvenIfArray(function(args, target) {
						var field = target || args.target || {};
						field.render = function() {
							return FormField.render(field);
						};
						field.decorate = function(node) {
							if (this.decorators) {
								var that = this;
								$.each(this.decorators, function(i, decorator) {
									decorator(node, that);
								});
							}
						};
						$.extend(true, field, args);
						//The decorators are handled separately since an empty array and null/false 
						// will be overwritten if set before the extend.
						if (typeof field.decorators == "undefined") {
							field.decorators = FormField.defaultDecorators();
						}
						return field;
					}, 
					args, target);
			},
			defaultDecorators: function() {
					return [];
			},
			render: function(field) {
				if (!field.fieldName) {
					return "ERROR: no fieldName specified";
				}
				else if (field.hidden) {
					return FormField.renderTemplate(FormField.hiddenTemplate, field);
				}
				else if (field.readonly) {
					return FormField.renderTemplate(FormField.readonlyTemplate, field);
				}
				//editable by default
				else if (field.type) {
					return FormField.renderTemplate(FormField.editableTemplate, field);
				}
				else {
					return "ERROR: no type specified";
				}
			},
			renderTemplate: function(template, field) {
				return $.jqote(template, field);
			}
		};
		$.formField = function(args) {
			return FormField.create(args);	
		}
		$.fn.formField = function(args) {
			var formField = FormField.create(args);
			this.each(function(a) {
				$.doEvenIfArray(
						function(field,toAppendTo) {
							var node = $(toAppendTo).append(field.render());
							field.decorate(node);
						}, 
						formField,
						this);
			});
			return this;
		};
});
