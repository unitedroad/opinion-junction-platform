var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

tinymce.PluginManager.add('caption', function(ed, url) {
    ed.addButton('caption', {
        text: 'Caption',
        icon: false,
        onclick: function() {
	    if (ed.selection.getNode().tagName!=null && ed.selection.getNode().tagName.toLowerCase() == "img") {
		ed.windowManager.open({
                    title: 'Add caption',
                    body: [
			{type: 'textbox', name: 'caption', label: 'Caption'}
                    ],
                    onsubmit: function(e) {
			var element = ed.selection.getNode();
			var parent = element.parentElement;

			if(parent.className === 'image-container' || parent.getAttribute('data-label') === 'image-container') {
			    var captionContainerJQ = $(parent).find("[data-caption-label]");
			    var captionContainer = null;
			    if (captionContainerJQ.length > 0) {
				captionContainer = captionContainerJQ[0];
			    } else {
				captionContainerJQ = $("<div>", {"class" : "caption-container"});
				captionContainer = captionContainerJQ[0];
				var attributionContainerJQ = $(parent).find("[data-attribution-label]");
				if (attributionContainerJQ.length >0) {
				    attributionContainerJQ.before(captionContainerJQ);
				} else {
				    $(parent).append(captionContainerJQ);
				}
			    }
			    captionContainer.setAttribute('data-caption-label', e.data.caption);
			    captionContainer.innerHTML = e.data.caption;
                            //parent.setAttribute('data-label', e.data.caption);
			    //parent.innerHTML = e.data.caption;
                            return;
			}
			var dom = ed.dom;
			var imageContainer = dom.create('div', {'class': 'image-container', 
								'data-label': 'image-container'
								// , 
								// 'style': element.getAttribute('style')
							       });
			var captionContainer = dom.create('div', {'class': 'caption-container', 
								  'data-caption-label': e.data.caption
								 },
							  e.data.caption);
			imageContainer.appendChild(captionContainer);
			//element.setAttribute('style', '');
			dom.insertAfter(imageContainer, element);
			$(imageContainer).prepend($(element));
                    }
		});
	    }
        }
    });
    ed.addButton('attribution', {
        text: 'Attribute Image',
        icon: false,
        onclick: function() {
	    if (ed.selection.getNode().tagName!=null && ed.selection.getNode().tagName.toLowerCase() == "img") {
		ed.windowManager.open({
                    title: 'Attribute Image',
                    body: [
			{type: 'textbox', name: 'url', label: 'URL'},
			{type: 'textbox', name: 'description', label: 'Description'}
                    ],
                    onsubmit: function(e) {
			var element = ed.selection.getNode();
			var parent = element.parentElement;

			var url = e.data.url;
			var description = e.data.description;
			if (url) {
			    if (!description) {
				description = getLocation(url).hostname;
			    }

			    var attributionString = "Source: <a href='" + url + "'>" + description + "</a>";
			    if(parent.className === 'image-container' || parent.getAttribute('data-label') === 'image-container') {
				var attributionContainerJQ = $(parent).find("[data-attribution-label]");
				var attributionContainer = null;
				if (attributionContainerJQ.length > 0) {
				    attributionContainer = attributionContainerJQ[0];
				} else {
				    attributionContainerJQ = $("<div>", {"class" : "attribution-container"});
				    attributionContainer = attributionContainerJQ[0];
				    $(parent).append(attributionContainerJQ);
				}
				attributionContainer.setAttribute('data-attribution-label', attributionString);
				attributionContainer.innerHTML = attributionString;
				//parent.setAttribute('data-label', e.data.caption);
				//parent.innerHTML = e.data.caption;
				return;
			    }
			    var dom = ed.dom;
			    var imageContainer = dom.create('div', {'class': 'image-container', 
								    'data-label': 'image-container'});
			    var attributionContainer = dom.create('div', {'class': 'attribution-container', 
									  'data-attribution-label': attributionString
									 },
								  attributionString);
			    imageContainer.appendChild(attributionContainer);
			    dom.insertAfter(imageContainer, element);
			    $(imageContainer).prepend($(element));

			}
			

                    }
		});
	    }
        }
    });

});
