var notwImageDialog = {
    convertImageToBinary : function() {
	if ($("#imageUpload")[0].files.length <= 0) {
	    return;
	}
	var dialog = this;
	var w = this.getWin();
	tinymce = w.tinymce;
	var reader = new FileReader();
	reader.onload = function(e) {
	    var imageData = reader.result.replace(/^data:application\/octet-stream/, 'data:image/jpeg');
	    tinymce.EditorManager.activeEditor.insertContent('<img src="'  + imageData +'" />');
	    //tinymce.EditorManager.activeEditor.insertContent('<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/RybnoeDistrict_06-13_Konstantinovo_village_05.jpg/1280px-RybnoeDistrict_06-13_Konstantinovo_village_05.jpg" />');
	    dialog.close();
	    //tinyMCEPopup.editor.execCommand('mceInsertContent', false, '<img src="' + imageData +'" />');
	    //tinyMCEPopup.editor.close();
	}
	reader.readAsDataURL($("#imageUpload")[0].files[0]);

    },


    getWin : function() {
	return (!window.frameElement && window.dialogArguments) || opener || parent || top;
	},
    
    close : function() {
	//var t = this;

	// To avoid domain relaxing issue in Opera
	function close() {
	    tinymce.EditorManager.activeEditor.windowManager.close(window);
	    tinymce = tinyMCE = this.editor = this.params = this.dom = this.dom.doc = null; // Cleanup
	    };

	if (tinymce.isOpera)
	    this.getWin().setTimeout(close, 0);
	else
	    close();
	}

}
