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
    		$("<textarea>", { "id" : "comment-reply-creation-box-" + comment.id, "class" : "comment-reply-creation-container" } ).appendTo("#comment-reply-creation-container-" + comment.id).click(onTypeInReplyBox).keyup(onTypeInReplyBox);
    		$("<button>", { "id" : "comment-reply-creation-button-" + comment.id, "class" : "comment-reply-creation-button btn btn-primary", "text" : "Submit" } ).appendTo("#comment-reply-creation-container-" + comment.id).click(postReply);
                }
                $("#comment-reply-creation-container-" + comment.id).collapse("toggle");
                $("#comment-reply-creation-container-" + comment.id).on('shown.bs.collapse', function () {
                    $("#comment-reply-creation-box-" + comment.id).focus();
                });
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
	    $("#comment-reply-container-" + id).collapse('toggle');
    } else {
        var id = link.getAttribute("id").substring("comments-reply-toggle-link-".length);
        updateRepliesForParent(id);
        $("#comment-reply-container-" + id).prop("got_children", true);
        $("#comment-reply-container-" + id).collapse('show');
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
   if (endsWith($("#iframe")[0].contentWindow.location.href, facebook_popup_suffix)) {
     $("#login-div").modal("hide");
     $("#login-button").hide();
     if ($("#comments-container").length > 0 && $("#comment-reply-creation-container").length == 0) {
       $("<div>", { "id" : "comment-reply-creation-container", "class" : "comment-reply-creation-container" } ).prependTo("#comments-container");
       $("<textarea>", { "id" : "comment-reply-creation-box", "class" : "comment-reply-creation-container" } ).appendTo("#comment-reply-creation-container").click(onTypeInReplyBox).keyup(onTypeInReplyBox);
       $("<button>", { "id" : "comment-reply-creation-button", "class" : "comment-reply-creation-button btn btn-primary", "text" : "Submit" } ).appendTo("#comment-reply-creation-container").click(postReply);
     }
   }

}