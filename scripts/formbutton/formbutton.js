require(["text!formbutton/formbutton.template.html", 
		"jquery.min", 
		"jquery.jqote2.min", 
		"cssx/cssx!formbutton/formbutton.css"], 
	function (buttonTemplate) {
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
		FormButton = {
			template: $.jqotec(buttonTemplate),
			create: function(args, target) {
				return $.doEvenIfArray(function(args, target) {
						var button = target || args.target || {};
						button.render = function() {
							return FormButton.render(button);
						};
						button.decorate = function(node, actionScope) {
							if (this.decorators) {
								var that = this;
								$.each(this.decorators, function(i, decorator) {
									decorator(node, that, actionScope);
								});
							}
						};
						$.extend(true, button, args);
						//The decorators are handled separately since an empty array and null/false 
						// will be overwritten if set before the extend.
						if (typeof button.decorators == "undefined") {
							button.decorators = FormButton.defaultDecorators();
						}
						return button;
					}, 
					args, target);
			},
			defaultDecorators: function() {
					return [];
			},
			render: function(button) {
				return FormButton.renderTemplate(FormButton.template, button);
			},
			renderTemplate: function(template, button) {
				return $.jqote(template, button);
			}
		};
		$.formButton = function(args) {
			return FormButton.create(args);	
		}
		$.fn.formButton = function(args, actionScope) {
			var button = FormButton.create(args);
			this.each(function(a) {
				$.doEvenIfArray(
						function(button,toAppendTo, actionScope) {
							var node = $(button.render());
							$(toAppendTo).append(node);
							button.decorate(node, actionScope);
						}, 
						button,
						this,
						actionScope);
			});
			return this;
		};
});
