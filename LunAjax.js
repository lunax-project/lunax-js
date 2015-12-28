(function(window, document, History, $){
var tFunc = typeof Function;

var isObject = function(obj)
{
	return typeof obj === "object" && obj !== null;
};

var changeCurrent = function(data, title, url)
{
	// Save new or current title
	title = title || document.title;
	document.title = title;

	if (url !== null) {
		History.pushState(data, title, url);
	}
};

var extend = function(obj, values)
{
	if (typeof obj !== typeof values) {
		throw new Error("Different types!");
	}

	var v;

	if (Array.isArray(obj)) {
		for (v in values) {
			obj.push(values[v]);
		}
	}

	else if (isObject(values)) {
		for (v in values) {
			obj[v] = values[v];
		}
	}

	return obj;
};

var LunAsync = function($element, options)
{
	var loading  = false,
		clicked  = false,
		$request = null,
		lastUrl  = null,
		action   = {
			animation : null,
			title     : true,
			url       : true
		};

	// Force to use an object element
	if (typeof $element === "string") {
		$element = $($element);
	}

	this.click(function(event)
	{
		var url = $(this).attr("href");

		// Clicou em outro link antes de carregar ou
		// clicou em algum link pela primeira vez
		if (url != lastUrl) {
			event.preventDefault();
			loading = true;
			clicked = false;
			lastUrl = url;
		} else {
			// Verifica se está clicando pela segunda vez
			if (!clicked) {
				clicked = true;
				return false;
			} else {
				// Se clicar 3x antes de carregar o
				// link recarrega a página
				return true;
			}
		}

		var configs = {
			url: action.url ? url : null,
			title: action.title ? ($(this).attr("title") || null) : null
		};

		var run = function()
		{
			if (typeof action.start === tFunc) {
				action.start();
			}

			if ($request !== null) {
				$request.abort();
			}

			$request = $.ajax({
				url: url,
				type: "GET",
				dataType: "html",

				success: function(data) {
					$element.html(data);
					if (typeof action.success === tFunc) {
						action.success(data);
					}
				},

				error: function(xhr, status, error) {
					if (typeof action.error === tFunc) {
						action.error(error);
					}
				},

				complete: function() {
					loading  = false;
					clicked  = false;
					$request = null;
					lastUrl  = null;

					if (action.animation !== null) {
						setTimeout(function() {
							$(action.animation).stop().fadeOut("slow");
						}, action.animationDelay || 1000);
					}

					if (typeof action.complete === tFunc) {
						action.complete();
					}
				}
			});
		};

		if (action.animation !== null) {
			$(action.animation).stop().fadeIn("fast", run);
		} else {
			run();
		}

		changeCurrent(null, configs.title, configs.url);
	});

	options = options || {};
	extend(action, options);
	return this;
};

$.fn.LunAsync = LunAsync;
})(window, document, History, jQuery);
