tinymce.PluginManager.add('notwimageupload', function(editor, url) {

    function imageBox(editor) {

    editor.windowManager.open({
	title: 'Upload an image',
	file : url + '/dialog.html',
	width : 540,
	height: 440
	/*,
	buttons: [{
	    text: 'Upload',
	    classes:'widget btn primary first abs-layout-item',
	    //disabled : true,
	    onclick: 'notwImageDialog.convertImageToBinary'
	},
		  {
		      text: 'Close',
		      onclick: 'close'
		  }]
	*/
    }
//	editor.windowManager.open(
//	    {
//	    title: 'Image Upload',
//            body: [
//		{type: 'file', name: 'imageFile', label: 'Image File'}
//            ],
//            onsubmit: function(e) {
//		// Insert content when the window form is submitted
//		editor.insertContent('Image File: ' + e.data.imageFile);
//            }
//	}
	);

	//alert("Hello World");
    }

    function setPrimaryImageLogic() {
	//alert("Hello");
	if (tinymce.activeEditor.selection && tinymce.activeEditor.selection.getNode() && tinymce.activeEditor.selection.getNode().tagName.toLowerCase() == "img") {
	    //alert(tinymce.activeEditor.selection.getNode().tagName);
	    var selectedElement = editor.selection.getNode();
	    var imgTagName = "img";
	    if (tinymce.activeEditor.dom.getAttrib(selectedElement, "primaryimage") !="true") {
		var imgElements = tinymce.activeEditor.getDoc().getElementsByTagName(imgTagName); //unset any and all other primary image(s)
		var numElements = imgElements.length;
		for (var i = 0; i < numElements; i++) {
		    var element = imgElements[i];
		    if (tinymce.activeEditor.dom.getAttrib(element, "primaryimage") =="true") {
			tinymce.activeEditor.dom.setAttrib(element, "primaryimage", "false");
		    }
		}
		tinymce.activeEditor.dom.setAttrib(selectedElement, "primaryimage","true");
	    }
	    else {
		tinymce.activeEditor.dom.setAttrib(selectedElement, "primaryimage", "false");
	    }
	}

    }

    function setPrimaryImage(editor) {
	//alert("Hello");
	if (editor.selection && editor.selection.getNode() && tinymce.activeEditor.selection.getNode().tagName.toLowerCase() == "img") {
	    tinymce.activeEditor.execCommand('setPrimaryImage', false, null);
	    //alert(tinymce.activeEditor.selection.getNode().tagName);
	    //var selectedElement = editor.selection.getNode();
	    //if (tinymce.activeEditor.dom.getAttrib(selectedElement, "primaryimage") !="true") {
	    //	tinymce.activeEditor.dom.setAttrib(selectedElement, "primaryimage","true");
	    //}
	    //else {
	    //	tinymce.activeEditor.dom.setAttrib(selectedElement, "primaryimage", "false");
	    //}
	}

    }

    editor.addCommand('setPrimaryImage', setPrimaryImageLogic);
    // Add a button that opens a window
    editor.addButton('notwprimaryimage', {
	tooltip: 'Set the selected image as primary',
	icon : 'image',
	text: 'Set Primary Image',
	onclick: function() { setPrimaryImage(editor); 
			    },
	stateSelector: 'img[primaryimage=true]'
    });
    
    // Adds a menu item to the tools menu
    editor.addMenuItem('notwprimaryimage', {
	text: 'Set selected image as primary',
	icon : 'image',
	context: 'insert',
	onclick: function() { setPrimaryImage(editor); }
	});

    
    // Add a button that opens a window
    editor.addButton('notwimageupload', {
	tooltip: 'Upload an image',
	icon : 'image',
	text: 'Upload',
	onclick: function() { imageBox(editor); 
			    },
    });
    
    // Adds a menu item to the tools menu
    editor.addMenuItem('notwimageupload', {
	text: 'Upload image',
	icon : 'image',
	context: 'insert',
	onclick: function() { imageBox(editor); }
	});

//    function imageClick(event) {
//	
//	e = event || window.event;
//	var target = e.target || e.srcElement;
//	if (target.nodeType == 3) target = target.parentNode; // defeat Safari bug
//	if (target && target.tagName && target.tagName.toLowerCase() == "img") {
//	    alert("image clicked!");
//	    console.log("image clicked!");
//	}
//    }
 
//    editor.on("click", imageClick);

//    if (editor.addEventListener) {  // all browsers except IE before version 9
//	editor.on("click", imageClick);
//    } else {
//	if (editor.attachEvent) {   // IE before version 9
//	    editor.attachEvent("click", imageClick);
//	}
//    }
});
