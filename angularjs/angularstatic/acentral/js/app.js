var testApp = angular.module('testApp', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ui.config', 'ui.tinymce', 'ui.directives', 'ui.include', 'ngSanitize', 'ngTouch']);

tooltipTriggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur',
    'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
};


testApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $interpolateProvider, $tooltipProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        
    $tooltipProvider.setTriggers(tooltipTriggerMap);

  $stateProvider
	.state('home', {
	    url: "/",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('politics', {
	    url: "/{category:politics}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('technology', {
	    url: "/{category:technology}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
    	.state('hoist', {
	    url: "/{category:hoist}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('art', {
	    url: "/{category:art}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('identities', {
	    url: "/{category:identities}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})

	.state('article', {
	    url : "/article/:articleId",
	    templateUrl: '/angularstatic/article/partials/article.html',
	    controller: 'articleController'
	})
    	.state('article.text', {
	    url : "/:text",
	    templateUrl: '/angularstatic/article/partials/article.html',
	    controller: 'articleController'
	})
	.state('signin', {
	    url : "/signin",
	    templateUrl: '/angularstatic/signin/partials/index.html',
	    controller: 'signinController'
	})
        .state('profile', {
	    url : "/profile",
	    templateUrl: '/angularstatic/publicprofile/partials/index.html',
	    controller: 'publicProfileController'
	})
        .state('profile.userid', {
	    url : "/:userid",
	    templateUrl: '/angularstatic/publicprofile/partials/index.html',
	    controller: 'publicProfileController'
	})
    	.state('user', {
	    url : "/user",
	    templateUrl: '/angularstatic/usersidebar/partials/index.html',
	    controller: 'userController'
	})
    	.state('user.settings', {
	    url : "/settings",
	    templateUrl: '/angularstatic/usersettings/partials/index.html',
	    controller: 'userSettingsController'
	})
    	.state('user.profile', {
	    url: "/profile",
	    templateUrl: '/angularstatic/profile/partials/index.html',
	    controller: 'userProfileController'
	})
	.state('user.createarticle', {
	    url: "/createarticle",
	    templateUrl: '/angularstatic/createarticle/partials/index.html',
	    controller: 'createArticleController'
	}).state('user.articles', {
	    url: "/articles",
	    templateUrl: '/angularstatic/articleslist/partials/index.html',
	    controller: 'viewArticlesController'
	}).state('user.editarticle', {
	    url: "/editarticle/:articleId",
	    templateUrl: '/angularstatic/createarticle/partials/index.html',
	    controller: 'createArticleController'
	}).state('default', {
	    url: "/default",
	    templateUrl: '/angularstatic/default/partials/index.html',
	    controller: 'createArticleController'
	}).state('message', {
	    url: "/message",
	    templateUrl: '/angularstatic/message/partials/index.html',
	    controller: 'messageViewController'
	});
    $locationProvider.html5Mode(true);




}).
    run([
	'$http', 
	'$cookies',
	'commonOJService',
	function($http, $cookies, commonOJService) {
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
	    commonOJService.getCategories();
	}]);


function initSidebarCapabilities(commonOJService, scope) {

	permissions = commonOJService.userData.user_permissions;
	var sidebarArticlePermissionkeys = commonOJService.getKeys(commonOJService.sidebarArticlePermissions);
	if (permissions!=null && commonOJService.isArray(permissions)) {
		var numPermissions = permissions.length;
		for (var i=0; i < numPermissions; i++) {
		    permission = permissions[i];
		    if (commonOJService.indexOf(sidebarArticlePermissionkeys, permission) > -1){
			scope.sidebarArticleCapabilities.push(commonOJService.sidebarArticlePermissions[permission]);
		    }
		}
	}

}

testApp.factory('commonOJService', function($http, $location) {
    var serviceInstance = {};

    id = 0;

    serviceInstance.id = id++;

    serviceInstance.userData = null;


    serviceInstance.sidebarArticlePermissions = 
	{"create_articles" : {"id" : "create_articles", "title" : "Create Article", "content" : "Create Article", "url" : "/user/createarticle" }
	 ,"edit_articles" : {"id" : "edit_articles", "title" : "View Articles", "content" : "View Articles", "url" : "/user/articles"}};

    serviceInstance.isUserLoggedIn = function() {
	return serviceInstance.userData && (serviceInstance.userData.id || (serviceInstance.userData.code === "user_not_setup_for_oj"));
    }

    serviceInstance.getKeys = function(obj) {
	var keys = [];
	for(var key in obj){
	    keys.push(key);
	}
	return keys;

    }

    serviceInstance.validateEmail = function(email) { 
	var re 
	    = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
    } 

    serviceInstance.headerLinkActivator = null;

    serviceInstance.registerHeaderLinkActivator = function(activator) {
	serviceInstance.headerLinkActivator = activator;
    }

    serviceInstance.categoryLinkActivator = null;

    serviceInstance.registerCategoryLinkActivator = function(activator) {
	serviceInstance.categoryLinkActivator = activator;
    }


    serviceInstance.registerCategoryLinkDeactivator = function(deactivator) {
	serviceInstance.categoryLinkDeactivator = deactivator;
    }


    serviceInstance.activateHeaderNavLink = function(linkName) {
	serviceInstance.headerLinkActivator(linkName);
    }

    serviceInstance.focusCategoryLink = function(index) {
	serviceInstance.categoryLinkActivator(index);
    }

    serviceInstance.blurCategoryLink = function() {
	serviceInstance.categoryLinkDeactivator();
    }

    serviceInstance.isArray = function(obj) {

	if( Object.prototype.toString.call( obj ) === '[object Array]' ) {
	    return true;
	}
	return false;
    }

  
    if(typeof Array.prototype.indexOf === 'function') {
	
        serviceInstance.indexOf = function (array, needle) {
	    return array.indexOf(needle);
	}
    } else {
        serviceInstance.indexOf = function(array, needle) {
    	var i = -1, index = -1;
    
    	for(i = 0; i < array.length; i++) {
                if(array[i] === needle) {
    		index = i;
    		break;
                }
    	}
    
    	return index;
        };
	
    }

    serviceInstance.callablesMapForEveryChange = {};


    serviceInstance.listenersMap = {};

    copyFields = function(object1, object2) {
	for (var k in object1) object2[k]=object1[k];
    }

    invokeCallablesInMap = function(callablesMap) {
	for (var k in callablesMap) {
	    callable = callablesMap[k];
	    if (callable != null) {
		callable();
	    }
	} 
    }

    removeCallablesFromEveryChangeMap = function(key, valueArray) {
	callablesMap = serviceInstance.callablesMapForEveryChange["userData"];
	if (callablesMap!=null) {
	    var arrayLength = valueArray.length;
	    for (i = 0; i < arrayLength; i++) {
		value = valueArray[i];
		if (value) {
		    callablesMap[value] = null;
		}
	    }
	}
    }


    invokeListeners = function(key) {
	listenersArraysMap = serviceInstance.listenersMap[key];
	
	if (listenersArraysMap != null) {
	    for (var lowerKey in listenersArraysMap) {
		var listeners = listenersArraysMap[lowerKey];
		if (listeners != null) {
		    numListeners = listeners.length;
		    //console.log("numListeners: " + numListeners);
		    for (i = 0; i < numListeners; i++) { listeners[i](data) };
		}
		
	    }

	} else {
	    console.log("listeners: " + listeners);
	}
	
    }


    serviceInstance.registerListeners = function(key, controllerId, listeners, runNow) {
	data = serviceInstance[key];
	if ((data && runNow === "yesWithData") || runNow === "yes" ) {
	    numListeners = listeners.length;
	    for (i = 0; i < numListeners; i++) { listeners[i](data) };
	}
	var listenersArraysMap  = serviceInstance.listenersMap[key];
	if (listenersArraysMap == null) {
	    serviceInstance.listenersMap[key] = {};
	    listenersArraysMap = serviceInstance.listenersMap[key];
	    
	}
	listenersArraysMap[controllerId] = listeners;
    }



    pushAndInvokeCallables = function(callablesMapForController) {
	callablesMap = serviceInstance.callablesMapForEveryChange["userData"];
	if (callablesMapForController!=null) {
	    if (callablesMap==null) {
		callablesMap = {};
		serviceInstance.callablesMapForEveryChange["userData"] = callablesMap;
	    }

	    copyFields(callablesMap, callablesMapForController);
	}
	
	invokeCallablesInMap(callablesMap);
    }


    //serviceInstance.controllerInit
    serviceInstance.controllerInit = function(arrayCallables, scope, arrayCallablesFailure, callablesMapForController) {

	$http.get('/api/1.0/authors/loggedin/self/').success(function(data) {
	    //alert(JSON.stringify(data));
	    serviceInstance.userData = data;
	    if (data.id && data.id!=null){
		if (arrayCallables != null ) {
		    for (var i = 0; i < arrayCallables.length; i++) {
			arrayCallables[i](serviceInstance, scope);
		    }
		}
		//scope.$apply();

	    }

	    //listeners = listenersMap["userData"];
	    invokeListeners("userData");
	}).error (function(data) {
	    serviceInstance.userData = data;
	    if (arrayCallablesFailure && arrayCallablesFailure != null) {
		for (var i = 0; i < arrayCallablesFailure.length; i++) {
		    arrayCallablesFailure[i](serviceInstance, scope);
		}
	    }
	    
	});

	pushAndInvokeCallables(callablesMapForController);
	
	invokeListeners("userData");
//	$http.get('/api/1.0/authors/loggedin/self/').then(function(response) {
//	    if (response.data.ok && response.data.ok === "false") {
//
//	    } else if (response.data.id && response.data.id!=null){
//		serviceInstance.userData = response.data;
//	    }
//	});

    }


    
    serviceInstance.controllerInitOrRedirect = function(arrayCallables, scope, arrayCallablesFailure, callablesMapForController) {

	$http.get('/api/1.0/authors/loggedin/self/').success(function(data) {
	    serviceInstance.userData = data;
	    invokeListeners("userData");
	    //alert(JSON.stringify(data));
	    if (data.id && data.id!=null){
		if (arrayCallables != null) {
		    for (var i = 0; i < arrayCallables.length; i++) {
			arrayCallables[i](serviceInstance, scope);
		    }
		}

	    }  else {
		window.location.href="/accounts/login?next=" + $location.path();
	    }
	}).error(function(data) {
	    serviceInstance.userData = data;
	    invokeListeners("userData");
	    if (data.ok && data.ok === "false") {
		
		if (data.code && data.code == "user_not_setup_for_oj") {
		    //serviceInstance.userData = data;
		    if (data.message) {
			serviceInstance.messageForControllers.messageViewErrorMessage = data.message;
		    } else {
			serviceInstance.messageForControllers.messageViewErrorMessage = "Your account is not set up for Opinion Junction";
		    }
		    $location.path("/message");

		    return;
		}
		window.location.href="/accounts/login?next=" + $location.path();		
	    } 
	});

	pushAndInvokeCallables(callablesMapForController);
    }

    serviceInstance.unique = function(dataArray) {
	var a = dataArray.concat();
	for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
		if(a[i] === a[j])
                    a.splice(j--, 1);
            }
	}

	return a;
    };

    serviceInstance.categories = null;

    serviceInstance.messageForViewArticlesController = "";

    serviceInstance.messageForControllers = {};

    serviceInstance.getPath = function(fullUrl) {
	var baseLen = $location.absUrl().length - $location.url().length;
	return fullUrl.substring(baseLen);
    }

    serviceInstance.getAllObjectValues = function(object) {
	listOfValues = [];
	for (key in object) {
	    listOfValues.push(object[key]);
	}
	
    }

    serviceInstance.getObjectValue = function(object, key) {
	
	return object[key];
	
	
    }

    serviceInstance.categoryListeners = [];
    serviceInstance.registerCategoryListener = function(listener) {
	if (serviceInstance.categories != null) {
	    listener();
	}
	serviceInstance.categoryListeners.push(listener);
    }

    serviceInstance.getCategories = function(){
	if (serviceInstance.categories == null) {
	    $http.get('/api/1.0/categories/').success(function(response) {
		if (response.data && response.data.ok && response.data.ok === "false") {
		    
		} else {
		    serviceInstance.categories = response;

		    var numListeners = serviceInstance.categoryListeners.length;

		    for (i = 0; i < numListeners; i++) {
			listener = serviceInstance.categoryListeners[i];
			listener();
		    }
		}
	    });	    
	}



    }

    return serviceInstance;

    invalidateUserData = function () {

    };


});


testApp.factory('dateService', function($http, $location) {

    var serviceInstance = {};

    serviceInstance.date = new Date();

    serviceInstance.useNewDate = function() {
	serviceInstance.date = new Date();
    }

    serviceInstance.getFinalFriendlyDateString = function(num, suffix) {
	if (num <= 1) {
	    return num + " " + suffix + " ago";
	}
	return num + " " + suffix + "s ago";
    }

    serviceInstance.getFriendlyDateString = function(date) {
	var diffYears = yearDiff(date, serviceInstance.date);
	if (diffYears > 0) {
	    return serviceInstance.getFinalFriendlyDateString(diffYears, "year");
	}
	var diffMonths = monthDiff(date, serviceInstance.date);

	if (diffMonths > 0) {
	    return serviceInstance.getFinalFriendlyDateString(diffMonths, "month");
	}

	diffDays = dayDiff(date, serviceInstance.date);

	if (diffDays > 0) {
	    return serviceInstance.getFinalFriendlyDateString(diffDays, "day");
	}

	diffHours = hourDiff(date, serviceInstance.date);

	if (diffHours > 0) {
	    return serviceInstance.getFinalFriendlyDateString(diffHours, "hour");
	}

	diffMinutes = minuteDiff(date, serviceInstance.date);

	if (diffMinutes > 0) {
	    return serviceInstance.getFinalFriendlyDateString(diffMinutes, "minute");
	}

	diffSeconds = secondDiff(date, serviceInstance.date);

//	if (diffSeconds > 0) {
	    return serviceInstance.getFinalFriendlyDateString(diffSeconds, "second");
//	}

	var timeDiff = Math.abs(serviceInstance.date.getTime() - date.getTime());
	var diffMonths = Math.ceil(timeDiff / (30*1000 * 3600 * 24)); 
    }

    var yearDiff = function(d1, d2) {
	var years;
	years = (d2.getFullYear() - d1.getFullYear()) * 12;
	return years <= 0 ? 0 : years;
    }

    var monthDiff = function(d1, d2) {
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth() + 1;
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
    }

    var dayDiff = function(date1, date2) {
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
	return diffDays <=0? 0: diffDays;
    }

    var hourDiff = function(date1, date2) {
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffHours = Math.floor(timeDiff / (1000 * 3600)); 
	return diffHours <=0? 0: diffHours;
    }

    var minuteDiff = function(date1, date2) {
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffMinutes = Math.floor(timeDiff / (1000 * 60)); 
	return diffMinutes <=0? 0: diffMinutes;
    }

    var secondDiff = function(date1, date2) {
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffSeconds = Math.floor(timeDiff / (1000)); 
	return diffSeconds <=0? 0: diffSeconds;
    }

    return serviceInstance;

});

testApp.factory('commentsService', function(commonOJService, dateService, $http, $timeout, $q, $compile) {

    var serviceInstance = {};

    serviceInstance.commentsMap = {};
    
//    commonOJService.registerCategorylistener(function() {
//	
//    });

    serviceInstance.getCommentMetaDataForReplyMain = function(scope) {
	var metaData = {};
	metaData.discussion_id = scope.articleId;
	metaData.replyText = '';
	metaData.scrollToReply = true;
	return metaData;
    }

    serviceInstance.addCommentsToMap = function(article_id, comments) {
	if (comments == null) {
	    return;
	}

	if (serviceInstance.commentsMap[article_id] == null) {
	    serviceInstance.commentsMap[article_id] = {};
	}
	
	commentsMap = serviceInstance.commentsMap[article_id];

	numComments = comments.length;

	for (var i = 0; i < numComments; i++) {
	    commentsMap[comments[i].id] = comments[i];
	}
    }

    serviceInstance.isReplyContainerCollapsing = function(comment) {
	if (comment.id) {
	    var commentReplyContainer = $('#comment-reply-container-' + comment.id);
	} else {
	    var commentReplyContainer = $('#comments-container');
	}
	
	if (commentReplyContainer.length <=0) {
	    return false;
	}

	var classList = commentReplyContainer[0].className.split(/\s+/);
	for (var i = 0; i < classList.length; i++) {
	    if (classList[i] === 'collapsing') {
		return true;
	    }
	}
	return false;
    }

    serviceInstance.updateReplies = function(comment, timeoutFunction) {

	url = null;

	if (comment.id) {
	    url = "/api/1.0/comments/" + comment.id + "?children=true";
	} else {
	    url = "/api/1.0/posts/" + comment.discussion_id + "/comments?top=true";
	}

	if (comment.latest_child) {
	    url = url + "&after=" + comment.latest_child;
	}

	$http.get(url).success(function (data) {updateCommentsOnUi(data, comment, timeoutFunction); 
						/*commentsService.addCommentsToMap(comment.discussion_id, data);*/
					       });

    }


    setVoteClass = function(comment) {
	comment.upvoteClass = "comment-vote-arrow-unvoted";
	comment.downvoteClass = "comment-vote-arrow-unvoted";
	if (comment.current_user_voted == "up") {
	    comment.upvoteClass = "comment-vote-arrow-voted";
	} else if (comment.current_user_voted == "down") {
	    comment.downvoteClass = "comment-vote-arrow-voted";
	}
    };

    serviceInstance.setVoteClass = setVoteClass;

    treatComments = function(comments) {
	numComments = comments.length;

	for (i = 0; i < numComments; i++) {
	    comment = comments[i];
	    //console.log(this);
	    this.setVoteClass(comment);
	    comment.replyContainerCollapsed = true;
	    comment.scrollToReply = true;
	    comment.postedFriendlyString = dateService.getFriendlyDateString(new Date(comment.posted));
	}
    };

    serviceInstance.treatComments = treatComments;

    var updateCommentTextBox = function (comment) {
	comment.replyText = "";

	//comment.popover="You comment has been posted"; //can't be done as of now due to clash 
	                                                 //between tooltip and popover
                                                         //https://github.com/angular-ui/bootstrap/issues/2203 
	//comment.tooltip="You comment has been posted<br><a ng-click=''>Click here to go to the posted comment</a>";
	//$timeout(function() { 
	//    var top = $("#comment-content-container-" + comment.replyId).position().top;
	//    $(window).scrollTop( top );
	//}, 200);
	if (comment.scrollToReply) {
	    $timeout(function() { $("#comment-content-container-" + comment.replyId).goTo(); }, 200);
	}
	//$timeout(function() { $("#comment-content-container-" + comment.replyId).scrollTop(0 + "px"); }, 200);
	

    };

    serviceInstance.updateRepliesAndHandleShow = function(comment, showReplies) {
	
	if (showReplies!=null) {
	    serviceInstance.updateReplies(comment, function() { toggleCollapseOnReply(comment, showReplies); updateCommentTextBox(comment); });
	} else {
	    serviceInstance.updateReplies(comment);
	}
    }

    serviceInstance.createCommentObject = function(comment) {
	replyComment = {};

	replyComment.text = comment.replyText;
	replyComment.discussion_id = comment.discussion_id;
	replyComment.metadata_string = comment.metadata_string;
	if (comment.id) {
	    replyComment.parent_id = comment.id;
	}
	replyComment.author = {};
	//replyComment.author.id = "";
	replyComment.author.id = commonOJService.userData.id;
	replyComment.author.name = commonOJService.userData.first_name + " " + commonOJService.userData.last_name;
	
	return replyComment;
    };

    focusReply = function (comment) {
	replyCreationBox = null;
	if (comment.id) {
	    replyCreationBox = $("#comment-reply-creation-box-" + comment.id)
	} else {
	    replyCreationBox = $("#comment-reply-creation-box")
	}
	
	replyCreationBox.focus();
    }

    serviceInstance.postReply = function(comment, postSubmitCallables) {
	if (!comment.replyText) {
	    comment.tooltip="Comment is Blank";
	    $timeout(function() {focusReply(comment);}, 100);
	    $timeout(function() {comment.tooltip="";}, 20000);
	    return;
	} else {
	    comment.tooltip="";
	    
	    replyComment = serviceInstance.createCommentObject(comment);

	    commentPostPromise = $http.post("/api/1.0/posts/" + comment.discussion_id + "/comments", JSON.stringify(replyComment),
					    {headers: {"Content-Type": "application/json"}})
		.then( function(result) {
		    comment.replyId = result.data.id;
		    serviceInstance.updateRepliesAndHandleShow(comment, true);
		});


	    commentPostPromiseArray = [];
	    commentPostPromiseArray.push(commentPostPromise);
	    //$q.all([commentPostPromise]).then(postSubmitCallables[0]());
	    //$q.all(commentPostPromiseArray).then(serviceInstance.updateRepliesAndHandleShow(comment, true));
	}
    }


    hasCommentsChildElements = function(element) { //this function is not working properly, 
	                                           //we need to check for ng-repeat tag in comments
	                                           //also for replying to comments
	console.log("hasCommentsChildElements: " + element.children("div").length > 0);
	return element.children("div").length > 0;
    }
    
    updateCommentsOnUi = function(data, comment, timeoutFunction) {
	treatComments(data);
	if (comment.id) {
	    commentReplyContainer = $('#comment-reply-container-' + comment.id);
	} else {
	    commentReplyContainer = $('#comments-container');
	}
	scope = commentReplyContainer.scope();
	numChildren = data.length

	if (comment.latest_child) {
	    scope.commentChildren = scope.commentChildren.concat(data);
	    comment.num_replies = comment.num_replies + numChildren; //having this here
	    //requires the guarantee that  
	    //comment.latest_child is blank 
	    //when we first get the comment 
	    //and we initialise it only 
	    //when we have fetched the children 
            //the first time, which is done later

	} else {
	    comment.num_replies = numChildren;
	    scope.commentChildren = data;
	}

	if (!hasCommentsChildElements(commentReplyContainer) && !comment.gotChildren) {
	    $compile('<div comment="commentChild" ng-repeat="commentChild in commentChildren" ng-class="{firstcomment:$first}"></div>')
	    (scope, function(cloned, $scope) {
		commentReplyContainer.append(cloned);
	    });	    
	    comment.gotChildren = true;
	}

	if (numChildren > 0) {
	    //do this on our own as we arn't making another ajax call just to get the new num_replies
	    comment.latest_child = data[numChildren-1].id;
	}
	
//	if (!("commentChildren" in scope) || (scope.commentChildren == null) && comment.latest_child) {
//	    scope.commentChildren = data;
//	} else {
//	    scope.commentChildren = scope.commentChildren.concat(data);
	//	}
//
//	if (comment.latest_child) {
//	    comment.num_replies = comment.num_replies + numChildren; //having this here
//	    //requires the guarantee that  
//	    //comment.latest_child is blank 
//	    //when we first get the comment 
//	    //and we initialise it only 
//	    //when we have fetched the children 
//            //the first time, which is done later
//
//	} else {
//	    comment.num_replies = numChildren;
//	}

	if (timeoutFunction!=null) {
	    timeoutFunction();
	}
	
	
    }



    toggleCollapseOnReply = function(comment, showReplies, num_tries) {
	if (num_tries == null) {
	    num_tries = 0;
	}
	if (serviceInstance.isReplyContainerCollapsing(comment)) { //there seems to be a bug with Bootstrap collapse 
	                                                           //when used with AngularUI 
	                                                           //https://github.com/angular-ui/bootstrap/issues/1240
	    $timeout(function() { comment.replyContainerCollapsed = showReplies }, 50);
	}
	$timeout(function() { comment.replyContainerCollapsed = !showReplies }, 100 + 50*num_tries);

//	if (num_tries < 5 && serviceInstance.isReplyContainerCollapsing(comment)) {
//	    toggleCollapseOnReply(comment, showReplies, num_tries + 1);
//	}
	
    }


    return serviceInstance;

});


testApp.factory('fbService', function($window, $http, $location, $cookies) {

    function postForm(action, data, arrayCallables) {
        var f = document.createElement('form');
        f.method = 'POST';
        f.action = action;
	$http.post(action, $.param(data))
	    .success( function(respCnt) {
		//alert("success " + JSON.stringify(respCnt));
		console.log(data);
		if (arrayCallables != null ) {
		    for (var i = 0; i < arrayCallables.length; i++) {
			arrayCallables[i](respCnt);
		    }
		}

	    })
	    .error( function(respCnt) {
		//alert("error " + JSON.stringify(respCnt));
		console.log(data);
	    });
    }

    function setLocationHref(url) {
        if (typeof(url) == "function") {
            // Deprecated -- instead, override
            // allauth.facebook.onLoginError et al directly.
            url();
        } else {
            window.location.href = url;
        }
    }

    var serviceInstance = {
	
	init: function(opts) {
            this.opts = opts;

            //window.fbAsyncInit = function() {
                FB.init({
                    appId      : opts.appId,
                    channelUrl : opts.channelUrl,
                    status     : true,
                    cookie     : true,
                    oauth      : true,
                    xfbml      : true
                });
                this.onInit();
            //};

            (function(d){
                var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
                js = d.createElement('script'); js.id = id; js.async = true;
                js.src = "//connect.facebook.net/"+opts.locale+"/all.js";
                d.getElementsByTagName('head')[0].appendChild(js);
            }(document));
        },

        onInit: function() {
        },

        login: function(nextUrl, action, process, arrayCallables) {
            var self = this;
            if (typeof(FB) == 'undefined') {
                return;
            }
            if (action == 'reauthenticate') {
                this.opts.loginOptions.auth_type = action;
            }

            FB.login(function(response) {
                if (response.authResponse) {
                    self.onLoginSuccess.call(self, response, nextUrl, process, arrayCallables);
                } else if (response && response.status && ["not_authorized", "unknown"].indexOf(response.status) > -1) {
                    self.onLoginCanceled.call(self, response);
                } else {
                    self.onLoginError.call(self, response);
                }
            }, self.opts.loginOptions);
        },

        onLoginCanceled: function(response) {
            //setLocationHref(this.opts.cancelUrl);
        },

        onLoginError: function(response) {
            //setLocationHref(this.opts.errorUrl);
        },

        onLoginSuccess: function(response, nextUrl, process, arrayCallables) {
            var data = {
                next: nextUrl || '',
                process: process,
                access_token: response.authResponse.accessToken,
                expires_in: response.authResponse.expiresIn,
                csrfmiddlewaretoken: this.opts.csrfToken
            };

            postForm(this.opts.loginByTokenUrl, data, arrayCallables);
        },

        logout: function(nextUrl) {
            var self = this;
            if (typeof(FB) == 'undefined') {
                return;
            }
            FB.logout(function(response) {
                self.onLogoutSuccess.call(self, response, nextUrl);
            });
        },

        onLogoutSuccess: function(response, nextUrl) {
            var data = {
                next: nextUrl || '',
                csrfmiddlewaretoken: this.opts.csrfToken
            };

            postForm(this.opts.logoutUrl, data);
        }
    };
    //get FB from the global (window) variable.
    var FB = $window.FB;

    // gripe if it's not there.
    if(!FB) throw new Error('Facebook not loaded');

    
    //FB.init();

    //make sure FB is initialized.
    serviceInstance.init({
	appId : '1433556806914281',
	locale: 'en_US',
	loginOptions: {"scope": "email,publish_stream"},
	loginByTokenUrl: '/accounts/facebook/login/token/',
	channelUrl : 'http://www.newsoftheworld.lo/accounts/facebook/channel/',
	cancelUrl: '/accounts/social/login/cancelled/',
	logoutUrl: '/accounts/logout/',
	errorUrl: '/accounts/social/login/error/',
	csrfToken: $cookies.csrftoken
    });
    return serviceInstance;

});


testApp.factory('profileService', function() {

    var serviceInstance = {};

    serviceInstance.getAuthorName = function(author) {
	var authorName = "";
	if (author.first_name) {
	    authorName = author.first_name + " ";
	}
	if (author.last_name) {
	    authorName = authorName + " " + author.last_name;
	}
	if (!authorName.trim()) {
	    authorName = author.author_name;
	}
 	return authorName;
    }


    serviceInstance.isUploadedImage = function(image) {
	return image.indexOf(":@#") != 0;
    }

    serviceInstance.getProviderData = function(image) {
	providerData = {};
	if (image.indexOf(":@#") ==0) {
	    image = image.substring(":@#".length, image.length);
	    imageDataArray = image.split(":");
	    providerData.providerName = imageDataArray[0];
	    providerData.userIdHash = imageDataArray[1];
	    if (imageDataArray.length >= 3) {
		providerData.userId = imageDataArray[2];
	    } 
	    return providerData;

	}

    }

    serviceInstance.getImageForProvider = function(provider_name, image, size) {
	if (size == null) {
	    size = 200;
	}
	if (provider_name === "gravatar") {
	    return "http://www.gravatar.com/avatar/" + image + "?s=" + size;
	}
    }
    serviceInstance.getProfileImage = function(author) {
	if (!author.image ) {
	    return "http://upload.wikimedia.org/wikipedia/commons/a/aa/Blank_user.svg";
	}
	return author.image;
    }

    serviceInstance.getProfileImageForCommentsAndDisplay = function(author, size) {
	if (!author.image ) {
	    return "http://upload.wikimedia.org/wikipedia/commons/a/aa/Blank_user.svg";
	}

	if (serviceInstance.isUploadedImage(author.image)) {
	    return author.image;
	}

	imageData = serviceInstance.getProviderData(image);    
	
	return serviceInstance.getImageForProvider(imageData.providerName, imageData.userIdHash);
    }

    return serviceInstance;
});

testApp.controller('testController', function($scope) {
    $scope.totalResults = 5;
    $scope.message = "Welcome to Opinion Junction";
});

testApp.controller('mainPageController', function($scope, $http, $modal, commonOJService, profileService, $stateParams) {
    $scope.category = $stateParams.category;

    if ($scope.category) {
	commonOJService.activateHeaderNavLink($scope.category);
	//$scope.topBannerFragment="#category-image";
	$scope.topBannerFragment="#carousel";
	$scope.categoryImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg/1024px-Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg";
    } else {
	commonOJService.activateHeaderNavLink("home");
	$scope.topBannerFragment="#carousel";
    }
    setCategories = function() {
	$scope.categories = commonOJService.categories;
    }

    setCategoryDetailsForCategory = function() {
	var numCategories = commonOJService.categories.length;
	for (var i = 0; i < numCategories;i++) {
	    var category = commonOJService.categories[i];
	    if (category.name === $scope.category) {
		$scope.categories = [category];
	    }
	    
	}
    }

    $scope.message = "Axl is finding lasting success";
 
    $scope.allCategories = false;

    if (!$scope.category) {
	commonOJService.registerCategoryListener(setCategories);	
	$scope.allCategories = true;
    } else {
	//$scope.categories = [$scope.category];
	commonOJService.registerCategoryListener(setCategories);	
    }

    $scope.categoriesMapCreated = false;

    $scope.articleIds = [];

    if ($scope.allCategories) {
		$http.get("/api/1.0/comments/?limit=5", {headers: {"Content-Type": "application/json"}})
		    .success( function(data) {
			$scope.latest_comments = data;
		    });
    } else {
		$http.get("/api/1.0/comments/?limit=5&metadata_string=category%3d'" + $scope.category + "'", {headers: {"Content-Type": "application/json"}})
		    .success( function(data) {
			$scope.latest_comments = data;
		    });


    }

    $scope.getAuthorName = function(author) {
	return profileService.getAuthorName(author);
    }

    $scope.getAuthorImage = function(author) {
	return profileService.getProfileImageForCommentsAndDisplay(author);
    };

    $scope.articles = [];

    $scope.articlesTemp = [];

    $scope.$watch('categories', function(){
	if($scope.categories && $scope.categories!=null) {
	    var numCategories = 1;
	    var categories = null;
	    $scope.articleInfos = [];
	    num_articles_per_request = 5;
	    if ($scope.category) {
		num_articles_per_request = 30;
		numCategories = 1;
		categories = [$scope.category];
	    } else {
		categories = $scope.categories;
		numCategories = $scope.categories.length;
	    }
	    
	    for (i = 0; i < numCategories; i++) {
		var category = categories[i];
		var numServerCalls = 0;
		$http.get("/api/1.0/categories/" + getCategoryName(category) + "/articles?limit=" + num_articles_per_request, {headers: {"Content-Type": "application/json"}, "category" : category}) 
		    
		    .success( function(data, status, headers, config) {
			var category = config["category"];
			numServerCalls = numServerCalls + 1;
			var headerArticleAddedForCategory = false;
			$.each(data, function (index, item) {
			    if (commonOJService.indexOf($scope.articleIds, item.id) <= -1 ) {
				$scope.articleIds.push(item.id);
				$scope.articleInfos.push(item);
				if (!headerArticleAddedForCategory) {
				    headerArticleAddedForCategory = addHeaderArticle(item, category);
				}
			    }
			});
			if (numServerCalls == numCategories) {
			    $scope.articles = $scope.articlesTemp;
			}
			//$scope.articleInfos = $scope.articleInfos.concat(data);
		    });
	    }	    
	}
    });

    var categoryIndexMap = {};

    addHeaderArticle = function(article, category) {
	var categoryName = getCategoryName(category);
	//var numCategories = $scope.categories.length;
	var numArticles = $scope.articlesTemp.length;
	if (article.primary_image) {
	    article.headerCategory = category;
	    categoryIndex = getCategoryIndex(categoryName);
	    if (categoryIndex < 0) {
		return false;
	    }
	    if (numArticles == 0) {
		$scope.articlesTemp.push(article);
		return true;
	    }
	    for (var i=0; i < numArticles;  i++) {
		var addedArticle = $scope.articlesTemp[i];
		var addedArticleCategoryIndex = getCategoryIndex(getCategoryName(addedArticle.headerCategory));
		if (categoryIndex < addedArticleCategoryIndex) {
		    $scope.articlesTemp.splice(i,0, article);
		    return true;
		    //break;
		}
	    }
	    $scope.articlesTemp.push(article);
	    return true;
	   
	}
	return false;
    }

    var getCategoryIndex = function(categoryName) {
	if (categoryName in categoryIndexMap) {
	    return categoryIndexMap[categoryName];
	}
	else {
	    var numCategories = $scope.categories.length;
	    for (var i = 0; i < numCategories; i++) {
		var availableCategory = getCategoryName($scope.categories[i]);
		if (categoryName == availableCategory) {
		    categoryIndexMap[categoryName] = i;
		    return i;
		}
	    }
	}
	return -1;
    }

    $scope.getCategoryIndex = getCategoryIndex;

    getCategoryName = function(category) {
	if (!category) {
	    return category;
	}

	if ((typeof category) === "string") {
	    return category;
	}

	return category.name;
    }

    $scope.getCategoryName = getCategoryName;

    numCalls = 0;

    $scope.get_category_friendly_name_string  = function(article){
	if (article.category_friendly_names) {
	    return article.category_friendly_names;
	}
	articleCategories = article.categories;
	numArticleCategories = articleCategories.length;

	if ($scope.categories == null) {

	    return;
	}
	if (!$scope.categoriesMapCreated) {
	    $scope.categoriesMap = createCategoriesMap($scope.categories);
	    $scope.categoriesMapCreated = true;
	}
	
	category_friendly_names = "";
	if (numArticleCategories > 0) {
	    category_friendly_names = $scope.categoriesMap[articleCategories[0]].friendly_name;
	}
	
	for (i = 1; i < numArticleCategories; i++) {
	    category_friendly_names = category_friendly_names + "," + $scope.categoriesMap[articleCategories[i].friendly_name];
	    //if (category.localCompare
	}

	article.category_friendly_names = category_friendly_names;

	return category_friendly_names;

    }

    createCategoriesMap = function(categories) {
	var categoriesMap = {};
	var numCategories = categories.length;
	for (i = 0; i < numCategories; i++) {
	    category = categories[i];
	    categoriesMap[category.name] = category;
	}
	return categoriesMap;
    }

//    $scope.articles = 
//	[ {"title" : "Celine's Third Law",
//	   "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rummu_aherainem%C3%A4gi2.jpg/1024px-Rummu_aherainem%C3%A4gi2.jpg",
//	   "author" : { 
//               "user_image": "", 
//               "first_name": "Vineet", 
//               "last_name": "Saini", 
//               "num_draft": null, 
//               "user_role": "SuperEditor", 
//               "author_name": "vineetsaini", 
//               "invitation_count": 0, 
//               "user_bio": null, 
//               "email_address": "vineetsaini84@gmail.com", 
//               "id": "10"
//	   },
//	   "categories" : ["Politics"]
//	  },{"title" : "Price of Freedom",
//	     "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Prinzenbau%2C_24.jpg/1024px-Prinzenbau%2C_24.jpg",
//	     "author" : {
//               "user_image": "", 
//               "first_name": "Dhruwat", 
//               "last_name": "Bhagat", 
//               "num_draft": null, 
//               "user_role": "administrator", 
//               "author_name": "ranubhai", 
//               "invitation_count": 0, 
//               "user_bio": null, 
//               "email_address": "unitedronaldo@yahoo.com", 
//               "id": "1"
//	     },
//	     "categories" : ["Identities"]
//	   }];
    

    
});

testApp.controller('mainController', function($scope, $http, $modal, commonOJService, $stateParams) {

    $scope.category = $stateParams.category;
    
    $scope.navSubmenuCollapsed = true;

    $scope.hoverCategory = function(event) {
	$scope.navSubmenuCollapsed = false;
    }

    setCategories = function() {
	$scope.categories = commonOJService.categories;
    }

    $scope.$watch('categories', function() {
	if ($scope.categories !=null) {
	    var numCategories = $scope.categories;
	    for (var i = 0; i < numCategories; i++) {
		var category = $scope.categories[i].name;
		var linkDetails = {};
		linkDetails.className="";
		$scope.linkDetailsMap.category = linkDetails;
	    }
	    var linkDetails = {};
	    linkDetails.className="";

	    $scope.linkDetailsMap["home"] = linkDetails;
	    var linkDetails = {};
	    linkDetails.className="";


	    $scope.linkDetailsMap["settings"] = linkDetails;
	}

    });
    commonOJService.registerCategoryListener(setCategories);
    
    $scope.rightNavBar = "signinNavBar.html";
    $scope.message = "Welcome to Opinion Junction!";
    $scope.navbarCollapsed = true;
    $scope.totalResults = 5;
    $scope.userData = null;
    $scope.linkDetailsMap = {};
    $scope.categoryLinkArray = [];


    var categoryLinkDeactivator = function() {
	var numCategories = commonOJService.categories.length;

	for (var i = 0; i < numCategories; i++) {
	    var category = commonOJService.categories[i].name;
	    if (category in  $scope.linkDetailsMap) {
		$scope.linkDetailsMap[category].categoryLinkClassName = "";
	    }
	}


    }

    var categoryLinkActivator = function(index) {
	if (index == null || index < 0) {
	    return;
	}

	var numCategories = commonOJService.categories.length;

	for (var i = 0; i < numCategories; i++) {
	    var category = commonOJService.categories[i].name;
	    if (category in  $scope.linkDetailsMap) {
		$scope.linkDetailsMap[category].categoryLinkClassName = "";
	    }
	}

	var category = commonOJService.categories[index].name;

	if (category in $scope.linkDetailsMap) {
	    $scope.linkDetailsMap[category].categoryLinkClassName = "navbar-category-link-focussed";
	} else {
	    $scope.linkDetailsMap[category] = {};
	    $scope.linkDetailsMap[category].categoryLinkClassName = "navbar-category-link-focussed";
	}

//	category = $scope.categories[i].name;
//
//
//	for (var i = 0; i < numCategories; i++) {
//	    $scope.categoryLinkArray[i] = "";
//	}
//
//	$scope.categoryLinkArray[index] = "navbar-category-link-focussed";
//
    }
    
    var headerLinkActivator = function(linkName) {
	if (!linkName) { //I don't know why this method gets called with null linkName
	    return;
	}
	for (var link in $scope.linkDetailsMap) {
	    $scope.linkDetailsMap[link].className = "";
	}
	if (linkName in $scope.linkDetailsMap) {
	    $scope.linkDetailsMap[linkName].className = "active";
	} else {
	    $scope.linkDetailsMap[linkName] = {};
	    $scope.linkDetailsMap[linkName].className = "active";
	}
	
    }
//    $scope.articles = [{
//	"name": "Article 1",
//	"text": "Article 1 text",
//	"image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rummu_aherainem%C3%A4gi2.jpg/1024px-Rummu_aherainem%C3%A4gi2.jpg"
//    }, {
//	"name": "Article 2",
//	"text": "Article 2 text",
//	"image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Prinzenbau%2C_24.jpg/1024px-Prinzenbau%2C_24.jpg"
//    }];

    setUserData = function(commonOJService, scope) {
	$scope.userData = commonOJService.userData;
    }

    commonOJService.registerHeaderLinkActivator(headerLinkActivator);

    commonOJService.registerCategoryLinkActivator(categoryLinkActivator);

    commonOJService.registerCategoryLinkDeactivator(categoryLinkDeactivator);
    
    setNavBarOnSigninUnConfUser = function(serviceInstance, scope) {
	if (serviceInstance.userData.code && serviceInstance.userData.code == "user_not_setup_for_oj") {
	    setUserData(serviceInstance);
	    setNavBarOnSignin(serviceInstance, $scope);
	    //$scope.userData = serviceInstance.userData;
	} else {
	    $scope.userData = null;
	    //setSigninModalToOpen();
	}
	
    }

    
    setNavBarOnSignin = function(commonOJService, scope) {
	if ($scope.userData!=null) {
	    $scope.rightNavBar = "loggedInNavBar.html";
	    if ($scope.$parent != null) {   
		$scope.$parent.rightNavBar = "loggedInNavBar.html";
	    }
	}

    };

    openSigninModal = function() {
	if ($scope.userData!=null) {
	    return;
	}
	var modalInstance = $modal.open({
	    templateUrl: 'loginModalContent.html',
	    controller: ModalInstanceCtrl,
	    resolve: {
		items: function () {
		    return $scope.items;
		}
            }
	});

        modalInstance.result.then(function (isLoggedIn) {
    	    if (isLoggedIn) {
	//	$scope.rightNavBar = "loggedInNavBar.html";
	//	if ($scope.$parent != null) {   
	//	    $scope.$parent.rightNavBar = "loggedInNavBar.html";
	//	}
		//scope.rightNavBar = "loggedInNavBar.html"; //some crazy work, can't figure out why scope != %scope !!
		//commonOJService.controllerInit(arrayCallables, $scope, null);
		commonOJService.controllerInit([setUserData, setNavBarOnSignin], $scope, [setNavBarOnSigninUnConfUser], null);
	    }
        });
    }

    arrayCallables = [setUserData, setNavBarOnSignin ];

    arrayCallablesFailure = [openSigninModal];

    $scope.$watch('signinModalToBeOpened', function() {
	signinModalToOpen = $scope.signinModalToBeOpened;
	$scope.signinModalToBeOpened = false;
	if ($scope.userData == null && signinModalToOpen) {
	    openSigninModal();
	}
	
    });

    setSigninModalToOpen = function() {
	$scope.signinModalToBeOpened = true;
    }

    $scope.signinModal = function() {
	commonOJService.controllerInit(arrayCallables, $scope, [setNavBarOnSigninUnConfUser, setSigninModalToOpen], null);
	//commonOJService.controllerInit(arrayCallables, $scope, arrayCallablesFailure, {"setNavBarOnSignin" : setNavBarOnSignin});
	if ($scope.userData!=null) {
	    $scope.rightNavBar = "loggedInNavBar.html";
	    return;
	}

    };

    $scope.$on('$destroy', function() {
	removeCallablesFromEveryChangeMap("userData", ["setNavBarOnSignin"]);
    });

    var userLoggedIn = function() {
	if (commonOJService.isUserLoggedIn()) {
	    $scope.rightNavBar = "loggedInNavBar.html";
	}
    };

    $scope.initFunction = function() {
	commonOJService.registerListeners("userData", "mainController-" + $scope.$id,  [userLoggedIn], "yesWithData");
	commonOJService.controllerInit([setUserData, setNavBarOnSignin], $scope, [setNavBarOnSigninUnConfUser], null);
	    /*$http.get('/api/1.0/authors/loggedin/self/').then(function(response) {
		if (response.data.ok && response.data.ok === "false") {

		} else if (response.data.id && response.data.id!=null){
		    $scope.rightNavBar = "loggedInNavBar.html";
		    $scope.userData = response.data;
		    commonOJService.userData = response.data;
		}
	    });*/
	
    };

});


testApp.controller('articleController', function($scope, $http, $stateParams, commonOJService) {
    $scope.message = "Welcome to Opinion Junction's First Article";
    $scope.articleId = $stateParams.articleId;
    $http.get("/api/1.0/articles/" + $scope.articleId, {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		if (data.length > 0) {
		    $scope.article = data[0];
		    commonOJService.activateHeaderNavLink($scope.article.categories[0]);
		}
	    });

    $scope.comments_init = function () {
        $('iframe_comments').height($('iframe_comments').contents().height());
        //$(this).width($(this).contents().width());
    }

    $scope.isUserLoggedIn = function() {
	return commonOJService.userData && (commonOJService.userData.id || (commonOJService.userData.code === "user_not_setup_for_oj"));
    }
});

testApp.controller('signinController', function($scope) {
    $scope.message = "Welcome to Opinion Junction's First Article";
});

testApp.controller('userProfileController', function($scope, $http, profileService, commonOJService) {
    $scope.message = "Hello, welcome to your profile";
    $scope.profilePreview = {};
    $scope.profilePreview.genderText = "Male";
    $scope.profilePreview.imageAltText = "Profile Image";
    $scope.profileForm = {};
    $scope.profileFormOther = {};
    $scope.formClasses = {};
    $scope.profilePreview.gravatarErrorClass = "hide";

    genderDict = {"male":{"text":"Male"},"female":{"text":"Female"},"other":{"text":"Other"}, "": {"text":"No Answer"}};

    $scope.submitError = $scope.submitSuccess = "";
    $scope.showError = $scope.showSuccess = false;

    $scope.hideError = function() {
	$scope.showError = false;
    }

    $scope.hideSuccess = function() {
	$scope.showSuccess = false;
    }

    $scope.selectGender = function(gender) {
	$scope.profilePreview.genderText = genderDict[gender]["text"];
	$scope.profileForm.gender = gender;
    };
    $scope.getProfileImage = function(comment) {
	return profileService.getProfileImage(comment.author);
    }

    var checkGravatarIdAndInvalidateImageUpload = function() {
	if ($scope.profileForm.gravatarId && commonOJService.validateEmail($scope.profileForm.gravatarId)) {
	    $("#imageUpload").val(null); //necessary for chrome, could have check $browser.webkit, but that isn't 100% reliable
	}
    }

    $scope.$watch("profileForm.gravatarId", function() {
	if ($scope.profileForm.gravatarId && !commonOJService.validateEmail($scope.profileForm.gravatarId)) {
	    $scope.profilePreview.gravatarErrorClass = "";
	    $scope.profileForm.imageError = "gravatarIdIncorrect";
	} else {
	    $scope.profilePreview.gravatarErrorClass = "hide";
	}
    }); 
    $scope.previewImage = function() {
	$scope.profileForm.newImageMode = "upload";
	$scope.profileForm.gravatarId = "";
	reader = new FileReader();
	reader.onload = function(e) {
	    imageData = reader.result.replace(/^data:application\/octet-stream/, 'data:image/jpeg');
	    $scope.$apply(function() {
		$scope.profileForm.imageData = imageData;
		$scope.profilePreview.selectedImage = imageData;
		
	    });
	    
	}
	reader.readAsDataURL($("#imageUpload")[0].files[0]);
	$scope.profileForm.image = $("#imageUpload")[0].files[0].name;
	$scope.profilePreview.imageAltText = "Profile Image";
	$scope.profilePreview.imageTooltip = "";
	
    }


    $scope.setPreviewImageOnInit = function(image) {
	if (profileService.isUploadedImage(image)) {
	    $scope.profilePreview.selectedImage = image;
	    $scope.profileForm.gravatarId = "";
	} else {
	    //$scope.profileForm.imageSource = providerImageData.providerName;
	    providerImageData = profileService.getProviderData(image);
	    $scope.profilePreview.imageAltText = providerImageData.providerName;
	    $scope.profilePreview.imageTooltip = providerImageData.providerName.charAt(0).toUpperCase() + providerImageData.providerName.slice(1);
	    $scope.profilePreview.selectedImage = profileService.getImageForProvider(providerImageData.providerName, providerImageData.userIdHash); 
	    $scope.profileForm.gravatarId = providerImageData.userId;
	}
    }

    $scope.populateForm = function() {
	$scope.profileForm.first_name = $scope.userData.first_name;
	$scope.profileForm.last_name = $scope.userData.last_name;
	$scope.profileForm.gender = $scope.userData.gender;
	if ($scope.profileForm.gender && $scope.profileForm.gender in genderDict) {
	    $scope.profilePreview.genderText = genderDict[$scope.profileForm.gender]["text"];
	}

	imageData = profileService.getProfileImage($scope.userData);
	//$scope.profileForm.image = imageData;
	$scope.setPreviewImageOnInit(imageData);
	$scope.profileForm.user_bio = $scope.userData.user_bio;
	//$scope.profilePreview.selectedImage = profileService.getProfileImage($scope.userData);
    }

    setUserDataForUserSettings = function() {
	$scope.userData = commonOJService.userData;
	//$scope.profilePreview.selectedImage = profileService.getProfileImage($scope.userData);
	$scope.populateForm();
    }

    $scope.init = function() {
	//$scope.selectedImage = profileService.getProfileImage(commonOJService.userData);
	console.log("userProfileController.init()");
	commonOJService.registerListeners("userData", "userProfileController-" + $scope.$id,  [setUserDataForUserSettings], "yesWithData"); 
	//$scope.profile.selectedImage = "http://upload.wikimedia.org/wikipedia/commons/a/aa/Blank_user.svg";
	$("#imageUpload").change($scope.previewImage);
	$("#gravatarId").blur(checkGravatarIdAndInvalidateImageUpload);
    }

    $scope.updateProfile = function() {
	var submitDetails = {};
	var form_errors = [];
	if ($scope.profileForm.gravatarId && !commonOJService.validateEmail($scope.profileForm.gravatarId)) {
	    $scope.formClasses.gravatarId = "has-error";
	    form_errors.push("Gravatar Id (Incorrect/Unsupported Format");
	} else {
	    if ($scope.profileForm.gravatarId) {
		submitDetails.image = ":@#gravatar:" + $scope.profileForm.gravatarId;
		submitDetails.update_image = "true";
	    } else if ($scope.profileForm.image) {
		submitDetails.image_data = $scope.profileForm.imageData;
		submitDetails.image = $scope.profileForm.image/*$("#imageUpload")[0].files[0].name*/;
		submitDetails.update_image = "true";
	    }
	    $scope.formClasses.gravatarId = "";
	}

	if ($scope.profileForm.first_name) {
	    submitDetails.first_name = $scope.profileForm.first_name;
	    $scope.formClasses.first_name = "";
	} else {
	    $scope.formClasses.first_name = "has-error";
	    form_errors.push("First Name (Blank)");
	}

	if ($scope.profileForm.last_name) {
	    submitDetails.last_name = $scope.profileForm.last_name;
	    $scope.formClasses.last_name = "";
	} else {
	    $scope.formClasses.last_name = "has-error";
	    form_errors.push("Last Name (Blank)");
	}

	submitDetails.gender = $scope.profileForm.gender;

	submitDetails.user_bio = $scope.profileForm.user_bio;
	if (form_errors.length > 0) {
	    $scope.errorMessage = "The following fields are incorrect: " + form_errors;
	    $scope.showError = true;
	} else {
	    $scope.errorMessage = "";
	    $scope.showError = false;
	    $http.post('/api/1.0/authors/loggedin/self/profile', JSON.stringify(submitDetails), {headers: {"Content-Type": "application/json"}})
		.success(function() {
		    $scope.errorMessage = "";
		    $scope.showError = false;
		    $scope.showSuccess = true;
		    $scope.successMessage = "Profile updated successfully";
		    commonOJService.controllerInit();
		})
	    .error(function(data) {
		    $scope.showError = true;
		    $scope.errorMessage = data;
		    $scope.showSuccess = false;
		    $scope.successMessage = "";
		});

	    //}
	}

	for (prop in $scope.profile) {
	    //if 
	}
//	if (!$scope.profile.$pristine) {
//	    console.log($scope.profile);
//	}
//	profile_changes = {};
//	profile.first_name = first_name;
//	profile.last_name = last_name;
    }
    $scope.init();
    
});

testApp.controller('publicProfileController', function($scope, commonOJService, profileService, $stateParams) {

});

testApp.controller('createArticleController', function($scope, $http, commonOJService, $location, $rootScope, $stateParams) {

    fieldsAccessForEditMode = {"topic" : ""};

    $scope.articleFields = ["topic","slug"];

    $scope.articleAuthor = null;

    $scope.editEnabled = true;

    $scope.articleInitialised = false;
    $scope.isEditEnabled = function(fieldName) {
	if ($scope.articleAuthor == null) {
	    return false;
	}
	if (commonOJService.userData.id == $scope.articleAuthor.id) {
	    if (commonOJService.indexOf(commonOJService.userData.user_permissions, "edit_articles") <= -1 ||
		commonOJService.userData.num_drafts <= 0){
		return false;
	    }
	    
	} else if (commonOJService.indexOf(commonOJService.userData.user_permissions, "edit_others_articles") <= -1) {
	    return false;
	} 

	return true;
    }

    var primaryImageExists = function(content) {
	var contentDom = document.createElement( 'div' );
	contentDom.innerHTML = content;
	//var contentDom = new DOMParser().parseFromString(content, "text/xml");
	var imgElements = contentDom.getElementsByTagName("img");
	var numElements = imgElements.length;
	for (var i = 0; i < numElements; i++ ) {
	    var element = imgElements[i];
	    var primaryAttr = element.getAttribute("primaryimage");
	    if (primaryAttr == "true" )
		return true;
	}
	return false;
    }

    $scope.tinymceOptions = {
      // General options
      theme : "modern",
      width : "800px",
      height : "800px",
      plugins : ["advlist","autoresize","autosave","fullscreen","image","media","paste","preview",
		 "searchreplace","spellchecker","visualblocks","visualchars","wordcount", "notwimageupload"],
      toolbar: ["undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | notwimageupload | notwprimaryimage"],
      paste_data_images: true, //http://stackoverflow.com/questions/21082723/tinymce-can-no-longer-drag-and-drop-images-after-upgrading-from-version-3-to-ver
      convert_urls: false, //http://www.tinymce.com/tryit/url_conversion.php
      extended_valid_elements: "@[primaryimage]", //http://stackoverflow.com/questions/5444677/wordpress-visual-editor-tinymce-how-to-preserve-custom-attributes
      valid_elements: "@[primaryimage]," + //Your attributes HERE!!!
      "a[name|href|target|title]," +
      "#p,-ol,-ul,-li,br,img[src],-sub,-sup,-b,-i," +
      "-span,hr",

    };

    check_create_allowed = function() {
	if (commonOJService.indexOf(commonOJService.userData.user_permissions,"create_articles") <= -1 ) {
    	    return false;
    	}
	return true;
    }

    $scope.setupEditModeOnInit = function(scope) {
        if ($location.path().indexOf("/user/editarticle/") == 0) {
    	    scope.articleId = $stateParams.articleId;
    	    getArticleForEditMode();
    	    scope.mode = "edit";
        } else {
	    scope.mode = "create";
	    if (!check_create_allowed()) {

		commonOJService.messageForControllers.messageViewErrorMessage = "You don't have permissions to create articles";
		
		scope.pageLeaveBehaviourDisabled = true;

		$location.path("/message");

	    }
	    scope.authorWhoCanEditId = -1;
	}
    };

    setupEditModeOnInitOJWrapper = function(commonOJService, scope) {
	$scope.setupEditModeOnInit(scope);
    }

    getArticleForEditMode = function() {
	$http.get("/api/1.0/articles/" + $scope.articleId, {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		if (data.length > 0) {
		    article = data[0];
		    $scope.topic = article.title;
		    $scope.slug= article.slug;
		    $scope.excerpt = article.excerpt;
		    $scope.articleAuthor = article.author;
		    $scope.content = article.storytext;
		    $scope.content = article.storytext;
		    
		} else {
		    $scope.errorMessage="Opinion not found";
		    $scope.submitError = true;
		    $scope.showError = true;
		}
		
	    }).error( function(data) {
		$scope.errorMessage="Opinion not found";
		$scope.submitError = true;
		$scope.showError = true;
	    });
    };

    $scope.mode = "edit";
    $scope.message = "Welcome to Opinion Junction's First Article";
    $scope.sidebarArticleCapabilities = [];

    $scope.invitationDivCollapse = false;

    $scope.popularTags = [];

    setCategories = function() {

	$scope.categories = commonOJService.categories;
    }

    commonOJService.registerCategoryListener(setCategories);
    $scope.categories = commonOJService.categories;
    $scope.showPopularTags = false;
    $scope.popularTagsDivCollapse = true;

    createArticleModeDict = { "create" : { "articlePostUrl" : "" }, "edit" : { "articlePostUrl" : "" } };

    $scope.setPageLeaveBehaviour = function (commonOJService, scope) {

            scope.$on('$locationChangeStart', function (event, next, current) {
		if (scope.pageLeaveBehaviourDisabled != true) {
		    var answer = confirm("Are you sure you want to leave this page?")
		    if (!answer) {
    			event.preventDefault();
		    }
		}
            });
	


    };

    $scope.init = function() {
	arrayCallables = [initSidebarCapabilities, setupEditModeOnInitOJWrapper,  $scope.setPageLeaveBehaviour];
	commonOJService.controllerInitOrRedirect(arrayCallables,$scope);
	//$scope.getPopularTags();
	//$scope.getCategories();

    }


    

    $scope.getPopularTags = function() {
	if ($scope.showPopularTags !== true) {
	    $http.get('/api/1.0/tags/?popular=true&num_docs=10').success(function(response) {
		if (response.data && response.data.ok && response.data.ok === "false") {
		
		} else {
		    $scope.popularTags = response;
		    $scope.showPopularTags = true;
		    $scope.popularTagsDivCollapse = false;
		}
	
	
	    });
	}
    };

    
//    $scope.getCategories = function(){
//	$http.get('/api/1.0/categories/').success(function(response) {
//	    if (response.data && response.data.ok && response.data.ok === "false") {
//		
//	    } else {
//		    $scope.categories = response;
//	    }
//	});
//    }


    $scope.init();

    $scope.isArticleDivCollapsed = false;
    $scope.activeItem = "create_articles";

    $scope.navClass = function(page) {
        return page === $scope.activeItem ? "active" : "";
    };
            
    $scope.topic = "";

    $scope.slug = "";

    $scope.excerpt = "";

    $scope.content = "";


    $scope.originalContent = "";
    


    $scope.activateItem = function(id) {
            
        $scope.activeItem = id;
    };
            
    $scope.statusText = "Draft";

    $scope.status = "draft";

    $scope.allStatusValues = {"draft" : "draft,Draft", "pending_review" : "pending_review,Pending Review", "published" : "published,Published" }; 
    $scope.permissionStatusValuesMapForSelf = { "edit_articles" : ["draft,Draft","pending_review,Pending Review"], 
					     "publish_articles": ["published,Published"] }; 

    $scope.permissionStatusValuesMapForOthers = {"publish_others_articles" : ["draft,Draft", "published,Published"] , 
				     /*"edit_others_article" : ["pending_review,Pending Review"]*/ }; 

   
    $scope.allowedStatusValuesMap =  commonOJService.getAllObjectValues($scope.allStatusValues);
 
    getAllowedStatusValuesMap = function() {
	allowedStatusValuesMap = [];
	if ($scope.articleAuthor == null || commonOJService.userData.id == $scope.articleAuthor.id) {
      	    for (permission in $scope.permissionStatusValuesMapForSelf) {
    		if (commonOJService.indexOf(commonOJService.userData.user_permissions,permission) > -1 ) {
    		    allowedStatusValuesMap = allowedStatusValuesMap.concat($scope.permissionStatusValuesMapForSelf[permission]);
    		}
    	    }
	} else {
	    for (permission in $scope.permissionStatusValuesMapForOthers) {
		if (commonOJService.indexOf(commonOJService.userData.user_permissions,permission) > -1 ) {
		    allowedStatusValuesMap = allowedStatusValuesMap.concat($scope.permissionStatusValuesMapForOthers[permission]);
		}
	    }
	}
	
	if ($scope.status) {
	    allowedStatusValuesMap = allowedStatusValuesMap.concat(commonOJService.getObjectValue($scope.allStatusValues, $scope.status));
	}
	
	return commonOJService.unique(allowedStatusValuesMap);
    }

    $scope.showStatusDropDown = function() {
	if ($scope.mode == "edit") {
	    if (commonOJService.userData == null || $scope.articleAuthor == null) {
		return false;
	    }

	    if (commonOJService.userData != null && commonOJService.userData.id != $scope.articleAuthor.id) {
		if (commonOJService.indexOf(commonOJService.userData.user_permissions, 
					     "edit_others_articles") <= -1 && 
		    commonOJService.indexOf(commonOJService.userData.user_permissions, "publish_others_articles") <= -1) {
		    return false;
		}
	    }
	}
	return true;
    }

    $scope.statusDropDownVisible = $scope.showStatusDropDown();


 
    $scope.getStatus = function(statusStatusValue){
	return statusStatusValue.split(",")[0];
    }

    $scope.getStatusValue = function(statusStatusValue){
	return statusStatusValue.split(",")[1];
    }

    $scope.setArticleDivCollapse = function(collapse) {
               
        $scope.isArticleDivCollapsed = collapse;
    }

    $scope.setStatus = function(statusStatusValue) {
	$scope.status = statusStatusValue.split(",")[0];
	$scope.statusText = statusStatusValue.split(",")[1];
    }

    $scope.$watch("topic", function() {
        $scope.slug = $scope.topic.toLowerCase().replace(new RegExp("[^\\w ]", "g"),'');
        $scope.slug = $scope.slug.replace(new RegExp(" +", "g"), "-");
    });
            
    $scope.$watch("slug", function() {
        $scope.slug = $scope.slug.replace(new RegExp("[^a-zA-Z0-9-]", "g"),'');
    });

    setPageLeaveBehaviourForEdit = function() {
	if($scope.articleAuthor != null && !$scope.editEnabled && !$scope.statusDropDownVisible) {
	    commonOJService.messageForControllers.messageViewErrorMessage = "You don't have permissions to edit articles";
	    
	    $scope.pageLeaveBehaviourDisabled = true;

	    $location.path("/message");

	}
    }

    $scope.$watchCollection("[mode, articleAuthor]", function() {
	if ($scope.mode == "edit") {
	    $scope.editEnabled = $scope.isEditEnabled("");
	    if ($scope.editEnabled) {
		$scope.authorWhoCanEditId = article.author.id;
	    }
	    $scope.allowedStatusValuesMap = getAllowedStatusValuesMap();
	    $scope.statusDropDownVisible = $scope.showStatusDropDown();
	    $scope.articleInitialised = true;
	    setPageLeaveBehaviourForEdit();
	}
    });

    $scope.checkboxClicked = function(row) {
	if ("selected" in row) {
	    row.selected = true;
	} else {
	    row.selected = !row.selected;
	}
    }

    $scope.closeJumbo = function() {
	//$("jumbotron").fadeOut().remove();
	$scope.invitationDivCollapse = true;
    }

    $scope.showError = true;
    $scope.submitError = false;

    $scope.selectedTags = "";

    $scope.validateInputs = function(){
	$scope.invalidateErrorDetails();
	if (!$scope.topic){
	    $scope.setValidationErrorDetails("topicSuccessClass", "Topic cannot be left Blank");
	    return {"error" : true};
	}
	if (!$scope.slug) {
	    $scope.setValidationErrorDetails("slugSuccessClass", "Slug cannot be left Blank");
	    return {"error" : true};
	}
	if (!$scope.excerpt) {
	    $scope.setValidationErrorDetails("excerptSuccessClass", "Excerpt cannot be left Blank");
	    return {"error" : true};
	}

	if (!$scope.content) {
	    $scope.setValidationErrorDetails("", "Opinion Content cannot be left Blank");
	    $scope.contentFocus = true;
	    return {"error" : true};	    
	}

	return {"error" : false};
    }

    $scope.setValidationErrorDetails = function(successClassAttribute, errorMessage) {
	if (successClassAttribute) {
	    $scope[successClassAttribute] = "has-error";
	}
	$scope.errorMessage = errorMessage;
	$scope.showError = true;
	$scope.submitError = true;
    }

    $scope.invalidateErrorDetails = function() {
	$scope.errorMessage = "";
	$scope.topicSuccessClass = "";
	$scope.slugSuccessClass = "";
	$scope.excerptSuccessClass = "";
	$scope.showError = false;
	$scope.submitError = false;
	
    }
    
    var processBinaryImages = function() {
	//alert("Hello");
	console.log("Article Content:");
	console.log($scope.content);
	var elements = $($scope.content);
	elements.find("img").each(function(index){
	    if (this.src.startsWith("data:image") ) {
		//alert("Image is comprised of Binary Data");
		
	    }

	}); 
	//alert(elements.find("img").length);
    };

    $scope.submitArticle = function() {
	//processBinaryImages();
	//return;
	var validationResult = $scope.validateInputs();
	if (validationResult.error == true)
	    return;
	if (($scope.status == "published" || $scope.status == "pending_review") && !primaryImageExists($scope.content)) {
	    $scope.invalidateErrorDetails();
	    $scope.setValidationErrorDetails("", "Opinion Content needs to have a primary image");
	    $scope.contentFocus = true;	    
	    return;
	}
	var article = new Object();
	article.title = $scope.topic;
	article.slug = $scope.slug;
	article.excerpt = $scope.excerpt;
	if ($scope.content != $scope.originalContent) {
	    article.storytext = $scope.content;
	}
	article.tags = $scope.getAllSelectedTags($scope.selectedTags, $scope.getSelectedValues($scope.popularTags));

	article.categories = $scope.getSelectedValues(commonOJService.categories);

	article.status = $scope.status;


	permission_logic = {};

	if ($scope.mode === "create") {

            $http.post("/api/1.0/articles", JSON.stringify(article), {headers: {"Content-Type": "application/json"}})
            .success(function(data) {
                $scope.submitSuccess = true; $scope.showSuccess = true;
                $scope.submitError = false; $scope.showError = false;
		$scope.articleId = data.articleid; 
		if (commonOJService.indexOf(commonOJService.userData.user_permissions, "edit_articles") == -1) {
		    if ("message" in data) {
			commonOJService.messageForViewArticlesController = data.message;
		    } else {
			commonOJService.messageForViewArticlesController = "Successfully Submitted your Opinion!";
		    }
		    
		    $location.path("/user/articles");
		} else {
		    $scope.mode = "edit";
		    $scope.setSuccessMessage(data);
		    if ("storytext" in data) {
			$scope.content = data.storytext;
			$scope.contentChangedAngular  = true;
		    }
		    
		}
		
            })
            .error(function(data) {
                $scope.submitSuccess = false; $scope.showSuccess = false;
                $scope.submitError = true; $scope.showError = true;
		$scope.setErrorMessage(data);
            });
        
	} else {
            $http.post("/api/1.0/articles/" + $scope.articleId, JSON.stringify(article), {headers: {"Content-Type": "application/json"}})
            .success(function(data) {
                $scope.submitSuccess = true; $scope.showSuccess = true;
                $scope.submitError = false; $scope.showError = false; 
		$scope.setSuccessMessage(data);
		if ("storytext" in data) {
		    $scope.content = data.storytext;
		    $scope.contentChangedAngular  = true;
		}
            })
            .error(function(data) {
                $scope.submitSuccess = false; $scope.showSuccess = false;
                $scope.submitError = true; $scope.showError = true;
		$scope.setErrorMessage(data);
            });
	}
    }

    $scope.getAllSelectedTags = function(selectedTags, selectedPopularTags) {
	selectedTagsArray = [];
	$.each(selectedTags.split(","), function() {
	    selectedTagsArray.push($.trim(this));
	});
	allSelectedTags = selectedTagsArray.concat(selectedPopularTags);
	return commonOJService.unique(allSelectedTags);
    };

    $scope.getSelectedValues = function(data) {
	selectedEntries = [];
	for (var i = 0; i < data.length; i++) {
	    row = data[i];
	    if (("selected" in row)  && (row.selected === true)) {
		selectedEntries.push(row.name);
	    }
	}
	return selectedEntries;
    } 


    $scope.setSuccessMessage = function(data) {
	if ("message" in data) {
	    $scope.successMessage = data.message;
	} else {
	    $scope.successMessage = "Successfully submitted your Opinion";
	}
    };

    $scope.setErrorMessage = function(data) {
	if ("message" in data) {
	    $scope.errorMessage = data.message;
	} else {
	    $scope.errorMessage = "Error with submitting your Opinion";
	}
    };

    $scope.hideError = function() {
	$scope.showError = false;
    };

    $scope.hideSuccess = function() {
	$scope.showSuccess = false;
    }


    

});

testApp.controller('viewArticlesController', function($scope, commonOJService, $http) {
    $scope.message = "Welcome to Opinion Junction's First Article";
    $scope.sidebarArticleCapabilities = [];


    $scope.showSuccess = false;

    $scope.successMessage = "";

    $scope.init = function() {
	arrayCallables = [initSidebarCapabilities, getArticlesWrapperForService];
	commonOJService.controllerInitOrRedirect(arrayCallables,$scope);
	if (commonOJService.messageForViewArticlesController) {
	    $scope.successMessage = commonOJService.messageForViewArticlesController;
	    commonOJService.messageForViewArticlesController = "";
	    $scope.showSuccess = true;
	}
	//$scope.getArticles(0);
    }

    $scope.PAGE_DIRECTION_NEXT = 1;
    $scope.PAGE_DIRECTION_PREVIOUS = -1;
    $scope.articles = [];
    $scope.pageNumber = -1;

    $scope.topArticleId = "";
    getArticlesWrapperForService = function (commonOJService, scope, pageNumber) {
	if (typeof(pageNumber) === 'undefined') {
	    pageNumber = 0;
	}
	$scope.getArticles(pageNumber);
    }

    $scope.getArticles = function (pageNumber) {
	if (typeof(pageNumber) === 'undefined') {
	    pageNumber = 0;
	}
	articlesUrl = "/api/1.0/articles/?no_content=true&limit=10";
	if (commonOJService.userData == null) {
	    return;
	}
	if (!(("edit_others_articles" in commonOJService.userData.user_permissions) || 
	      ("publish_others_articles" in commonOJService.userData.user_permissions))) {
	    articlesUrl = articlesUrl + "&authorId=" + commonOJService.userData.id;
	}
	if (pageNumber !=0 ) {
	    topArticleId = $scope.pageResultsMap["results" + (pageNumber-1)].topArticleId;
	    articlesUrl = articlesUrl + "&fromId=" + topArticleId;
	}
        $http.get(articlesUrl, {headers: {"Content-Type": "application/json"}})
        .success(function(data) {
	    //alert(JSON.stringify($scope.articles[0].author.author_name));
	    if (data.length > 0){
		$scope.articles = data;
		$scope.topArticleId = $scope.articles[$scope.articles.length-1].id;
		$scope.pageNumber = pageNumber;
	    }
	    articleResultDetails = {"topArticleId" : $scope.topArticleId, "articles" : $scope.articles };
	    $scope.pageResultsMap["results" + $scope.pageNumber] = articleResultDetails;
        })

    };

    $scope.pageResultsMap = {};

    $scope.init();

    $scope.isArticleDivCollapsed = false;
    $scope.activeItem = "edit_articles";

    $scope.navClass = function(page) {
        return page === $scope.activeItem ? "active" : "";
    };
            
    $scope.activateItem = function(id) {
            
        $scope.activeItem = id;
    };
            
    $scope.setArticleDivCollapse = function(collapse) {
               
        $scope.isArticleDivCollapsed = collapse;
    }

    $scope.listMemberStartsWith = function(list, string) {
	listLength = list.length;
	for (i = 0; i < listLength; i++) {
	    listString = list[i];
	    if (listString == string || listString && listString.toLowerCase().indexOf(string.toLowerCase()) == 0) {
		return true;
	    }
	}
	return false;
    }

    $scope.search = function(article) {
	if (!$scope.searchTitle && !$scope.searchAuthorName && !$scope.searchCategory) {
	    return true;
	} 
	if ($scope.searchTitle  ) {
	    if (!article.title || article.title.toLowerCase().indexOf( $scope.searchTitle.toLowerCase()) !=0) {
		return false;
	    }
	}
	if ($scope.searchAuthorName) { 
	    if (!article.author.author_name || article.author.author_name.toLowerCase().indexOf($scope.searchAuthorName.toLowerCase()) !=0) {
		return false;
	    }
	}
	if ($scope.searchCategory && !$scope.listMemberStartsWith(article.categories, $scope.searchCategory)) {
	    return false;
	}
	return true;
    };
   
    $scope.previousPage = function() {
	if ($scope.pageNumber == 0) {
	    return;
	}
	previousPage = $scope.pageNumber - 1;
	if ("results" + nextPage in $scope.pageResultsMap) {
	    articles = $scope.pageResultsMap["results" + previousPage].articles;
	    if (articles.length == 0) {
		return;
	    }
	    $scope.pageNumber = previousPage;
	    $scope.articles = articles;
	} else {
	    $scope.getArticles(previousPage);	    
	}

	//alert("Hello World from old");
    }

    $scope.nextPage = function() {
	nextPage = $scope.pageNumber + 1;
	if ("results" + nextPage in $scope.pageResultsMap) {
	    articles = $scope.pageResultsMap["results" + nextPage].articles;
	    if (articles.length == 0) {
		return;
	    }
	    $scope.pageNumber = nextPage;
	    $scope.articles = articles;
	} else {
	    $scope.getArticles(nextPage);	    
	}
	//alert("Hello World from new");
    }

});

testApp.controller('userController', function($scope, $location, commonOJService) {

    $scope.sidebarArticleCapabilities = [];

    $scope.init = function() {
	console.log("userController.init()");
	arrayCallables = [initSidebarCapabilities];
	commonOJService.controllerInitOrRedirect(arrayCallables,$scope);

        if (commonOJService.userData == null) {
        	//$location.path("/accounts/login?login_redirect_url=/"); 
        } else {

	}

	commonOJService.activateHeaderNavLink("settings");
    }

    


    $scope.init();
    $scope.testBoundData = "hello";
    $scope.message = "Welcome to your User Settings";
    $scope.capabilities = getCapabilities();
    $scope.isArticleDivCollapsed = true;
    $scope.activeItem = "";


    function getCapabilities(){
	capabilities = [{"title" : "Create Article", "content" : "Create Article" }];
	return capabilities;
    }

    function getArticleCapabilities(){


    }

//    $scope.$on('$viewContentLoaded', function() {
//	if (commonOJService.userData == null) {
//	    $location.path("/route"); 
//	}
//    });

    $scope.navClass = function(page) {
        return page === $scope.activeItem ? "active" : "";
    };
            
    $scope.activateItem = function(id) {
            
        $scope.activeItem = id;
    };
            
    $scope.setArticleDivCollapse = function(collapse) {
               
        $scope.isArticleDivCollapsed = collapse;
    }

});

testApp.controller('userSettingsController', function($scope, $location, $http, commonOJService) {

    $scope.sidebarArticleCapabilities = [];

    $scope.successMessage = "";

    $scope.errorMessage = "";

    $scope.userData = null;

    var setSettingsOnUi = function(data)  {
	if ("code" in data && data.code == "unconfigured_default_settings") {
	    
	} else {
	    $scope.articlesOwnActionsSettingsHidden = data.privacy_hide_own_articles;
	    $scope.commentsOwnActionsSettingsHidden = data.privacy_hide_own_comments;
	    $scope.votesOwnActionsSettingsHidden = data.privacy_hide_own_votes;
	    if ($scope.articlesOwnActionsSettingsHidden  && $scope.commentsOwnActionsSettingsHidden
		&& $scope.votesOwnActionsSettingsHidden) {
		$scope.allOwnActionsSettingsHidden = true;
	    }
	 
	    $scope.commentsOthersActionsSettingsHidden = data.privacy_hide_others_comments;
	    $scope.repliesOthersActionsSettingsHidden = data.privacy_hide_others_replies;
	    $scope.votesOthersActionsSettingsHidden = data.privacy_hide_others_votes;
	    if ($scope.commentsOthersActionsSettingsHidden && $scope.repliesOthersActionsSettingsHidden
		&& $scope.votesOthersActionsSettingsHidden) {
		$scope.allOthersActionsSettingsHidden = true;
	    }
	}
	$scope.settingsLoadSuccessful = true;
    }

    setLoadSettingsError = function() {
	$scope.topErrorMessage = "Error loading settings";
	$scope.settingsLoadSuccessful = false;
    }
    var setUserData = function(userData) {
	if (commonOJService.isUserLoggedIn()) {
	    $scope.userData = commonOJService.userData;
	    $http.get('/api/1.0/authors/' + $scope.userData.id + '/settings')
		.success(setSettingsOnUi).error(setLoadSettingsError);
	}

    }

    $scope.init = function() {
	arrayCallables = [initSidebarCapabilities];
	commonOJService.registerListeners("userData", "userSettingsController" + $scope.$id, [setUserData], "yesWithData");
	//commonOJService.controllerInitOrRedirect(arrayCallables,$scope);

        //if (commonOJService.userData == null) {
        //	//$location.path("/accounts/login?login_redirect_url=/"); 
        //} else {
	//
	//}
    }

    
    $scope.ownActionsCollapsed = true;

    $scope.ownActionsCollapseSymbol = "+";

    $scope.othersActionsCollapsed = true;

    $scope.othersActionsCollapseSymbol = "+";

    $scope.handleOwnActionsCollapse = function() {
	$scope.ownActionsCollapsed=!$scope.ownActionsCollapsed;
	if ($scope.ownActionsCollapseSymbol == "+") {
	    $scope.ownActionsCollapseSymbol = "-";
	} else {
	    $scope.ownActionsCollapseSymbol = "+";
	}
    }

    $scope.handleOthersActionsCollapse = function() {
	$scope.othersActionsCollapsed=!$scope.othersActionsCollapsed;
	if ($scope.othersActionsCollapseSymbol == "+") {
	    $scope.othersActionsCollapseSymbol = "-";
	} else {
	    $scope.othersActionsCollapseSymbol = "+";
	}
    }

    $scope.handleAllOwnActionsSettingsChange = function() {
	//alert("allOwnActionsSettingsHidden: " + $scope.allOwnActionsSettingsHidden);
	if ($scope.allOwnActionsSettingsHidden !=true) {
	    $scope.articlesOwnActionsSettingsHidden = true;
	    $scope.commentsOwnActionsSettingsHidden = true;
	    $scope.votesOwnActionsSettingsHidden = true;
	} else {
	    $scope.articlesOwnActionsSettingsHidden = false;
	    $scope.commentsOwnActionsSettingsHidden = false;
	    $scope.votesOwnActionsSettingsHidden = false;
	}
    }

    $scope.handleAllOthersActionsSettingsChange = function() {
	if ($scope.allOthersActionsSettingsHidden !=true) {
	    $scope.commentsOthersActionsSettingsHidden = true;
	    $scope.repliesOthersActionsSettingsHidden = true;
	    $scope.votesOthersActionsSettingsHidden = true;
	} else {
	    $scope.commentsOthersActionsSettingsHidden = false;
	    $scope.repliesOthersActionsSettingsHidden = false;
	    $scope.votesOthersActionsSettingsHidden = false;
	}
    }

    $scope.ownActionsSettingsNames = ['articlesOwnActionsSettingsHidden', 'commentsOwnActionsSettingsHidden', 'votesOwnActionsSettingsHidden'];
    $scope.othersActionsSettingsNames = ['commentsOthersActionsSettingsHidden', 'repliesOthersActionsSettingsHidden', 'votesOthersActionsSettingsHidden'];

    $scope.handleOwnActionsSettingsChange = function(settingsName) {
	if ($scope[settingsName]) {
	    $scope.allOwnActionsSettingsHidden = false;
	} else {
	    var allOwnActionsSettingsHidden = true;
	    var numOwnActionsSettingsNames = $scope.ownActionsSettingsNames.length;
	    for (var i = 0; i < numOwnActionsSettingsNames; i++ ) {
		var availableSettingsName = $scope.ownActionsSettingsNames[i];
		var availableSettingsValue = true;
		if (availableSettingsName == settingsName) {
		    availableSettingsValue = !$scope[availableSettingsName];
		} else {
		    availableSettingsValue = $scope[availableSettingsName];
		}
		if (!availableSettingsValue) {
		    return;
		}
		
	    }

	    $scope.allOwnActionsSettingsHidden = true;
	}
    }

    $scope.handleOthersActionsSettingsChange = function(settingsName) {
	if ($scope[settingsName]) {
	    $scope.allOthersActionsSettingsHidden = false;
	} else {
	    var numOthersActionsSettingsNames = $scope.othersActionsSettingsNames.length;
	    for (var i = 0; i < numOthersActionsSettingsNames; i++ ) {
		var availableSettingsName = $scope.othersActionsSettingsNames[i];
		var availableSettingsValue = true;
		if (availableSettingsName == settingsName) {
		    availableSettingsValue = !$scope[availableSettingsName];
		} else {
		    availableSettingsValue = $scope[availableSettingsName];
		}
		if (!availableSettingsValue) {
		    return;
		}
		

	    }

	    $scope.allOthersActionsSettingsHidden = true;

	}
    }

    $scope.hideSuccess = function() {
	$scope.showSuccess = false;
    }

    $scope.hideError = function() {
	$scope.showError = false;
    }


    $scope.saveSettings = function() {
	var submitForm = {};
	submitForm.privacy_hide_own_articles = $scope.articlesOwnActionsSettingsHidden;
	submitForm.privacy_hide_own_comments = $scope.commentsOwnActionsSettingsHidden;
	submitForm.privacy_hide_own_votes = $scope.votesOwnActionsSettingsHidden;
	submitForm.privacy_hide_others_comments = $scope.commentsOthersActionsSettingsHidden;
	submitForm.privacy_hide_others_replies = $scope.repliesOthersActionsSettingsHidden;
	submitForm.privacy_hide_others_votes = $scope.votesOthersActionsSettingsHidden;
	$http.post('/api/1.0/authors/' + $scope.userData.id + '/settings', JSON.stringify(submitForm),
					    {headers: {"Content-Type": "application/json"}})
	    .success(function(data){setSettingsOnUi(data);$scope.successMessage = "Your account's settings have been updated successfully.";$scope.showSuccess = true;})
	    .error(function(data) {$scope.errorMessage = "Your account's settings could not be updated successfully.";$scope.showError=true;});
    }


    $scope.init();
    $scope.testBoundData = "hello";
    $scope.message = "Welcome to your User Settings";
    $scope.capabilities = getCapabilities();
    $scope.isArticleDivCollapsed = true;
    $scope.activeItem = "";

    function getCapabilities(){
	capabilities = [{"title" : "Create Article", "content" : "Create Article" }];
	return capabilities;
    }

    function getArticleCapabilities(){


    }

//    $scope.$on('$viewContentLoaded', function() {
//	if (commonOJService.userData == null) {
//	    $location.path("/route"); 
//	}
//    });

    $scope.navClass = function(page) {
        return page === $scope.activeItem ? "active" : "";
    };
            
    $scope.activateItem = function(id) {
            
        $scope.activeItem = id;
    };
            
    $scope.setArticleDivCollapse = function(collapse) {
               
        $scope.isArticleDivCollapsed = collapse;
    }

});

testApp.controller('defaultViewController', function($scope, $location, commonOJService) {
    
});

testApp.controller('messageViewController', function($scope, $location, commonOJService) {
    if (commonOJService.messageForControllers.messageViewErrorMessage) {
	$scope.showError = true;
	$scope.errorMessage = commonOJService.messageForControllers.messageViewErrorMessage;
	commonOJService.messageForControllers.messageViewErrorMessage = "";
    }


    $scope.hideError = function() {
	$scope.showError = false;
    };

    $scope.hideSuccess = function() {
	$scope.showSuccess = false;
    }
});

var ModalInstanceCtrl = function($scope, $modalInstance, $http, $cookies, commonOJService, fbService) {

    $scope.fbLogin = function(nextUrl, action, process) {
	fbService.login(nextUrl, action, process, [onSuccess]);
    }
    $scope.message="";
    $scope.errorMessage = "";
    $scope.loginFormData = {};
    $scope.signinCollapse = false;
    $scope.signinModalHeading = "OPINION JUNCTION - SIGN IN";
    $scope.signupCollapse = true;

    $scope.formFields = {"signinForm": [{"id":"id_login"},
				       {"id":"id_password"}]};

    $scope.modeMap = {"signin" : {"ajaxUrl" : '/accounts/login/', "errorMessage" : "errorMessageSignin", 
				  "fields": [{"id":"id_login"},{"id":"id_password"}]}, 
		      "signup" : {"ajaxUrl" : '/accounts/signup/', "errorMessage" : "errorMessageSignup",
				  "fields": [{"id":"id_login_signup"},{"id":"id_password_signup"},
					    {"id":"id_password_verify_signup"},]}};
  // process the form
    $scope.processForm = function(mode) {
	$http({
	    method: 'POST',
	    url: $scope.modeMap[mode].ajaxUrl,
	    data: $.param($scope.loginFormData) + '&csrfmiddlewaretoken=' + $cookies.csrftoken, // pass in data as strings
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		//'csrfmiddlewaretoken' : $cookies.csrftoken ,
		
	    } // set the headers so angular passing info as form data (not request payload)
	})
	    .success(function(data) {
		onSuccess(data);
	    }).error(function(data) {
		data = getJsonFromResult(data);
		if ("form_errors" in data) {
		    form_errors = data["form_errors"];
		    for( key in form_errors) {
			errorMessage = form_errors[key].length > 0? form_errors[key][0] : "Error while authenticating";
			$scope[$scope.modeMap[mode].errorMessage] = errorMessage;
			break;
		    }
		} else if ("message" in data) {
		    $scope[$scope.modeMap[mode].errorMessage] = data["message"];
		} else {
		    $scope[$scope.modeMap[mode].errorMessage] = "Error while authenticating";
		}
	    });
    };
    
    getJsonFromResult = function(data) {
	jsonData = data;

	if (!data) {
	    return {};
	}
	try {
	    if ((typeof data) === "string" || data instanceof String) {
		data = JSON.parse(data);
	    }
	} catch(exception) {
	    return {};
	}

	if ("form_errors" in data) {
	    return data;
	}

	if ("html" in data) {
	    jsonData = data.html;
	}
	
	try {
	    if ((typeof jsonData) === "string" || jsonData instanceof String) {
		resultJson = JSON.parse(jsonData);
	    } else {
		resultJson = jsonData;
	    }
	} catch (e) {
	    return data;
	}
	
	return resultJson;
    };

    onSuccess = function (data) {
	console.log(data);

	if (!data.success) {
            // if not successful, bind errors to error variables
	    $scope.errorMessage = data.form_errors;
	} else {
            // if successful, bind success message to message
	    $scope.message = data.html;
	}

	resultJson = getJsonFromResult(data);
	if (resultJson == null) {
	    resultJson = {};
	}

	try {	 		
	    //commonOJService.userData = resultJson;
	    isLoggedIn = resultJson.code!=null && (resultJson.code === "login_successful" || resultJson.code === "already_logged_in");
	    $modalInstance.close(isLoggedIn);
	} catch (exception) {
	    //log exception, probably becasue double sign in which we haven't handled properly   
	}
    }


    $scope.openSignup = function() {
	$scope.signinCollapse=true;
	$scope.signupCollapse=false;
	$scope.signinModalHeading = "OPINION JUNCTION - SIGN UP";
    }

    $scope.openSignin = function() {
	$scope.signinCollapse=false;
	$scope.signupCollapse=true;
	$scope.signinModalHeading = "OPINION JUNCTION - SIGN IN";
    }


    $scope.setAllFormFields = function(formName) {
	formFields = $scope.modeMap[formName].fields;
	numFields = formFields.length;
	for (i = 0; i < numFields; i++) {
	    fieldRef = $("#" + formFields[i].id);
	    setNestedProperty($scope, fieldRef.attr("ng-model"), fieldRef.val());
	}
	return true;
    };

    $scope.modalKeyUp = function(event) {
	setNestedProperty($scope, $(event.target).attr("ng-model"), $(event.target).val());
	//$scope[$(event.target).attr("ng-model")] = $(event.target).val();
	//alert($(event.target).val());
	//$scope.errorMessageSignin = JSON.stringify("hello");
    }
};


setNestedProperty = function(object, name, value) {
    frags = name.split(".");
    numFrags = frags.length;
    propParent = null;
    prop = object;
    for (var i = 0; i < numFrags; i++) {
	propParent = prop;
	prop = propParent[frags[i]];
	if (prop == null) {
	    prop = {};
	    propParent[frags[i]] = prop;
	}
    }
    propParent[frags[numFrags-1]] = value;
}


//JQuery signin modal functions - start
function setOffSetHeight() {
  $("#iframe")[0].style.height = $("#iframe")[0].contentWindow.document.body.offsetHeight + 'px';
}



function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}


function checkForLogin_iframe() {
   iframe_content = $("#iframe").contents().find('body');
   $("#iframe").css({ height: iframe_content.outerHeight( true ) });
    if (endsWith(removeParametersFromUrl($("#iframe")[0].contentWindow.location.href), facebook_popup_suffix)) {
     $(".modal").modal("hide");
     $(".modal").close();
   }

}

function removeParametersFromUrl(url) {
    if (url.indexOf("?") > -1) {
	return url.split("?")[0];
    } else {
        return url;
    }
}


function mainReady() {
  $("#iframe").load(function() {
    checkForLogin_iframe();
  });
  $(".modal").on("shown.bs.modal",function()
  {    
    setOffSetHeight();
      // add loader indicator
   
  });
  
}

//JQuery signin modal functions - end

//tinymce
// taken from http://embed.plnkr.co/fPubiQ/preview

/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
.value('uiTinymceConfig', {})
.directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
	require: 'ngModel',
	/*scope : {
	    enabled: "=",
	    options: "=",
	    articleContent: "=",
	    authorId: "="
	  
	},*/
	link: function(scope, elm, attrs, ngModel) {
	    var expression, options, tinyInstance;
    // generate an ID if not present
	    if (!attrs.id) {
		attrs.$set('id', 'uiTinymce' + generatedIds++);
	    }
	    options = {
        // Update model when calling setContent (such as from the source editor popup)
		setup: function(ed) {
		    ed.on('init', function(args) {
			ngModel.$render();
		    });
            // Update model on button click
		    ed.on('ExecCommand', function(e) {
			ed.save();
			ngModel.$setViewValue(elm.val());
			if (!scope.$$phase) {
			    scope.$apply();
			}
		    });
            // Update model on keypress
		    ed.on('KeyUp', function(e) {
			console.log(ed.isDirty());
			ed.save();
			ngModel.$setViewValue(elm.val());
			if (!scope.$$phase) {
			    scope.$apply();
			}
		    });
		},
		mode: 'exact',
		elements: attrs.id,
		height : "800px",
		plugins : "advlist autoresize autosave fullscreen image media paste preview searchreplace spellchecker visualblocks visualchars wordcount notwimageupload",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | notwimageupload | notwprimaryimage",
		paste_data_images: true, //http://stackoverflow.com/questions/21082723/tinymce-can-no-longer-drag-and-drop-images-after-upgrading-from-version-3-to-ver
		convert_urls: false, //http://www.tinymce.com/tryit/url_conversion.php
		extended_valid_elements: "@[primaryimage]", //http://stackoverflow.com/questions/5444677/wordpress-visual-editor-tinymce-how-to-preserve-custom-attributes
		valid_elements: "@[primaryimage]," + //Your attributes HERE!!!
		"a[name|href|target|title]," +
		    "#p,-ol,-ul,-li,br,img[src],-sub,-sup,-b,-i," +
		    "-span,hr"


	    };
	    if (attrs.uiTinymce) {
		expression = scope.$eval(attrs.uiTinymce);
	    } else {
		expression = {};
	    }
	    angular.extend(options, uiTinymceConfig, expression);
	    scope.$watch('contentChangedAngular', function() {
		if (scope.contentChangedAngular == true) {
		    scope.contentChangedAngular = false;
		    tinymce.activeEditor.setContent(scope.content);
		}
	    });
	    scope.$watch(attrs.uiTinymce, function(value) {
		if (value){
		    setTimeout(function() {
			//if (scope.enabled) {
			    tinymce.init(options);
			//}
		
		    });
		}
	    });



	    ngModel.$render = function() {
		if (!tinyInstance) {
		    tinyInstance = tinymce.get(attrs.id);
		}
		if (tinyInstance) {
		    tinyInstance.setContent(ngModel.$viewValue || '');
		}
	    };
	}
    };
}]); 
testApp.directive('autoFillSync', function($timeout) {
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
          var origVal = elem.val();
          $timeout(function () {
              var newVal = elem.val();
              if(ngModel.$pristine && origVal !== newVal) {
                  ngModel.$setViewValue(newVal);
              }
          }, 500);
      }
   }
});

testApp.directive('commentReplyMain', function($compile, commentsService) {
       return {
	   scope: {commentMetaData: "=commentMetaData" },
           templateUrl: '/angularstatic/comments/partials/comment-reply-main-directive.html',
	   compile: function(elem, attrs) {
               return function(scope,elem,attrs) {
		   scope.postReply = function(commentMetaData) {
		       commentsService.postReply(commentMetaData); 
		       console.log(scope);
		       //commentsService.postReply($("#comment-reply-creation-box").scope()); 
			   //odd why $("#comment-reply-creation-box").scope() != scope
		   }
	       }
	   }
       }
});

testApp.directive('commentReply', function($compile, $timeout, $http, $q, commonOJService, commentsService) {
       return {
	   scope: true,
           templateUrl: '/angularstatic/comments/partials/comment-reply-directive.html',
	   require: '^comment',
	   compile: function(elem, attrs) {
               return function(scope,elem,attrs, commentController) {
		   focusReply = function (comment) {
		       
		       $("#comment-reply-creation-box-" + comment.id).focus();
		   }

		   scope.createCommentObject = function(comment) {
		       replyComment = {};

		       replyComment.text = comment.replyText;
		       replyComment.metadata_string = comment.metadata_string;
		       replyComment.discussion_id = comment.discussion_id;
		       if (comment.id) {
			   replyComment.parent_id = comment.id;
		       }
		       replyComment.author = {};
		       //replyComment.author.id = "";
		       replyComment.author.id = commonOJService.userData.id;
		       replyComment.author.name = commonOJService.userData.first_name + commonOJService.userData.last_name;
		       
		       return replyComment;
		   };

		   scope.postReply = function(comment) {
		       commentsService.postReply(comment);
		   }

	       }
	   }
       }
});

testApp.directive('comment', function($compile, $timeout, $http, commonOJService, commentsService, profileService, dateService) {
       return {
	   scope: {comment: "="},
           templateUrl: '/angularstatic/comments/partials/comment-directive.html',
	   require: ['^comment','^commentsRoot'],
	   controller: function ($scope, $element, $attrs) {

	       //http://stackoverflow.com/questions/13743058/how-to-access-the-angular-scope-variable-in-browsers-console
	       //https://docs.angularjs.org/api/ng/function/angular.element
	       //https://docs.angularjs.org/api/ng/service/$compile
	       //https://docs.angularjs.org/guide/compiler

	   },

	   compile: function(elem, attrs) {
               return function(scope,elem,attrs, controllerArray) {

		   controller = controllerArray[0];
		   commentsRootController = controllerArray[1];

		   scope.showDownVoteTooltip = function(comment) {
		       $timeout(function() { 
			   comment.downvoteTooltip = "You don't have privileges to downvote comments";
		       },100);
		       $timeout(function() {
			   $("#downvote-container-" + comment.id).mouseenter();
		       }, 200);
		       $timeout(function() { 
			   comment.downvoteTooltip = "";
		       },10000);
		   }

		   handlePostVote = function(data, comment, voteclassname, vote) {
		       //We do this one by one for each property rather than re-assigning the reference to comment 
		       //because we would have changed a few other properties by now
		       if (data.length > 0) {
			   result = data[0];
			   comment.current_user_voted = result.current_user_voted;
			   comment.num_votes = result.num_votes;
			   //comment[voteclassname] = vote;
			   commentsService.setVoteClass(comment);
		       }
		       
		       comment.downvoteTooltip = ""; //This will need to be handled better 
		                                     //when donvote functionality is implemented 
                                                     //completedly
		       console.log(voteclassname + " " + vote);
		   };


		   scope.getFriendlyDateString = function(dateString) {
		       var date = new Date(dateString);
		       return dateService.getFriendlyDateString(date);
		   }

		   scope.handleUpvote = function(comment) {
		       if (comment.current_user_voted == "up") {
			   $http.post('/api/1.0/comments/' + comment.id + '/unvote', JSON.stringify({}),
					    {headers: {"Content-Type": "application/json"}})
			       .success(function(data) { handlePostVote(data, comment, "upvoteclass", "unvoted") });
		       } else {
			   $http.post('/api/1.0/comments/' + comment.id + '/upvote', JSON.stringify({}),
					    {headers: {"Content-Type": "application/json"}})
			       .success(function(data) { handlePostVote(data, comment, "upvoteclass", "voted") });
		       }
		      
		   }

		   scope.upvoteComment = function(comment) {
		       if (!commonOJService.isUserLoggedIn()) {
			   commentsRootController.openSigninModal([function() {scope.handleUpvote(comment);}]);
			   return;
		       } else {
			   scope.handleUpvote(comment);
		       }
		       
		   }
		   
		   scope.downvoteComment = function(comment) {
		       if (!commonOJService.isUserLoggedIn()) {
			   commentsRootController.openSigninModal([function() {scope.showDownVoteTooltip(comment);}]);
			   return;
		       } else {
			   scope.showDownVoteTooltip(comment);
		       }
		   }

		   focusReplyCreationContainer = function(comment) {
		       $("#comment-reply-creation-box-" + comment.id).focus();
		   };
		   

		   toggleRCCollapse = function(comment) {
		       comment.replyCreationContainerCollapsed = !comment.replyCreationContainerCollapsed;
		   };

		   toggleCollapse = function(comment) {
		       comment.replyContainerCollapsed = !comment.replyContainerCollapsed;

		       //if (comment.replyContainerCollapsed == undefined) {
		       //    comment.replyContainerCollapsed = false;
		       //} else {   
		       //    comment.replyContainerCollapsed = !comment.replyContainerCollapsed;
		       //}
		   };

		   toggleRCCollapseFocusReply = function(comment) {
		       toggleRCCollapse(comment);
		       if (!comment.replyCreationContainerCollapsed) {
			   $timeout(function() {focusReplyCreationContainer(comment);}, 100);
		       }
		   }		   

		   //toggleCollapseFocusReply = function(comment) {
		   //    toggleCollapse(comment);
		   //    if (!comment.replyContainerCollapsed) {
		   //	   $timeout(function() {focusReplyContainer(comment);}, 100);
		   //    }
		   //}		   

		   scope.toggleOrGetRepliesForParent = function(comment) {
		       if (!comment.gotChildren) {
			   
			   if (!("replyContainerCollapsed" in comment)) {
			       comment.replyContainerCollapsed = true;
			   }
			   commentsService.updateReplies(comment, function() {$timeout(function() {toggleCollapse(comment);}, 100);});
			   //comment.gotChildren = true;
		       } else {
			   $timeout(function() {toggleCollapse(comment);}, 100);
		       }
		       //$timeout(function() {toggleCollapse(comment);}, 100);
		   };


		   scope.loadToggleReplyContainer = function(comment) {
		       if (!commonOJService.isUserLoggedIn()) {
			   commentsRootController.openSigninModal([function() {scope.toggleReplyContainer(comment);}]);
			   return;
		       } else {
			   scope.toggleReplyContainer(comment);
		       }

		       

		   };

		   scope.toggleReplyContainer = function(comment) {
		       if (!comment.replyCreationContainerCreated) {
			   $compile('<div comment-reply></div>')(scope, function(cloned, $scope) {
			       commentReplyContainer = $('#comment-content-container-' + comment.id);
			       commentReplyContainer.append(cloned);
			       //comment.replyContainerCollapsed = true;
			       comment.replyCreationContainerCollapsed = true;
			       comment.replyCreationContainerCreated = true;
			   });
		       } 
		       
		       //comment.replyContainerCollapsed = !comment.replyContainerCollapsed;
		       //$timeout(function() {toggleCollapseFocusReply(comment);}, 100);

		       $timeout(function() {toggleRCCollapseFocusReply(comment);}, 100);
		   }

		   scope.getCommentImage = function(comment) {
		       if (comment.author!=null) {
			   return profileService.getProfileImageForCommentsAndDisplay(comment.author);
		       }
		       return profileService.getProfileImage(comment);
		       
		   }
	       }
	   }
       }
});

testApp.directive('commentsRoot', function($compile, $http, $modal, $timeout, commonOJService, commentsService) {
    return {
	scope: true,
	require: '^commentsRoot',
        templateUrl: '/angularstatic/comments/partials/comments-body-directive.html',
	controller: function($scope, $element, $attrs) {
	    
	    modalLoggedIn = function() {
		if ($scope.loginDiv !=null) {
		    $scope.loginDiv.remove();
		    $scope.loginDiv = null;
		    $scope.commentMetaData = commentsService.getCommentMetaDataForReplyMain($scope);
		    $compile('<div comment-meta-data="commentMetaData" comment-reply-main></div><div class="comment-login-comments-gap"></div>')($scope, function(cloned, $scope) {
			$element.prepend(cloned);
		    });
		}
		

            }
	    
	    this.modalLoggedIn = modalLoggedIn;
	    
	    this.openSigninModal = function(callablesArray) {

		    var modalInstance = $modal.open({
			templateUrl: 'loginModalContent.html',
			controller: ModalInstanceCtrl,
			resolve: {
			    items: function () {
				return $scope.items;
			    }
			}
		    });

		    modalInstance.result.then(function (isLoggedIn) {
    			if (isLoggedIn) {
                            //alert(isLoggedIn);
			    commonOJService.controllerInit(null, $scope, null, null);
                            modalLoggedIn();
			    if (callablesArray != null) {
				numCallables = callablesArray.length;
				for (i = 0; i < numCallables; i++) {
				    callablesArray[i]();
				}
			    }
			    
			}
		    });
	    };

	},

	compile: function(elem, attrs) {
            return function(scope,elem,attrs, commentsRootController) {

		commonOJService.registerListeners("userData", "commentsRootController-" + scope.$id, [function() { 
		    if (commonOJService.isUserLoggedIn()) { 
			commentsRootController.modalLoggedIn(); 
		    }
		}], "yesWithData");

		scope.$watch('replyContainerCollapsed', function() { console.log("replyContainerCollapsed = " + scope.replyContainerCollapsed) });
		scope.commentMetaData = commentsService.getCommentMetaDataForReplyMain(scope);
		scope.commentMetaData.replyContainerCollapsed = true;
		scope.$watch('article', function() {
		    if (scope.article!=null) { 
			var numCategories = scope.article.categories.length;
			scope.commentMetaData.metadata_string = "";
			for (var i = 0; i < numCategories; i++) {
			    scope.commentMetaData.metadata_string += "#category='" + scope.article.categories[i] + "'#"; 
			}
		    }
		});
		if (!scope.isUserLoggedIn()) {
		    $compile('<div comments-login></div><div class="comment-login-comments-gap"></div>')(scope, function(cloned, scope) {
			scope.loginDiv = cloned;
			elem.prepend(cloned);
		    });
		} else {
		    $compile('<div comment-reply-main comment-meta-data="commentMetaData"></div><div class="comment-login-comments-gap"></div>')(scope, function(cloned, $scope) {
			elem.prepend(cloned);
		    });
		    
		}

		$http.get('/api/1.0/posts/' + scope.articleId + '/comments/?top=true').success(function(data) {
		    scope.commentMetaData.commentChildren = data;
		    scope.commentChildren = data;
		    commentsService.treatComments(data);
		    if (data!=null && data.length > 0) {
			scope.commentMetaData.latest_child = data[data.length-1].id;
			$timeout(function() { scope.commentMetaData.replyContainerCollapsed=false; }, 100);
		    }
		    
//		    if (data.length > 0) {
//			
//		    }
		    scope.commentMetaData.gotChildren = true;
		    //commentsService.addCommentsToMap('1', data);
		});

		$compile('<div ng-repeat="commentChild in commentChildren" comment="commentChild" ng-class="{firstcomment:$first}"></div>')(scope, function(cloned, scope) {
		    $("#comments-container").append(cloned);
		});

            }
	}
    }

});


testApp.directive('commentsLogin', function() {
   return {
       scope: {},
       templateUrl: '/angularstatic/comments/partials/comments-login-directive.html',
       require:"^commentsRoot", 
       compile: function(elem, attrs) {

           return function(scope,elem,attrs, commentsRootController) {
		scope.openSigninModal = function() {
		    commentsRootController.openSigninModal();
		}
		
	    }
	}
   }
});

testApp.directive('ojCarousel', function(commonOJService) {
    return {
	require: "carousel",
	compile: function(elem, attrs) {

            return function(scope,elem,attrs, carouselCtrl) {
		scope.carousel = carouselCtrl;
		scope.$watch('carousel.currentSlide', function() {
		    console.log("CarouselSlide Changed!");
		    console.log(scope.carousel.indexOfSlide(scope.carousel.currentSlide));
		    var slideIndex = scope.carousel.indexOfSlide(scope.carousel.currentSlide);
		    var articleCategoryName = scope.articles[slideIndex].headerCategory.name;
		    var categoryIndex = scope.getCategoryIndex(articleCategoryName);
		    commonOJService.focusCategoryLink(categoryIndex);
		});
		elem.on('slide.bs.carousel', function () {
		    alert("Hello From Carousel");
		});

		scope.$on("$destroy", function(scope) {
		    commonOJService.blurCategoryLink();
		});
	    }
	}
    }
});
