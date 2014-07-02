function ready() {
    setAjaxHeaders();

    $("<div>", { "id" : "comments-container", "class" : "comments-container collapse", "discussion_id" : discussion_id } ).appendTo("body");
    
    checkForLoggedInUserAndSetUi();

    loadAndShowComments();

    
}

function setModalBehaviour() {

    $(".modal").
	on("shown.bs.modal",function()
	   {    
	       setOffSetHeight();
	       // add loader indicator
	   }
	  );
    
    
    $("#iframe").load(function() {
	checkForLogin_iframe();
    });


}

function loadAndShowComments() {
    $.getJSON( "/api/1.0/posts/1/comments?top=true", updateCommentsOnUi);
    

    $("#comments-container").collapse('show');

}

function checkForLoggedInUserAndSetUi() {
    $.ajax({
        type: "GET",
        url: "/api/1.0/authors/loggedin/self",
	success: createUiForLoggedInUser,
	error: createUiForLoggingIn,
        contentType: 'application/json',
        dataType: "json"
   }); 

}

function setAjaxHeaders() {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                var csrftoken = $.cookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}

function createUiForLoggedInUser(data) {
     if ($("#comments-container").length > 0 && $("#comment-reply-creation-container").length == 0) {
	 $("<div>", { "id" : "comment-reply-creation-container", "class" : "comment-reply-creation-container" } ).prependTo("#comments-container");
	 $("<div>", {"id" : "comment-reply-creation-box-form-group", "class" : "form-group" }).appendTo("#comment-reply-creation-container");
	 $("<textarea>", { "id" : "comment-reply-creation-box", "class" : "comment-reply-creation-container form-control" } ).appendTo("#comment-reply-creation-box-form-group").click(onTypeInReplyBox).keyup(onTypeInReplyBox);
       	 $("<div>", {"id" : "comment-reply-creation-button-form-group", "class" : "form-group" }).appendTo("#comment-reply-creation-container");
	 $("<button>", { "id" : "comment-reply-creation-button", "class" : "comment-reply-creation-button btn btn-primary", "text" : "Submit" } ).appendTo("#comment-reply-creation-button-form-group").click(postReply);
     }    
}

function createUiForLoggingIn(data) {
    $("<button>", { "id" : "login-button", "class" : "comment-reply-button btn btn-primary", "text" : "Login to Comment",
    "data-toggle" : "modal", "data-target" : "#login-div" } ).prependTo("#comments-container");
    createLoginModal();
    setModalBehaviour();
}

function createLoginModal() {
    $("<div>", { "class" : "modal fade", "id":"login-div", "tabindex":"-1", "role":"dialog", "aria-labelledby":"modal-label", "aria-hidden":"true" }).appendTo($('body'));
    $("<div>", { "class" : "modal-dialog", "id" : "modal-dialog" }).appendTo($("#login-div"));
    $("<div>", { "class" : "modal-content", "id" : "modal-content" }).appendTo($("#modal-dialog"));
    $("<div>", { "class" : "modal-header", "id" : "modal-header" }).appendTo($("#modal-content"));
    $("<button class='close' id='modal-close' data-dismiss='modal'>&times;</button>").appendTo($("#modal-header"));
    $("<h3>", { "id" : "modal-label", "text" : "Log In" }).appendTo($("#modal-header"));
    $("<div>", { "class" : "modal-body", "id" : "modal-body" }).appendTo($("#modal-content"));
    $("<iframe>", { "class" : "modal-oj-iframe", "id" : "iframe", "src" : "/accounts/login?next=" + facebook_popup_suffix, "style" : "zoom:0.60", "frameborder" : "0", "width" : "99.6%" }).appendTo($("#modal-body"));
						       
}

function onTypeInReplyBox(event) {
    if (!event) var event = window.event;
    var replyBox = event.target;
    $(replyBox).tooltip("destroy");
}

function updateRepliesForParent(parentId) {
    var latest_child = $("#comment-reply-container-" + parentId).prop("latest_child");
    if (latest_child) {
         $.getJSON( "/api/1.0/comments/" + parentId + "?children=true" + "&after=" + latest_child, updateCommentsOnUi);      
    } else {
         $.getJSON( "/api/1.0/comments/" + parentId + "?children=true", updateCommentsOnUi);      
   }
}

function updateRootReplies() {
    var latest_child = $("#comments-container").prop("latest_child");
    if (latest_child) {
         $.getJSON( "/api/1.0/posts/1/comments?top=true"  + "&after=" + latest_child, updateCommentsOnUi);      
    } else {
         $.getJSON( "/api/1.0/posts/1/comments?top=true", updateCommentsOnUi);      
   }
}


function updateCommentsOnUi(data) {
    if (data.length > 0) {
        var superContainer = "#comments-container";
        if (data[0].parent_id && (data[0].parent_id != null)) {
            superContainer = "#comment-reply-container-" + data[0].parent_id;
            superContainerParent = "#comments-encompass-container-" + data[0].parent_id;

        }

        $.each(data, function (i, comment) {
	    $("<div>", { "id" : "comments-encompass-container-" + comment.id, "class" : "comments-encompass-container panel-group" } ).appendTo(superContainer);
            $("<div>", { "id" : "comment-content-container-"+ comment.id, "class" : "comment-content-container" } ).appendTo("#comments-encompass-container-" + comment.id);
            $("<div>", { "id" : "comment-text-container-"+ comment.id, "class" : "comment-text-container" } ).appendTo("#comment-content-container-" + comment.id);
            $("<button>", { "id" : "comment-reply-button-"+ comment.id, "class" : "comment-reply-button btn btn-primary", "text" : "Reply" } ).appendTo("#comment-content-container-" + comment.id);
	    
            $("#comment-reply-button-" + comment.id).click(function(){
    	    if ($("#comment-reply-creation-container-" + comment.id).length==0) {
                $("<div>", { "id" : "comment-reply-creation-container-" + comment.id, "class" : "comment-reply-creation-container collapse" } ).appendTo("#comment-content-container-" + comment.id);
		$("<div>", {"id" : "comment-reply-creation-box-form-group-" + comment.id, "class" : "form-group" }).appendTo("#comment-reply-creation-container-" + comment.id);
    		$("<textarea>", { "id" : "comment-reply-creation-box-" + comment.id, "class" : "comment-reply-creation-container form-control" } ).appendTo("#comment-reply-creation-box-form-group-" + comment.id).click(onTypeInReplyBox).keyup(onTypeInReplyBox);
		$("<div>", {"id" : "comment-reply-creation-button-form-group-" + comment.id, "class" : "form-group" }).appendTo("#comment-reply-creation-container-" + comment.id);
    		$("<button>", { "id" : "comment-reply-creation-button-" + comment.id, "class" : "comment-reply-creation-button btn btn-primary", "text" : "Submit" } ).appendTo("#comment-reply-creation-button-form-group-" + comment.id).click(postReply);
            }
		toggleCollapse = function() {
		    $("#comment-reply-creation-container-" + comment.id).collapse("toggle");
		    $("#comment-reply-creation-container-" + comment.id).on('shown.bs.collapse', function () {
			$("#comment-reply-creation-box-" + comment.id).focus();
		    });
		};

		setTimeout('toggleCollapse()', 100);
            
        });

        $("<a>", {"id" : "comments-reply-toggle-link-" + comment.id, "class" : "comments-reply-toggle-link", "data-toggle" : "collapse", "href" : "#"  })
        .html("Toggle Replies")
        .appendTo("#comments-encompass-container-" + comment.id)
        .click(toggleOrGetRepliesForParent);

         
	    $("<div>", { "id" : "comment-reply-container-"+ comment.id, "class" : "comment-reply-container collapse" } )
        .appendTo("#comments-encompass-container-" + comment.id);

        $("#comment-text-container-" + comment.id).append(comment.text);
        });
        $(superContainer).prop("latest_child", data[data.length-1].id);
        $(superContainer).prop("got_children", true);
    }
}

function toggleOrGetRepliesForParent(event) {
    if (!event) var event = window.event;
	var link = event.target;
    var id = link.getAttribute("id").substring("comments-reply-toggle-link-".length);
    if ($("#comment-reply-container-" + id).prop("got_children") == true) {
	setTimeout(function() { $("#comment-reply-container-" + id).collapse('toggle'); }, 100);
    } else {
        var id = link.getAttribute("id").substring("comments-reply-toggle-link-".length);
        updateRepliesForParent(id);
        $("#comment-reply-container-" + id).prop("got_children", true);
	setTimeout(function() { $("#comment-reply-container-" + id).collapse('show'); }, 100);
        
    }
}

function performActiviesAfterReplyIsPosted(data) {
    var parentId = data.parent_id;
    if (parentId != null) {
      updateRepliesForParent(parentId);
    } else {
     updateRootReplies();
   }
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

function postReply(event) {
    if (!event) var event = window.event;
	var button = event.target;
    $(button).focus();
    var parentId = null;
    if (button.getAttribute("id") === "comment-reply-creation-button") {
      var replyCreationBox = $("#comment-reply-creation-box");
    } else {
      var parentId = button.getAttribute("id").substring("comment-reply-creation-button-".length);
      var replyCreationBox = $("#comment-reply-creation-box-" + parentId);
    }
    button.getAttribute("id")
    if (replyCreationBox.val().length == 0) {
        if (!replyCreationBox.is(":focus")) {
            replyCreationBox.focus();
        }

    replyCreationBox.tooltip( "destroy" );
    replyCreationBox.tooltip({ "title" : "Comment is Blank" });
    replyCreationBox.tooltip( "show" );


	    return;
	}
	var reply = new Object();
    reply.discussion_id = $("#comments-container").attr("discussion_id");
    reply.parent_id = parentId;
    reply.text = replyCreationBox.val();
    author = new Object();
    author.id = "1";
    author.name = "W. Axl Rose";
	reply.author = author;

     $.ajax({
        type: "POST",
        url: "/api/1.0/posts/1/comments",
        data: JSON.stringify(reply),
        success: performActiviesAfterReplyIsPosted,
        contentType: 'application/json',
        dataType: "json"
   }); 
   //updateRepliesForParent(parentId);
   $("#comment-reply-container-" + parentId).collapse('show');
}

function canAccessIframe(iframe) {
  var iframe_document = null;
  try {
    iframe_document = iframe.contentWindow.location.document;
  } catch (exception) {
    return false;
  }
  return (iframe_document!=null);
}
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
$(".modal").on("shown.bs.modal",function()
{    
  setOffSetHeight();
    // add loader indicator
 
});


$("#iframe").load(function() {
  checkForLogin_iframe();
});


// Functions called directly from events

function setOffSetHeight() {
  $("#iframe")[0].style.height = $("#iframe")[0].contentWindow.document.body.offsetHeight + 'px';
}

function checkForLogin_iframe() {
   iframe_content = $("#iframe").contents().find('body');
   $("#iframe").css({ height: iframe_content.outerHeight( true ) });
    if (endsWith(removeParametersFromUrl($("#iframe")[0].contentWindow.location.href), facebook_popup_suffix)) {
     $("#login-div").modal("hide");
     $("#login-button").hide();
     if ($("#comments-container").length > 0 && $("#comment-reply-creation-container").length == 0) {
	 $("<div>", { "id" : "comment-reply-creation-container", "class" : "comment-reply-creation-container" } ).prependTo("#comments-container");
	 $("<div>", {"id" : "comment-reply-creation-box-form-group", "class" : "form-group" }).appendTo("#comment-reply-creation-container");
	 $("<textarea>", { "id" : "comment-reply-creation-box", "class" : "comment-reply-creation-container form-control" } ).appendTo("#comment-reply-creation-box-form-group").click(onTypeInReplyBox).keyup(onTypeInReplyBox);
       	 $("<div>", {"id" : "comment-reply-creation-button-form-group", "class" : "form-group" }).appendTo("#comment-reply-creation-container");
	 $("<button>", { "id" : "comment-reply-creation-button", "class" : "comment-reply-creation-button btn btn-primary", "text" : "Submit" } ).appendTo("#comment-reply-creation-button-form-group").click(postReply);
     }
   }

}

function removeParametersFromUrl(url) {
    if (url.indexOf("?") > -1) {
	return url.split("?")[0];
    } else {
        return url;
    }
}
