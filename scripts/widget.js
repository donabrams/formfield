define(["jquery.min"],function () {
	// makeClass - By John Resig (MIT Licensed)
	function makeClass(){
		return function(args){
		  if ( this instanceof arguments.callee ) {
		    if ( typeof this.init == "function" )
		      this.init.apply( this, args.callee ? args : arguments );
		  } else
		    return new arguments.callee( arguments );
		};
	}

	//
	// This is a widget that can render itself wherever. 
	// It should usually be created by WidgetFactory.
	//
	Widget = makeClass();
	Widget.prototype.init = function(args) {
		this.appendTo = function(domNode) {
			this.render(function(newNode) { $(domNode).append(newNode); });
		};
		this.replace = function(domNode) {
			this.render(function(newNode) { $(domNode).replaceWith(newNode); });
		};
		this.after = function(domNode) {
			this.render(function(newNode) { $(domNode).after(newNode); });
		};
		this.refresh = function() {
			var oldNode = this.node;
			this.render(function(newNode) { $(oldNode).replaceWith(newNode); });
		};
	};

	//
	// When initializing, define the following methods in templater:
	//  - compileTemplate(uncompileTemplate)
	//  - createDomNodeFromTemplate(compiledTemplate);
	//
	WidgetFactory = makeClass();
	WidgetFactory.prototype.init = function(templater) {
		this.produce = function(widgetTemplate) {
			var widget = Widget();
			var factory = this;
			widget.render = function(insertIntoDom, args) {		
				args = args || {};
				var widget = this;
				var template = args.template || widget.template;
				var decorators = args.decorators || widget.decorators;
				var css = args.css || widget.css;
				var newNode = factory.createDomNodeFromTemplate(template, widget);
				widget.node = newNode;
				var displayAndDecorate = function() {
					insertIntoDom(newNode);
					if (decorators && decorators.length) {
						factory.decorate(decorators, newNode, widget);
					}
				};
				if (css) {
					require(["cssx/cssx!" + css],displayAndDecorate);
				} else {
					displayAndDecorate();
				}
			};
			factory.configureWidget.apply(this, [widget].concat($.makeArray(arguments)));
			return widget;
		};
		this.configureWidget = function(widget) {
			if (arguments.length > 1) {
				$.extend.apply(this, [true, widget].concat($.makeArray(arguments).slice(1)));
			}
			if (widget.template)
				widget.template = this.compileTemplate(widget.template);
			if (widget.templates) {
				var templates = widget.templates;
				var dest = widget;
				if ($.isArray(templates)) {
					widget.templates = [];
					dest = widget.templates;
				}
				$.each(templates, function(keyOrIndex, toCompile) {
					dest[keyOrIndex] = this.compileTemplate(toCompile);
				});
			}
		};
		this.decorate = function(decorators, newNode, widget) {
			for (var i = 0; i < decorators.length;i++) {
				var decorator = decorators[i];
				decorator(newNode, widget); 
			}
		};
		$.extend(true, this, templater);
	}
});
