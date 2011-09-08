requireOnlyIfRequireExists = function(deps, func) { if (require) {require(deps, func);} else { func(); }};
requireOnlyIfRequireExists(["jquery.min"], function () {
	$.udelPopup = function(url, popupOptions) {
		var win = window.open(url, 'lookup', popupOptions ? popupOptions : $.udelPopup.defaultPopupOptions);
		if(window.focus) {
			win.focus();
		};
		return false;
	};
	$.udelPopup.defaultPopupOptions = 'width=650,height=350,scrollbars=yes,location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=yes';
	$.udelLookupUrl = function(args) {
		var params = {};
		$.each(["title", "group","populate","skipEntry","search","sortOn","constraints",
			      		"rowsPerPage","rowDisplay","directions"],
			  function(i,val) {
					if (args[val]) {
						params[val.toLowerCase()] = args[val];
					}
				});
		var urlArgs = $.param(params);
		url = args.lookupUrl ? args.lookupUrl : ($.fn.udelLookup.lookupUrl ? $.fn.udelLookup.lookupUrl : "");
		url = url.concat("?", urlArgs);
		return url;
	};
	$.udelLookup = function(args) {
		return $.udelPopup($.udelLookupUrl(args));
	};
	$.fn.udelLookup = function() {
		$(this).each(function() {
			var $this = $(this);
			var params = {};
			if ($this.attr("title")) {
				params["title"] = $this.attr("title");
			}
			$.each(["Group","Populate","SkipEntry","Search","SortOn","Constraints",
				      		"RowsPerPage","RowDisplay","Directions"],
				      function(i,val) {
						if ($this.attr("data-lookup" + val)) {
							params[val.toLowerCase()] = $this.attr("data-lookup" + val);
						}
			});
			var urlArgs = $.param(params);
			var url = $this.attr("lookupUrl");
			if (!url) {
				url = this.lookupUrl ? this.lookupUrl : $.fn.udelLookup.lookupUrl;
			}
			url = url.concat("?", urlArgs);
			return $this.click(function() {
				return $.udelPopup(url);
			});
		});
	};
});
