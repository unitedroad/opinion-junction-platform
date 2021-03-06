var testApp = angular.module('testApp', ['ngAnimate', 'ui.router', 'ui.bootstrap', 'ngCookies', 'ui.config', 'ui.tinymce', 'ui.directives', 'ui.include', 'ngSanitize', 'ngTouch',
					'angulartics','angulartics.piwik']);

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
	    title: "Opinion Junction",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('politics', {
	    title: "Opinion Junction - Politics",
	    url: "/{category:politics}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('technology', {
	    title: "Opinion Junction - Technology",
	    url: "/{category:technology}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
    	.state('hoist', {
	    title: "Opinion Junction - Hoist",
	    url: "/{category:hoist}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('art', {
	    title: "Opinion Junction - Art",
	    url: "/{category:art}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})
	.state('identities', {
	    title: "Opinion Junction - Identities",
	    url: "/{category:identities}",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainPageController'
	})

	.state('article', {
	    title: "Opinion Junction - Article",
	    url : "/article/:articleId",
	    templateUrl: '/angularstatic/article/partials/article.html',
	    controller: 'articleController'
	})
    	.state('article.text', {
	    title: "Opinion Junction - Article",
	    url : "/:text",
	    templateUrl: '/angularstatic/article/partials/article.html',
	    controller: 'articleController'
	})
	.state('signin', {
	    title: "Opinion Junction - Sign in",
	    url : "/signin",
	    templateUrl: '/angularstatic/signin/partials/index.html',
	    controller: 'signinController'
	})
        .state('aboutus', {
	    title: "Opinion Junction - About Us",
	    url : "/aboutus",
	    templateUrl: '/angularstatic/aboutus/partials/index.html',
	    controller: 'aboutusController'
	})
        .state('profile', {
	    title: "Opinion Junction - Profile",
	    url : "/profile",
	    templateUrl: '/angularstatic/publicprofile/partials/index.html',
	    controller: 'publicProfileController'
	})
        .state('profileuserid', {
	    title: "Opinion Junction - Profile",
	    url : "/profile/:userid",
	    templateUrl: '/angularstatic/publicprofile/partials/index.html',
	    controller: 'publicProfileController'
	})
    	.state('user', {
	    url : "/user",
	    templateUrl: '/angularstatic/usersidebar/partials/index.html',
	    controller: 'userController'
	})
    	.state('user.settings', {
	    title: "Opinion Junction - Settings",
	    url : "/settings",
	    templateUrl: '/angularstatic/usersettings/partials/index.html',
	    controller: 'userSettingsController'
	})
    	.state('user.profile', {
	    title: "Opinion Junction - Settings - Profile",
	    url: "/profile",
	    templateUrl: '/angularstatic/profile/partials/index.html',
	    controller: 'userProfileController'
	})
	.state('user.createarticle', {
	    title: "Opinion Junction - Create Article",
	    url: "/createarticle",
	    templateUrl: '/angularstatic/createarticle/partials/index.html',
	    controller: 'createArticleController'
	})
	.state('user.setaboutus', {
	    title: "Opinion Junction - Set About us",
	    url: "/setaboutus",
	    templateUrl: '/angularstatic/setaboutus/partials/index.html',
	    controller: 'setAboutusController'
	})
	.state('user.setcontactus', {
	    title: "Opinion Junction - Set Contact us",
	    url: "/setcontactus",
	    templateUrl: '/angularstatic/setcontactus/partials/index.html',
	    controller: 'setContactusController'
	})
	.state('user.setourteam', {
	    title: "Opinion Junction - Set Our Team",
	    url: "/setourteam",
	    templateUrl: '/angularstatic/setourteam/partials/index.html',
	    controller: 'setOurTeamController'
	})
	.state('createarticlepfrontpagereview', {
	    title: "Opinion Junction - Preview Article",
	    url: "/user/createarticle/frontpagepreview",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'createArticleFrontPagePreviewController'
	}).state('createarticlepreview', {
	    title: "Opinion Junction - Preview Article",
	    url: "/user/createarticle/preview",
	    templateUrl: '/angularstatic/articlepreview/partials/articlepreview.html',
	    controller: 'createArticlePreviewController'
	}).state('user.articles', {
	    title: "Opinion Junction - Articles",
	    url: "/articles",
	    templateUrl: '/angularstatic/articleslist/partials/index.html',
	    controller: 'viewArticlesController'
	}).state('editarticlepfrontpagereview', {
	    title: "Opinion Junction - Preview Article",
	    url: "/user/editarticle/frontpagepreview",
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'createArticleFrontPagePreviewController'
	}).state('editarticlepreview', {
	    title: "Opinion Junction - Preview Article",
	    url: "/user/editarticle/preview",
	    templateUrl: '/angularstatic/articlepreview/partials/articlepreview.html',
	    controller: 'createArticlePreviewController'
	}).state('user.editarticle', {
	    title: "Opinion Junction - Edit Article",
	    url: "/editarticle/:articleId",
	    templateUrl: '/angularstatic/createarticle/partials/index.html',
	    controller: 'createArticleController'
	}).state('editarticlemetadata', {
	    title: "Opinion Junction - Edit Article Metadata",
	    url: "/editarticlemetadata/:articleId",
	    templateUrl: '/angularstatic/editarticlemetadata/partials/index.html',
	    controller: 'editArticleMetadataController'
	}).state('articlesByTag', {
	    title: "Opinion Junction",
	    url: "/tag/:tagName",
	    templateUrl: '/angularstatic/articlesbytag/partials/index.html',
	    controller: 'articlesByTagController'
	}).state('search', {
	    title: "Opinion Junction",
	    url: "/search?searchString",
	    templateUrl: '/angularstatic/search/partials/index.html',
	    controller: 'searchController'
	}).state('user.authorroles', {
	    title: "Opinion Junction",
	    url: "/authorroles",
	    templateUrl: '/angularstatic/authorroles/partials/index.html',
	    controller: 'assignAuthorRolesController'
	}).state('user.createroles', {
	    title: "Opinion Junction",
	    url: "/createroles",
	    templateUrl: '/angularstatic/createroles/partials/index.html',
	    controller: 'createAuthorRolesController',
	    css: '/angularstatic/external/angular-crop/css/image-crop-styles.css'
	}).state('default', {
	    title: "Opinion Junction",
	    url: "/default",
	    templateUrl: '/angularstatic/default/partials/index.html',
	    controller: 'createArticleController'
	}).state('message', {
	    title: "Opinion Junction - Message",
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

function addCapabilitiesForPermission(commonOJService, capabilities, linksForPermission) {
    if (linksForPermission!=null && commonOJService.isArray(linksForPermission)) {
	var num_links = linksForPermission.length;
	for (var j=0; j < num_links; j++) {
	    capabilities.push(linksForPermission[j]);
	}
    }
}

function initSidebarCapabilities(commonOJService, scope) {

    if (!scope.sidebarCapabilitiesSet) {
	permissions = commonOJService.userData.user_permissions;
	var sidebarArticlePermissionkeys = commonOJService.getKeys(commonOJService.sidebarArticlePermissions);
        var sidebarOtherMainPermissionkeys = commonOJService.getKeys(commonOJService.sidebarOtherMainPermissions);
        var sidebarAboutusPermissionkeys = commonOJService.getKeys(commonOJService.sidebarAboutusPermissions);
	var sidebarRolesPermissionkeys = commonOJService.getKeys(commonOJService.sidebarRolesPermissions);

	if (permissions!=null && commonOJService.isArray(permissions)) {
	    var numPermissions = permissions.length;
	    for (var i=0; i < numPermissions; i++) {
		var permission = permissions[i];
		if (commonOJService.indexOf(sidebarArticlePermissionkeys, permission) > -1){
		    if (permission != null) {
			var linksForPermission = commonOJService.sidebarArticlePermissions[permission];
			addCapabilitiesForPermission(commonOJService, scope.sidebarArticleCapabilities, linksForPermission);
		//	if (linksForPermission!=null && commonOJService.isArray(linksForPermission)) {
		//	    var num_links = linksForPermission.length;
		//	    for (var j=0; j < num_links; j++) {
		//		scope.sidebarArticleCapabilities.push(linksForPermission[j]);
		//	    }
		//	}

		    }

		}
		if (commonOJService.indexOf(sidebarOtherMainPermissionkeys, permission) > -1) {
		    scope.sidebarOtherMainCapabilities.push(commonOJService.sidebarOtherMainPermissions[permission]);
		}

		if (commonOJService.indexOf(sidebarAboutusPermissionkeys, permission) > -1) {
		    if (permission != null) {
			var linksForPermission = commonOJService.sidebarAboutusPermissions[permission];
			addCapabilitiesForPermission(commonOJService, scope.sidebarAboutusCapabilities, linksForPermission);
		    }
		}

		if (commonOJService.indexOf(sidebarRolesPermissionkeys, permission) > -1) {
		    if (permission != null) {
			var linksForPermission = commonOJService.sidebarRolesPermissions[permission];
			addCapabilitiesForPermission(commonOJService, scope.sidebarRolesCapabilities, linksForPermission);
		    }
		}

	    }
	    if (scope.sidebarArticleCapabilities.length > 0) {
		scope.articleCapabilitiesAvailable = true;
	    } else {
		scope.articleCapabilitiesAvailable = false;
	    }
	    if (scope.sidebarAboutusCapabilities.length > 0) {
		scope.aboutusCapabilitiesAvailable = true;
	    } else {
		scope.aboutusCapabilitiesAvailable = false;
	    }
	    if (scope.sidebarRolesCapabilities.length > 0) {
		scope.rolesCapabilitiesAvailable = true;
	    } else {
		scope.rolesCapabilitiesAvailable = false;
	    }
	} else {
	    scope.aboutusCapabilitiesAvailable = false;
	}
	scope.sidebarCapabilitiesSet = true;
	//var sidebarOtherMainPermissionkeys = commonOJService.getKeys(commonOJService.sidebarOtherMainPermissions);
        //scope.sidebarOtherMainCapabilities = [];
    }


}

testApp.factory('fieldPropertiesService', function() {
    var serviceInstance = {};
    serviceInstance.fieldProperties = {};
    serviceInstance.getProperty = function (propertyName) {
	return serviceInstance.fieldProperties[propertyName];
    }

    serviceInstance.setProperty = function (propertyName, property) {
	serviceInstance.fieldProperties[propertyName] = property;
    }

    return serviceInstance;

});

testApp.factory('commonOJService', function($http, $location) {
    var serviceInstance = {};

    id = 0;

    serviceInstance.id = id++;

    serviceInstance.userData = null;


    serviceInstance.convertYoutubeIframeToHtml5 = function(articleContent) {
	var wrapper= document.createElement('div');
	wrapper.innerHTML= articleContent;
	var iframes = $(wrapper).find('iframe');
	iframes.each(function() {
	    var thisJq = $(this);
	    var src = thisJq.attr('src');
	    if (src.indexOf('youtube.com/v') > -1 && src.indexOf('html5=1') <=-1) {
		src = src.replace(/youtube\.com\/v/g, 'youtube.com/embed');
		if (src.indexOf('?') > -1 ) {
		    $(this).attr('src', src + '&html5=1') ;
		} else {
		    $(this).attr('src', src + '?html5=1') ;
		}
		var style = $(this).attr('style');
		$(this).attr('style', style + ';max-width:100%') ;
	    }
	});
	return wrapper.innerHTML;
	
    }

    serviceInstance.sidebarArticlePermissions = 
	{"create_articles" : [{"id" : "create_articles", "title" : "Create Article", "content" : "Create Article", "url" : "/user/createarticle" }]
	 ,"edit_articles" : [{"id" : "edit_articles", "title" : "View Articles", "content" : "View Articles", "url" : "/user/articles"}]};

    serviceInstance.sidebarOtherMainPermissions = 
	{"set_aboutus" : {"id" : "set_ourteam", "title" : "Change Our Team", "content" : "Change Our Team", "url" : "/user/setourteam" }};

    serviceInstance.sidebarOtherMainPermissions = {};

    serviceInstance.sidebarAboutusPermissions = 
	{"set_aboutus" : [{"id" : "set_aboutus", "title" : "Change About Us", "content" : "Change About Us", "url" : "/user/setaboutus" },
			  {"id" : "set_contactus", "title" : "Change Contact Us", "content" : "Change Contact Us", "url" : "/user/setcontactus" },
			 {"id" : "set_ourteam", "title" : "Change Our Team", "content" : "Change Our Team", "url" : "/user/setourteam" }]};

    serviceInstance.sidebarRolesPermissions = { "assign_permissions" : [{"id" : "assign_permissions", "title" : "Assign Roles", "content" : "Assign Roles", "url" : "/user/authorroles" }],
						"create_roles" : [{"id" : "create_roles", "title" : "Create Roles", "content" : "Create Roles", "url" : "/user/createroles" }]};

    serviceInstance.isUserLoggedIn = function() {
	return serviceInstance.userData && (serviceInstance.userData.id || (serviceInstance.userData.code === "user_not_setup_for_oj"));
    }

    serviceInstance.isSupportedImageType = function(file_name) {

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

    var compareObjects = function(object1, object2) {
	var same = true;
	for (var key in object1) {
	    if (object1.hasOwnProperty(key) && object2.hasOwnProperty(key)) {
		var field1 = object1[key];
		var field2 = object2[key];
		if (serviceInstance.isArray(field1) && serviceInstance.isArray(field2)) {
		    if (!serviceInstance.compareArrays(field1, field2)) {
			same = false;
			break;
		    };
		    continue;
		}
		if (object1[key] !== object2[key]) {
		    same = false;
		    break;
		}
	    }
	}
	return same;
    }

    serviceInstance.compareArrays = function(array1, array2) {
	var numElements = array1.length;
	if (numElements != array2.length) {
	    return false;
	}

	for (var i = 0; i < numElements; i++) {
	    if (!compareObjects(array1[i], array2[i])) {
		return false;
	    }
	}
	
	return true;
	
    };
    
    serviceInstance.compareObjects = compareObjects;

  
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

    serviceInstance.indexOfByMemberField = function(array, needle, field) {
    	var i = -1, index = -1;
    
    	for(i = 0; i < array.length; i++) {
                if(array[i][field] === needle) {
    		index = i;
    		break;
                }
    	}
    
    	return index;
    };
    
    
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
		    for (i = 0; i < numListeners; i++) { try { listeners[i](data)} catch (exception) { console.log("exception while invoking listener " + listeners[i] + " exception: " + exception);} };
		}
		
	    }

	} else {
	    console.log("listeners: " + listeners);
	}
	
    }

    serviceInstance.createCategoriesMap = function(categories) {
	var categoriesMap = {};
	if (categories == null) {
	    return; // not the end of the world
	}
	var numCategories = categories.length;
	for (i = 0; i < numCategories; i++) {
	    category = categories[i];
	    categoriesMap[category.name] = category;
	}
	return categoriesMap;
    }

    serviceInstance.get_category_friendly_name_string = function(scope, article){
	if (article.category_friendly_names) {
	    return article.category_friendly_names;
	}
	articleCategories = article.categories;
	numArticleCategories = articleCategories.length;

	if (scope.categories == null) {

	    return;
	}
	if (!scope.categoriesMapCreated) {
	    scope.categoriesMap = serviceInstance.createCategoriesMap(scope.categories);
	    scope.categoriesMapCreated = true;
	}
	
	var category_friendly_names = "";
	if (numArticleCategories > 0) {
	    category_friendly_names = scope.categoriesMap[articleCategories[0]].friendly_name;
	}
	
	for (i = 1; i < numArticleCategories; i++) {
	    category_friendly_names = category_friendly_names + ", " + scope.categoriesMap[articleCategories[i]].friendly_name;
	    //if (category.localCompare
	}

	article.category_friendly_names = category_friendly_names;

	return category_friendly_names;

    }
    
    serviceInstance.convertWhiteSpaceToHtml = function(text) {
	if (!text) {
	    return '';
	} 
	text = text.replace(/\t/g, '    ')
           .replace(/  /g, '&nbsp; ')
           .replace(/  /g, ' &nbsp;') // second pass
                                      // handles odd number of spaces, where we 
                                      // end up with "&nbsp;" + " " + " "
           .replace(/\r\n|\n|\r/g, '<br />');
	return text;
    };

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

    serviceInstance.invalidateUserData = function() {
	serviceInstance.userData = null;
	invokeListeners("userData");
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

    serviceInstance.getFriendlyDateStringAbsolute = function(date) {
	dateDate = new Date(date);
	return date.toLocaleDateString();
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

testApp.factory('authorCacheService', function($http) {
    
    var serviceInstance = {};

    var getArrayRegexMatches = function(regex, array, key_type) {
	var re = new RegExp(regex);
	if (array != null && array.length > 0) {
	    var results = [];
	    var numArrayMembers = array.length;
	    for (var i = 0; i < numArrayMembers; i++) {
		var member = array[i];
		if (member && key_type) {
		    member = member[key_type];
		}
		if (re.test(member)) {
		    results.push(array[i]);
		}
	    }
	    return results;
	}
	return null;
    }

    serviceInstance.initCache = function(searchAuthorResultsMapByNumKeyChars, scope, callablesArray)  {
	$http.get("/api/1.0/authors", {"Content-Type": "application/json"}).success(function(data) {
	    scope.allAuthors = data;
	    scope.displayedAuthorResults = data;
	    var searchAuthorResultsMap = {};
	    searchAuthorResultsMapByNumKeyChars[0] = searchAuthorResultsMap;
	    searchAuthorResultsMap[""] = data;
	    if (callablesArray != null) {
		var numCallables = callablesArray.length;
		for (var i = 0; i < numCallables; i++) {
		    callablesArray[i]();
		} 
	    }
	});
    }

    serviceInstance.getResultsForKeyFromRest = function(key, searchAuthorResultsMapByNumKeyChars, scope) {
	$http.get("/api/1.0/authors" + "?author_name=" + key + "&use_contains=true", 
		  {headers: {"Content-Type": "application/json"}}).success(function(data) {
		      scope.displayedAuthorResults = data;
		      var keyLength = key.length;
		      var searchAuthorResultsMap = null;
		      if (keyLength in searchAuthorResultsMapByNumKeyChars) {
			  searchAuthorResultsMap = searchAuthorResultsMapByNumKeyChars[keyLength];
		      } else {
			  searchAuthorResultsMap = {};
			  searchAuthorResultsMapByNumKeyChars[keyLength] = searchAuthorResultsMap;
		      }
		      searchAuthorResultsMap[key] = data;
	});
    }


    serviceInstance.getResultsForKeyFromCache = function(key, searchAuthorResultsMapByNumKeyChars, key_type) {
	if (!key || key == null || key.length <=0 ) {
	    //$scope.displayedAuthorResults = $scope.allAuthors;
	    return searchAuthorResultsMapByNumKeyChars[0];
	} else {
	    var numChars = key.length;
	    if (numChars in searchAuthorResultsMapByNumKeyChars) {
		var searchAuthorResultsMap = searchAuthorResultsMapByNumKeyChars[numChars];
		if (key in searchAuthorResultsMap) {
		    return searchAuthorResultsMap[key];
		}
	    }
	    for (var i = (numChars - 1); i >= 0; i--) {
		var parentKey = key.substring(0,i);
		if (i in searchAuthorResultsMapByNumKeyChars) {
		    var searchAuthorResultsMap = searchAuthorResultsMapByNumKeyChars[i];
		    if (parentKey in searchAuthorResultsMap) {
			result =  getArrayRegexMatches(".*" + key + ".*", searchAuthorResultsMap[parentKey], key_type);
			var searchAuthorResultsMapForKey = null;
			if (numChars in searchAuthorResultsMapByNumKeyChars) {
			    searchAuthorResultsMapForKey = searchAuthorResultsMapByNumKeyChars[numChars];
			} else {
			    searchAuthorResultsMapForKey = {};
			    searchAuthorResultsMapByNumKeyChars[numChars] = searchAuthorResultsMapForKey;
			}
			searchAuthorResultsMapForKey[key] = result;
			return result;
		    }   
		}
	    }
	    
	}

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

	    if ((!FB)) {
		return;
	    }
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
    //if(!FB) throw new Error('Facebook not loaded');

    if(!FB) console.log('Facebook not loaded');
    
    serviceInstance.isFBAvailable = function() {
	return !(!FB);
    }
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
	    return "/static/Blank_user.svg";
	}
	return author.image;
    }

    serviceInstance.getProfileImageForCommentsAndDisplay = function(author, size) {
	if (!author.image ) {
	    return "/static/Blank_user.svg";
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

testApp.controller('articlesByTagController', function($scope, commonOJService, $http, $stateParams) {

    $scope.tagName = $stateParams.tagName;

    $("title").text("Opinion Junction - Tag - " + $scope.tagName);	    

    var createCategoriesMap = function(categories) {
	var categoriesMap = {};
	if (categories == null) {
	    return; // not the end of the world
	}
	var numCategories = categories.length;
	for (i = 0; i < numCategories; i++) {
	    category = categories[i];
	    categoriesMap[category.name] = category;
	}
	return categoriesMap;
    }

    var setCategories = function() {
	$scope.categories = commonOJService.categories;
    }

    commonOJService.registerCategoryListener(setCategories);	

    var get_category_non_friendly_name_string_for_tag_article = function(article) {
	if (!(categories in article) || !article.categories) {
	    return "";
	}
	return article.categories.split("%,#@$").join(", ");
    }

    var get_category_friendly_name_string_for_tag_article = function(article) {
	if (!article.categories) {
	    return "";
	}
	var category_return = ""
	var categories = article.categories.split("%,#@$");
	var startUsingCommas = false;
	if (categories.length > 0) {
	    var category = categories[0];
	    if (category) {
		var categoryObject = $scope.categoriesMap[category]
		if (categoryObject.friendly_name) {
		    category_return = $scope.categoriesMap[category].friendly_name;
		    startUsingCommas = true;
		}
		
		
	    }

	}
	for (var i = 1; i < categories.length; i++) {
	    var category = categories[i];
	    if (category) {
		var categoryObject = $scope.categoriesMap[category]
		if (categoryObject.friendly_name) {
		    if (startUsingCommas) {
			category_return = category_return + ", " + $scope.categoriesMap[category].friendly_name;
		    } else {
			category_return = $scope.categoriesMap[category].friendly_name;
			startUsingCommas = true;
		    }
		    
		}
		
		
	    }
	    
	}
	
	return category_return;
    }


    $http.get("/api/1.0/tags/" + $scope.tagName, {headers: {"Content-Type": "application/json"}}).
	success(function(data){
	    $scope.data = data;
	    $scope.articleInfos = data.users;
	    if (!$scope.categoriesMapCreated) {
		var categoriesMap = createCategoriesMap($scope.categories);
		if (categoriesMap != null) {
		    $scope.categoriesMap = categoriesMap;
		    $scopecategoriesMap = true;
		    for (var i = 0; i < $scope.articleInfos.length; i++) {
			var article = $scope.articleInfos[i];
			article.friendly_categories = get_category_friendly_name_string_for_tag_article(article);
		    }
		} else {
		    for (var i = 0; i < $scope.articleInfos.length; i++) {
			var article = $scope.articleInfos[i];
			article.friendly_categories = get_category_non_friendly_name_string_for_tag_article(article);
		    }
		    
		}
	    }
	});

    


});

testApp.controller('searchController', function($scope, $http, $stateParams, $location, profileService, commonOJService) {
    $scope.searchString = decodeURIComponent($stateParams.searchString);
    $scope.searchStringEncoded = $stateParams.searchString;
    
    var createCategoriesMap = function(categories) {
	var categoriesMap = {};
	if (categories == null) {
	    return; // not the end of the world
	}
	var numCategories = categories.length;
	for (i = 0; i < numCategories; i++) {
	    category = categories[i];
	    categoriesMap[category.name] = category;
	}
	return categoriesMap;
    }

    var setCategories = function() {
	$scope.categories = commonOJService.categories;
    }

    commonOJService.registerCategoryListener(setCategories);	

    var searchResults = function(searchStringEncoded, searchString) {
	if (!searchStringEncoded) {
	    searchStringEncoded = $scope.searchStringEncoded;
	}
	$http.get("/api/1.0/search/?searchString=" + searchStringEncoded, {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		$scope.articleInfos = data;
		if (!$scope.categoriesMapCreated) {
		    var categoriesMap = commonOJService.createCategoriesMap($scope.categories);
		}
		var numArticles = $scope.articleInfos.length;
		if (categoriesMap != null) {
		    for (var i = 0; i < numArticles; i++) {
			var article = $scope.articleInfos[i];
			article.friendly_categories = commonOJService.get_category_friendly_name_string($scope, article);
			article.author_name = profileService.getAuthorName(article.author);
		    }
		} else {
		    for (var i = 0; i < numArticles; i++) {
			var article = $scope.articleInfos[i];
			article.friendly_categories = article.categories.join(", ");
			article.author_name = profileService.getAuthorName(article.author);
		    }
		}

		if (searchString) {
		    $scope.searchString = searchString;
		}
	    });

    };

    $scope.search = function() {
	//var searchStringEncoded = encodeURIComponent($scope.searchStringNew);
	$location.url("/search?searchString=" + encodeURIComponent($scope.searchStringNew));

	//searchResults(searchStringEncoded, $scope.searchStringNew);
    };

    searchResults();
});


testApp.controller('createAuthorRolesController', function($scope, $http, $timeout, commonOJService) {
    $("title").text("Opinion Junction - Create Roles");
    $scope.permissionSuggestions = [];
    $scope.permissionSuggestionsMap = {};
    $scope.allowEditing = false;
    $scope.roles = [];

    $scope.existingRoles = [];

    $scope.existingRolesMap = {};

    $scope.newRoles = [];

    $scope.modifiedRoles = [];

    $scope.newRolesToggleLinkText = "+";
    $scope.newRolesCollapse = true;


    /*
    var resetNewRoles = function() {

	$scope.highestNewRoleIndex = 0;
	
	$scope.newRoleIndexMap = {};

    }


    var updateIndexAndNewRole = function(newRole) {
	
	$scope.newRoleIndexMap[$scope.highestNewRoleIndex] = newRole;

	newRole.viewIndex = $scope.highestNewRoleIndex;

	$scope.highestNewRoleIndex = $scope.highestNewRoleIndex + 1;
	
    }

    */

    //$scope.modifiedRolesMap = {};

    var getCruftLessRole = function(role) {
	var newRole = {};

	newRole.role_name = role.role_name;
	newRole.permissions = role.permissions;
	return newRole;
    }

    var resetRoles = function(result) {
	var updatedRoles = result.updated_roles;
	if (updatedRoles != null) {
	    var numUpdatedRoles = updatedRoles.length;
	    for (var i = 0; i < numUpdatedRoles; i++) {
		var role = getCruftLessRole(updatedRoles[i]);
		$scope.existingRolesMap[role.role_name] = role;
	    }
	}
	
	var createdRoles = result.created_roles;
	if (createdRoles != null) {
	    var numcreatedRoles = createdRoles.length;
	    for (var i = 0; i < numcreatedRoles; i++) {
		var role = getCruftLessRole(createdRoles[i]);
		$scope.existingRolesMap[role.role_name] = role;
	    }
	}

	$scope.existingRolesCollapse = true;

	$scope.existingRoles = [];
	$scope.newRoles = [];

	for (var role_name in $scope.existingRolesMap) {
	    if ($scope.existingRolesMap.hasOwnProperty(role_name)) {
		var role = JSON.parse(JSON.stringify($scope.existingRolesMap[role_name]));
		role.roleToggleLinkText = "+";
		role.divCollapsed = true;		
		$scope.existingRoles.push(role);
	    }
	}

	$timeout(function() { 
	    $scope.existingRolesCollapse = false;
	}, 500);

    }

    $scope.newRoleIndex = -1;

    $scope.existingRolesCollapse = true;
    $scope.existingRolesToggleLinkText = "-";
    $http.get('/api/1.0/roles', {headers: {"Content-Type": "application/json"}}).success(function(data) {
	$scope.roles = data;
	$scope.existingRoles = $scope.roles.slice();

	for (var i = 0; i < $scope.existingRoles.length; i++) {
	    var role = $scope.existingRoles[i];
	    $scope.existingRolesMap[role.role_name] = JSON.parse(JSON.stringify(role));
	    role.roleToggleLinkText = "+";
	    role.divCollapsed = true;
	}
	if ($scope.roles.length > 0) {
	    $scope.existingRolesCollapse = false;
	}

	addPermissionSuggestionsFromExistingRoles($scope.existingRoles);
	$scope.allowEditing = true;
    });

    $scope.checkRoleChanged = function($event, role) {
	if (!commonOJService.compareObjects($scope.existingRolesMap[role.role_name], role)) {
	    role.hasChanged = true;
	    role.changedText = "(Changed)";
	} else {
	    role.hasChanged = false;
	    role.changedText = "";

	};
    }

    $scope.toggleRoleDetails = function(role) {
	if (role.divCollapsed) {
	    role.divCollapsed = false;
	    role.roleToggleLinkText = "-";
	} else {
	    role.divCollapsed = true;
	    role.roleToggleLinkText = "+";
	}
    }

    $scope.toggleExistingRoles = function() {
	if ($scope.existingRolesCollapse == false) {
	    $scope.existingRolesCollapse = true;
	    $scope.existingRolesToggleLinkText = "+";
	} else {
	    $scope.existingRolesCollapse = false;
	    $scope.existingRolesToggleLinkText = "-";
	}
    }

    $scope.validateRoleName = function($event, role) {
	if (!role.role_name) {
	    role.roleNameErrorMessage = "Enter Role Name";
	    role.roleNameError = true;
	    return;
	} else if (role.role_name.indexOf("\\") > -1) {
	    role.roleNameErrorMessage = "Role Name cannot contain '\\'";
	    role.roleNameError = true;
	    return;
	}
	role.roleNameError = false;
    }

    var addPermissionSuggestionsFromExistingRoles = function(existingRoles) {
	var permissionsMap = {};
	var numExistingRoles = existingRoles.length;
	for (var i = 0; i < numExistingRoles; i++) {
	    var role = existingRoles[i];
	    var permissions = role.permissions;
	    for (var j = 0; j < permissions.length; j++) {
		permissionsMap[permissions[j]] = null;
	    }
	}

	for (var permission in permissionsMap) {
	    if (permissionsMap.hasOwnProperty(permission)) {
		$scope.permissionSuggestions.push(permission);
	    }
	}
	
    }

    $scope.toggleNewRoles = function() {
	if ($scope.newRolesCollapse == false) {
	    $scope.newRolesCollapse = true;
	    $scope.newRolesToggleLinkText = "+";
	} else {
	    $scope.newRolesCollapse = false;
	    $scope.newRolesToggleLinkText = "-";
	}
    }

    $scope.getFilterPermissionSuggestions = function(role) {
	
	if (role.newPermission && (endsWith(role.newPermission, " ")||
	   endsWith(role.newPermission, "\t")||
	   endsWith(role.newPermission, "\n")||
	    endsWith(role.newPermission, "\r"))) {
	    return [];
	}

	var returnedSuggestions = [];
	var rolePermissions = role.permissions.slice().sort();
	var permissionSuggestions = $scope.permissionSuggestions.slice().sort();
	
	
	var jStart = 0;
	for (var i = 0,j=0;i < permissionSuggestions.length; i++) {
	    var rolePermission = null;
	    var permissionSuggestion = permissionSuggestions[i];
	    for (j=jStart; j <  rolePermissions.length; j++) {
		rolePermission = rolePermissions[j]; 
		if (permissionSuggestion.localeCompare(rolePermission) >  0) {
		    jStart = j;
		    continue;
		}
		if (permissionSuggestion.localeCompare(rolePermission) == 0) {
		    permissionSuggestions.splice(i,1);
		    jStart = j;
		    i = i - 1;
		}

		break;
		//returnedSuggestions.push(rolePermission);
	    }
	}
	return permissionSuggestions;
	
    }

    $scope.hideError = function() {
	$scope.showError = false;
    }

    $scope.hideSuccess = function() {
	$scope.showSuccess = false;
    }
    
    var getValuesListFromMap = function(map) {
	var list = [];
	for (var key in map) {
	    if (map.hasOwnProperty(key)) {
		list.push(map[key]);
	    }
	}
    }


    var getChangedRoles = function(list, map) {
	if (list == null ) {
	    return [];
	}

	var numElements = list.length;

	var changedRoles = [];

	for (var i = 0; i < numElements; i++) {
	    var role = list[i];
	    if (!commonOJService.compareObjects(role, map[role.role_name])) {
		changedRoles.push(role);
	    }
	}
	return changedRoles;

    }
 
    var checkBlankRoleNames = function() {
	var numNewRoles = $scope.newRoles.length;

	for (var i = 0; i < numNewRoles; i++) {
	    var role = $scope.newRoles[i];
	    if (!role.role_name) {
		$timeout(function() { 
		    $("#" + role.uiId + "-role-name-input-field" ).focus(); 
		    $("#" + role.uiId + "-role-name-input-field" ).goTo(-100); 
		}, 1000);		
		return false;
	    }
	}
	return true;
    }

    $scope.removeNewRole = function(role) {
	var roleIndex = commonOJService.indexOf($scope.newRoles, role);
	$scope.newRoles.splice(roleIndex,1);	
    }

    $scope.submitRoles = function() {
	if (!checkBlankRoleNames()) {
	    return;
	}
	var modifiedRoles = getChangedRoles($scope.existingRoles, $scope.existingRolesMap);
	if ($scope.newRoles.length ==0 && modifiedRoles.length ==0) {
	    $scope.successMessage = "Roles successfully updated";
	    $scope.showSuccess = true;
	    $scope.showError = false;
	    return;
	}

	var submittedObject = {};
	submittedObject.new_roles = $scope.newRoles;
	submittedObject.modified_roles = modifiedRoles;
	submittedObject.all_information = true;
	submittedObject.return_changes = true;
	$http.post('/api/1.0/roles', JSON.stringify(submittedObject), {headers: {"Content-Type": "application/json"}}).success(function(data) {
	    $scope.showSuccess = true;
	    $scope.showError = false;
	    $scope.successMessage = "Roles successfully updated";
	    resetRoles(data);
	    $timeout(function() { 
		$("#submitSuccess" ).goTo(-100); 
	    }, 1000);
	}).error(function(data) {
	    $scope.showSuccess = false;
	    $scope.showError = true;
	    if (data.hasOwnProperty("message")) {
		$scope.errorMessage = data.message;
	    } else {
		$scope.errorMessage = "Error while submitting Roles";
		console.log(data);
	    }
	    $timeout(function() { 
		$("#submitError" ).goTo(-100); 
	    }, 1000);

	});
    };
    
    
    $scope.removePermissionFromRole = function(role,permission){
	var index = commonOJService.indexOf(role.permissions, permission);
	if (index > -1) {
	    role.permissions.splice(index,1);
	}
	$scope.checkRoleChanged(null, role);
    }

    $scope.addNewRole = function() {
	if (!$scope.allowEditing) {
	    return;
	}
	if ($scope.newRoles.length == 0) {
	    $scope.newRolesToggleLinkText = "-";
	    $scope.newRolesCollapse = false;
	}
	var role = {};
	role.role_name = "";
	role.permissions = [];
	role.roleToggleLinkText = "-";
	role.roleNameErrorMessage = "Enter Role Name";
	role.roleNameError = true;
	$scope.roles.push(role);
	$scope.newRoles.push(role);
	$scope.newRoleIndex = $scope.newRoleIndex + 1;
	role.uiId = "newrole-" + $scope.newRoleIndex;
	$timeout(function() { 
	    $("#" + role.uiId + '-role-name-input-field' ).goTo(); 
	}, 200);
    };

    $scope.addPermissionToRole = function(role) {

	if (role.newPermission) {
	    if (commonOJService.indexOf(role.permissions, role.newPermission) <= -1) {
		role.permissions.push(role.newPermission);
		if (commonOJService.indexOf($scope.permissionSuggestions, role.newPermission) <= -1) {
		    $scope.permissionSuggestions.push(role.newPermission);
		}
		role.newPermission = "";
	    } else {
		//role.newPermission = "";
		role.incorrectPermissionText = "Entered permission already exists in the role!";
	    }
	} else {
	    role.incorrectPermissionClass = "";
	    role.incorrectPermissionText = "You have entered blank permission!";
	}
	$scope.checkRoleChanged(null, role);
    }

    $scope.newPermissionKeyup = function($event, role) {
	if (role.newPermission) {
	    //role.incorrectPermissionClass = "hide";
	    role.incorrectPermissionText = " ";
	} else {
	    role.incorrectPermissionClass = "";
	    role.incorrectPermissionText = "";
	}
    }


    
});


testApp.controller('assignAuthorRolesController', function($scope, $http) {

    $("title").text("Opinion Junction - Assign Roles");

    $scope.showTable = true;

    $scope.errorMessage = "";
    $scope.successMessage = "";

    $scope.showError = false;
    $scope.showSuccess = false;

    $scope.hideError = function() {
	$scope.showError = false;
    }

    $scope.hideSuccess = function() {
	$scope.showSuccess = false;
    }

    var getChangedAuthors = function(list, map) {
	if (list == null ) {
	    return [];
	}

	var numElements = list.length;

	var changedAuthors = [];

	for (var i = 0; i < numElements; i++) {
	    var author = list[i];
	    if (author.user_role.localeCompare(map[author.author_name].user_role) != 0) {
		changedAuthors.push(author);
	    }
	}
	return changedAuthors;

    }

    $scope.authorsPerPage = 30;

    $scope.latestAuthorId = "";

    $scope.firstAuthorId = "";

    $scope.firstMostAuthorId = "";

    $scope.temporaryListForNewAuthors = null;

    $scope.returnBack = function() {
	$scope.showTable = true;
	$scope.temporaryListForNewAuthors = null;
    }

    $scope.continueNextPrevious = function() {
	setAuthorsOnRestGet($scope.temporaryListForNewAuthors)
	$scope.showTable = true;
	$scope.temporaryListForNewAuthors = null;
    }

    var setAuthorsOnRestGetAfterCheckingChanges = function(data) {
	if (data.length > 0) {
	    if (getChangedAuthors($scope.displayed_authors, $scope.originalAuthorsMap).length == 0) {
		setAuthorsOnRestGet(data);
	    } else {
		$scope.temporaryListForNewAuthors = data;
		$scope.showTable = false;
	    }
	}

    }
    var setAuthorsOnRestGetInitial = function(data) {
	$scope.firstMostAuthorId = data[0].id;
	setAuthorsOnRestGet(data);
    }

    var setAuthorsOnRestGet = function(data) {
	$scope.displayed_authors = data;
	setBackingInformation(data);
	$scope.firstAuthorId = data[0].id;;
	$scope.latestAuthorId = data[data.length-1].id;
    }

    $scope.nextPage = function() {
	$http.get('/api/1.0/authors?limit=' + $scope.authorsPerPage + '&fromId=' + $scope.latestAuthorId, {headers: {"Content-Type": "application/json"}}).success(setAuthorsOnRestGetAfterCheckingChanges);	
    }

    $scope.previousPage = function() {
	if ($scope.firstMostAuthorId && ($scope.firstMostAuthorId != $scope.firstAuthorId)) {
	    $http.get('/api/1.0/authors?limit=-' + $scope.authorsPerPage + '&fromId=' + $scope.firstAuthorId, {headers: {"Content-Type": "application/json"}}).success(setAuthorsOnRestGetAfterCheckingChanges);	
	}
	
    }



    $http.get('/api/1.0/authors?limit=' + $scope.authorsPerPage, {headers: {"Content-Type": "application/json"}}).success(setAuthorsOnRestGetInitial);

    $scope.originalAuthorsMap = {};


    $scope.setRole = function(author, role) {
	author.user_role = role;
    }

    var getListForFieldFromList = function(list, fieldName) {
	var returnedList = [];
	var numMembers = list.length;
	for (var i = 0; i < numMembers; i++) {
	    returnedList.push(list[i][fieldName]);
	}
	return returnedList;
    }

    $http.get('/api/1.0/roles?fields=role_name',{headers: {"Content-Type": "application/json"}}).success(function(data) {
	$scope.roles = getListForFieldFromList(data, "role_name");
    });


    var setBackingInformation = function(authorList) {
	var numAuthors = authorList.length;
	$scope.originalAuthorsMap = {};
	for (var i = 0; i < numAuthors; i++) {
	    var author = authorList[i];
	    $scope.originalAuthorsMap[author.author_name] = JSON.parse(JSON.stringify(author));
	}
    }
    
    var resetAuthors = function(changedAuthors) {
	if (changedAuthors == null) {
	    return;
	}
	var numChangedAuthors = changedAuthors.length;

	for (var i = 0 ; i < numChangedAuthors; i++) {
	    var changedAuthor = changedAuthors[i];
	    $scope.originalAuthorsMap[changedAuthor.author_name] = changedAuthor;
	    
	}

	var displayed_authors = [];

	for (var key in $scope.originalAuthorsMap) {
	    if ($scope.originalAuthorsMap.hasOwnProperty(key)) {
		displayed_authors.push($scope.originalAuthorsMap[key]);
	    }
	}

	$scope.displayed_authors = displayed_authors;

	
    }

    $scope.searchAuthors = function() {
	var searchString = "?use_icontains=true";

	if ($scope.searchAuthorName) {
	    searchString = searchString + "&author_name=" +  $scope.searchAuthorName;
	}

	if ($scope.searchFirstName) {
	    searchString = searchString + (searchString?"&":"?") + "first_name=" +  $scope.searchFirstName;
	}

	if ($scope.searchLastName) {
	    searchString = searchString + (searchString?"&":"?") + "last_name=" +  $scope.searchLastName;
	}

	if ($scope.searchRoleName) {
	    searchString = searchString + (searchString?"&":"?") + "user_role=" +  $scope.searchRoleName;
	}

	$http.get('/api/1.0/authors'+ searchString,{headers: {"Content-Type": "application/json"}}).success(setAuthorsOnRestGetAfterCheckingChanges);


    }

    $scope.submitAuthorChanges = function() {
	var changedAuthors = getChangedAuthors($scope.displayed_authors, $scope.originalAuthorsMap);
	if (changedAuthors.length == 0) {
	    $scope.successMessage = "Author Roles Changed Successfully";
	    $scope.showSuccess = true;
	}
	console.log("got changed authors correctly");

	var submittedObject = {};
	submittedObject.all_information = true;
	submittedObject.changed_authors = changedAuthors;
	submittedObject.return_changes = true;
	$http.post('/api/1.0/authors',submittedObject,{headers: {"Content-Type": "application/json"}}).success(function(data) {
	    console.log("need to implement author update feature");
	    resetAuthors(data.changed_authors);
	    $scope.successMessage = "Author Roles Changed Successfully";
	    $scope.showSuccess = true;
	}).error(function(data) {
	    if ((typeof data) === "string" || data instanceof String) {
		$scope.errorMessage = "Something went wrong while submitting your changes, here are the details, please contact the site administrators with it: " + data;
	    }
	    if ("message" in data) {
		$scope.errorMessage = data.message;
	    } else {
		$scope.errorMessage = "Something went wrong while submitting your changes.";
	    }

	    $scope.showError = true;

	});	
    }


});

testApp.controller('mainPageController', function($scope, $http, $modal, commonOJService, profileService, $stateParams) {
    $scope.category = $stateParams.category;

    //$rootScope.title = "Opinion Junction";
    //$scope.title = "Opinion Junction";
    $scope.ogTitle = "Opinion junction";
    $scope.ogDescription = "Opinion Junction";
    $scope.ogImage = "";


    createCategoriesMap = function(categories) {
	var categoriesMap = {};
	if (categories == null) {
	    return; // not the end of the world
	}
	var numCategories = categories.length;
	for (i = 0; i < numCategories; i++) {
	    category = categories[i];
	    categoriesMap[category.name] = category;
	}
	return categoriesMap;
    }

    if ($scope.category) {
	commonOJService.activateHeaderNavLink($scope.category);
	//$scope.topBannerFragment="#category-image";
	$scope.topBannerFragment="#carousel";
	$scope.categoryImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg/1024px-Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg";

	$scope.categoriesMap = createCategoriesMap($scope.categories);
	if ($scope.categoriesMap !=null) {
	    $scope.categoriesMapCreated = true;
	    if ($scope.category in $scope.categoriesMap) {
		$scope.category_friendly_name = $scope.categoriesMap[$scope.category].friendly_name;
		$("title").text("Opinion Junction - " + $scope.category_friendly_name);	    
	    } 

	} else {
	    $("title").text("Opinion Junction - " + $scope.category);	    
	}
	

    } else {
	commonOJService.activateHeaderNavLink("home");
	$scope.topBannerFragment="#carousel";
	$("title").text("Opinion Junction");
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
			    if (!item.thumbnail_image) {
				if (item.primary_image) {
				    item.thumbnail_image = item.primary_image;
				} else {
				    item.thumbnail_image = "/static/no_preview.png";;
				}
			    }
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
			    $scope.showFooter = true;
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
	    if (!article.header_image) {
		article.header_image = article.primary_image;
	    }
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
	    category_friendly_names = category_friendly_names + ", " + $scope.categoriesMap[articleCategories[i]].friendly_name;
	    //if (category.localCompare
	}

	article.category_friendly_names = category_friendly_names;

	return category_friendly_names;

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
    //$rootScope.title = "Opinion Junction";
    //$scope.title = "Opinion Junction";
    $scope.ogTitle = "Opinion junction";
    $scope.ogDescription = "Opinion Junction";
    $scope.ogImage = "";

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


    $scope.collapseNavbar = function() {
	$scope.navbarCollapsed = true;
    };

    $scope.headerFacebookLikeCollapse = true;
    
    $scope.headerTwitterFollowCollapse = true;

    $scope.headerGoogleplusLikeCollapse = true;

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


    $scope.openSearchModal = function() {
	var modalInstance = $modal.open({
	    templateUrl: '/angularstatic/acentral/partials/search-modal.html',
	    controller: SearchModalInstanceController,
	    windowClass: 'search-modal-window',
	    resolve: {
		items: function () {
		    return $scope.items;
		}
            }
	});

/*	modalInstance.opened.then(function(obj) {
	    $('#search-modal').parent().css("background-color","transparent");

	});*/
        modalInstance.result.then(function (isLoggedIn) {

        });
    }
    
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
	else {
	    $scope.rightNavBar = "signinNavBar.html";
	    $scope.userData = null;
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

testApp.controller('setAboutusController', function($scope, $http  ) {
    $("title").text("Opinion Junction - Set About Us");

    //$scope.form.aboutusMessage = "";
    $scope.originalData = null;

    $scope.showSuccess = false;
    $scope.showError = false;

    var init = function() {
	$http.get("/api/1.0/aboutus/?get_metadata_information=true", {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		$scope.aboutusMessage = data["team_metadata"]["aboutus_message"];
		$scope.originalData = JSON.parse(JSON.stringify(data.team_metadata));
		$scope.form = data.team_metadata;
	    }).error(function () {
		$scope.originalData = {};
		$scope.form = {};
	    });

    };

    init();

    $scope.updateAboutus = function() {
	var updated_details = {};
	$scope.showSuccess = false;
	$scope.showError = false;
	updated_details.update_metadata_information = "true";  
//	console.log("$scope.form.aboutusMessage.$dirty: " + $scope.form.aboutusMessage.$dirty);
	for (field in $scope.originalData) {
	    if($scope.originalData.hasOwnProperty(field)) {
		if ($scope.originalData[field] != $scope.form[field]) {
		    updated_details[field] = $scope.form[field];
		}
	    }
	}

	$scope.originalData = JSON.parse(JSON.stringify($scope.form));
	$http.post('/api/1.0/aboutus', JSON.stringify(updated_details), {headers: {"Content-Type": "application/json"}})
	    .success( function() {
		$scope.showSuccess = true;
		$scope.successMessage = "Changes submitted successfully";
	    })
	    .error( function() {
		$scope.showError = true;
		$scope.errorMessage = "Error while submitting changes";
	    });
    }
});

testApp.controller('setContactusController', function($scope, $http  ) {

    $("title").text("Opinion Junction - Set Contact Us");

    $scope.message = "Reach us in Axlotopia";
//    var contactUs_row_test = {};
//    contactUs_row_test.contactus_details = "";
//    contactUs_row_test.contactus_description = "";
//    contactUs_row_test.contactus_type = "";
//
//    $scope.contactusListVisible = [];
//    $scope.contactusListVisible.push(contactUs_row_test);
//    
    $scope.contactUsTypes  = ["email", "physical location"];

    $scope.addedContactUsList = [];
    $scope.removedContactUsIdList = []; 

    var originalContactusMap = {};

    $scope.removeSelectedAboutus = function() {
	var numContactus = $scope.contactusListVisible.length;
	for (var i = numContactus - 1; i >= 0; i--) {
	    var contactUs = $scope.contactusListVisible[i];
	    if (contactUs.selected) {
		$scope.contactusListVisible.splice(i,1);
		if (contactUs.id && (contactUs.id in originalContactusMap)) {
		    $scope.removedContactUsIdList.push(contactUs.id);
		}
	    }	    
	}

    }

    $scope.addMoreAboutus = function() {
	var contactUs_row = {};
	contactUs_row.contactus_details = "";
	contactUs_row.contactus_description = "";
	contactUs_row.contactus_type = "";
	$scope.contactusListVisible.unshift(contactUs_row);
	$scope.addedContactUsList.push(contactUs_row);
    };

    var compareContactusFieldsSame = function(newContactus, oldContactus) {
	var same = true;
	for (var key in newContactus) {
	    if (newContactus.hasOwnProperty(key) && oldContactus.hasOwnProperty(key)) {
		if (newContactus[key] !== oldContactus[key]) {
		    same = false;
		    break;
		}
	    }
	}
	return same;
    }

    var validateContactusInputField = function(contactusMember, field, clazz) {
	var returnValue = !(!contactusMember[field]);
	if (!returnValue) {
	    contactusMember[clazz] = true;
	} else {
	    contactusMember[clazz] = false;
	}
	return returnValue;


    }
    $scope.updateContactus = function() {
	$scope.showError = false;
	$scope.showSuccess = false;
	var numContactusVisible = $scope.contactusListVisible.length;
	var changes = {};
	var changed_contactus = [];
	var validInputs = true;
	for (var i = 0; i < numContactusVisible; i++) {
	    var contactusMember = $scope.contactusListVisible[i];
	    validInputs = validInputs & 
		validateContactusInputField(contactusMember, "contactus_description", 
					"contactus_description_error") & 
		validateContactusInputField(contactusMember, 
					    "contactus_details", "contactus_details_error") &
		validateContactusInputField(contactusMember,
					   "contactus_type", "contactus_type_error");
	    if (!validInputs) {
		continue;
	    }
	    if ("id" in contactusMember && (contactusMember.id in originalContactusMap)) {
		if (!compareContactusFieldsSame(contactusMember, originalContactusMap[contactusMember.id])){
		    changed_contactus.push(contactusMember);
		}
	    }
	}
	if (!validInputs) {
	    $scope.errorMessage = "Some of the fields have been left blank";
	    $scope.showError = true;
	    return;
	}
	changes['update_contactus_information'] = "true";
	changes['changed_contactus'] = changed_contactus;
	changes['removed_contactus'] = $scope.removedContactUsIdList;
	changes['added_contactus'] = $scope.addedContactUsList;
	

	$http.post('/api/1.0/aboutus', JSON.stringify(changes), {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		$scope.showSuccess = true;
		$scope.successMessage = "Changes submitted successfully";
		init();
	    })
	    .error( function(data) {
		$scope.showError = true;
		$scope.errorMessage = "Error while submitting changes";
	    });
	
    }

    var getMapForKeyFromArray = function(array, key) {
	
	var mapForKey = {};

	var numMembers = array.length;

	for (var i = 0; i < numMembers; i++) {
	    var member = array[i];
	    mapForKey[member[key]] = member;
	}

	return mapForKey;
    }

    var init = function() {
	$scope.addedContactUsList = [];
	$scope.removedContactUsIdList = []; 

	$http.get("/api/1.0/aboutus/?get_contactus_information=true", {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		$scope.contactusListVisible = data["team_contactus"];
		var originalContactusList = JSON.parse(JSON.stringify(data.team_contactus));
		originalContactusMap = getMapForKeyFromArray(originalContactusList, "id");
		//$scope.form = data.team_metadata;
	    }).error(function () {
		//$scope.originalData = {};
		//$scope.form = {};
	    });
    }

    init();
    
});

testApp.controller('setOurTeamController', function($scope, $http, authorCacheService, commonOJService ) {

    $("title").text("Opinion Junction - Set Our Team");

    $scope.added_team_authors_map = {};
    $scope.removed_team_authors_map = {};
    //$scope.modified_team_authors_map = {};

    var compareByAuthorId = function(author1, author2) {
	var authorId1  = author1.id;
	var authorId2 = author2.id;
	if (!authorId1) {
	    authorId1 = -1;
	} else {
	    authorId1 = parseInt(authorId1);
	}
	if (!authorId2) {
	    authorId2 = -1;
	} else {
	    authorId2 = parseInt(authorId2);
	}

	if (authorId1 < authorId2) {
	    return -1;
	}
	if (authorId1 > authorId2) {
	    return 1;
	}
	return 0;
    }

    var createAuthorsIdMapFromArray = function(authors) {
	map = {};
	var numAuthors = authors.length;
	for (var i = 0; i < numAuthors; i++) {
	    var author = authors[i];
	    map[author.id] = author;
	}
	return map;
    }

    var processTeamAuthorsOnLoad = function(authors) {
	var numAuthors = authors.length;
	for (var i = 0; i < numAuthors; i++) {
	    var author = authors[i];
	    author.id = author.author_id;
	    author.changeablefirst_name = author.first_name;
	    author.changeablelast_name = author.last_name;
	}
    }
 
//    var setIdFieldOnAuthorsArray = function(authors) {
//	var numAuthors = authors.length;
//	for (var i = 0; i < numAuthors; i++) {
//	    author = authors[i];
//	    author.id = author.author_id;
//	}
//    }


    var initOurTeam = function() {
	$http.get("/api/1.0/aboutus/?get_author_information=true", {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		//setIdFieldOnAuthorsArray(data.team_authors);
		processTeamAuthorsOnLoad(data.team_authors);
		$scope.team_authors_displayed = data.team_authors;
		$scope.team_authors_original = 
		    JSON.parse(JSON.stringify(data.team_authors));
		$scope.original_team_authors_map = createAuthorsIdMapFromArray($scope.team_authors_original);
		$scope.team_authors = data.team_authors.slice(0);
		$scope.team_authors = $scope.team_authors
		    .sort(compareByAuthorId);
	    });
	$scope.added_team_authors_map = {};
	$scope.removed_team_authors_map = {};


    };

    initOurTeam();

    $scope.message = "Axl provides roles and privileges to people";
    $scope.displayedAuthorResults = [];
    var searchAuthorResultsMapByNumKeyChars = {};
    authorCacheService.initCache(searchAuthorResultsMapByNumKeyChars, 
				 $scope, 
				 [function() {
				     $scope.displayedAuthorResults
					 = $scope.
					 displayedAuthorResults.slice(0)
					 .sort(compareByAuthorId);
				     filterOutTeamAuthorsFromDisplayedAuthors();
				 }]);

    var filterOutTeamAuthorsFromDisplayedAuthors = function() {
//	var team_authors = $scope.team_authors.slice(0);
//	for (var key in $scope.added_team_authors_map) {
//	    if ($scope.added_team_authors_map.hasOwnProperty(key)) {
//		team_authors.push($scope.added_team_authors_map[key]);
//	    }
//	}
//	team_authors.sort(compareByAuthorId);
	
	var team_authors = $scope.team_authors_displayed.slice();
	team_authors.sort(compareByAuthorId);
	var num_team_authors = team_authors.length;
	var num_displayed_authors = $scope.displayedAuthorResults.length;
	var i = 0;
	var j = 0;
	for (; i < num_team_authors; i++) {
	    var team_author = team_authors[i];
	    for (; j < num_displayed_authors; j++) {
		var displayed_author = $scope.displayedAuthorResults[j];
		if (displayed_author.id == team_author.id) {
		    $scope.displayedAuthorResults.splice(j, 1);
		    //j = j - 1;
		    break;
		}
		if (parseInt(displayed_author.id) > 
		    parseInt(team_author.id)) {
		    break;
		}
	    }
	}
    }


    $scope.getResultsForKey = function() {
	if ($scope.displayedAuthorResults) {
	    var numDisplayedAuthors = $scope.displayedAuthorResults.length;
	    for (var i = 0; i < numDisplayedAuthors; i++) {
		var author = $scope.displayedAuthorResults[i];
		author.selected = false;
	    }
	}
	var key = $scope.authorNameSearchKey;
	if (!key) {
	    $scope.displayedAuthorResults = $scope.allAuthors.slice(0)
		.sort(compareByAuthorId);
	    filterOutTeamAuthorsFromDisplayedAuthors();
	    return;
	}

	var localResults = authorCacheService.getResultsForKeyFromCache(key, searchAuthorResultsMapByNumKeyChars, "author_name");
	
	if (localResults != null) {
	    $scope.displayedAuthorResults = localResults.slice(0)
		.sort(compareByAuthorId);
	} else {
	    authorCacheService.getResultsForKeyFromRest(key, searchAuthorResultsMapByNumKeyChars, $scope);
	    $scope.displayedAuthorResults = 
		$scope.displayedAuthorResults.slice(0)
		.sort(compareByAuthorId);
	}
	filterOutTeamAuthorsFromDisplayedAuthors();
    }


    $scope.addToTeamAuthors = function() {
	var numAuthorResults = $scope.displayedAuthorResults.length;
	var new_team_authors = [];
	for (var i = 0; i < numAuthorResults ; i++) {
	    var author = $scope.displayedAuthorResults[i];
	    if (author.selected == true) {
		author.selected = false;
		author.changeablefirst_name = author.first_name;
		author.changeablelast_name = author.last_name;
		
		//$scope.team_authors.push(author);
		var indexInTeamAuthors = commonOJService.indexOfByMemberField($scope.team_authors, author.id, "id");
		if (indexInTeamAuthors <= -1) {
		    new_team_authors.unshift(author);
		    if (author.id in $scope.removed_team_authors_map 
			&& $scope.removed_team_authors_map[author.id] != null) {
			$scope.removed_team_authors_map[author.id] = null;
		    } else {
			$scope.added_team_authors_map[author.id] 
			    = author;		    
		    }
		} else {
		    new_team_authors.unshift($scope.team_authors[indexInTeamAuthors]);
		}
	    }
	} 
	//$scope.team_authors = $scope.team_authors.sort(compareByAuthorId);
	var num_new_team_authors = new_team_authors.length;
	for (var i = 0; i < num_new_team_authors; i++) {
	    var author = new_team_authors[i];
	    $scope.team_authors_displayed.unshift(author);
	}
	filterOutTeamAuthorsFromDisplayedAuthors();
    }

    $scope.$watch("authorNameSearchKey", $scope.getResultsForKey);
    
    var validateInputsAndSetErrorClasses = function(author) {
	var error = false;
	if (!author.first_name && !author.last_name) {
	    error = true;
	    author.name_error = true;
	} else{
	    author.name_error = false;
	}
	
	if (!author.role) {
	    error = true;
	    author.role_error = true;
	} else {
	    author.role_error = false;
	}
	return error;
    }

    var compareAuthorFieldsSame = function(newAuthor, oldAuthor) {
	var same = true;
	for (var key in newAuthor) {
	    if (newAuthor.hasOwnProperty(key) && oldAuthor.hasOwnProperty(key)) {
		if (newAuthor[key] !== oldAuthor[key]) {
		    same = false;
		    break;
		}
	    }
	}
	return same;
    }

    $scope.submitTeamAuthors = function() {
	$scope.showError = false;
	$scope.errorMessage = "";
	$scope.showSuccess = false;
	$scope.successMessage = "";

	var numTeamAuthors = $scope.team_authors.length;
	var error = false;
	var changes = {};
	changes['update_author_information'] = 'true';
	var removed_team_authors_array = [];
	for (var key in $scope.removed_team_authors_map) {
	    if ($scope.removed_team_authors_map.hasOwnProperty(key)) {
		removed_team_authors_array.push($scope.removed_team_authors_map[key].id);
	    }
	}
	changes['removed_authors'] = removed_team_authors_array;
	var changed_team_authors_array = [];
	for (var i = 0; i < numTeamAuthors; i++) {
	    var author = $scope.team_authors[i];
	    if (author.id in $scope.removed_team_authors_map && 
		$scope.removed_team_authors_map[author.id] != null) { 
		//since this author is not being persisted in the final result
		continue;
	    }
	    if (author.id in $scope.original_team_authors_map) {
		if (!compareAuthorFieldsSame(author, $scope.original_team_authors_map[author.id])) {
		    author.first_name = author.changeablefirst_name;
		    author.last_name = author.changeablelast_name;
		    changed_team_authors_array.push(author);
		}
	    }
	    error = validateInputsAndSetErrorClasses(author);
	}
	changes['changed_authors'] = changed_team_authors_array;
	var added_team_authors_array = [];
	for (var key in $scope.added_team_authors_map) {
	    if ($scope.added_team_authors_map.hasOwnProperty(key)) {
		var author = $scope.added_team_authors_map[key];
		author.first_name = author.changeablefirst_name;
		author.last_name = author.changeablelast_name;
		error = validateInputsAndSetErrorClasses(author);
		added_team_authors_array.push(author);
	    }
	}
	changes['added_authors'] = added_team_authors_array;


	
	
	//var numTeamAddedAuthors = $scope.team_authors.length;
	if (error) {
	    $scope.showError = true;
	    $scope.errorMessage = "Some fields are left blank";
	    return;
	} else {
	    $scope.showError = false;
	    $http.post('/api/1.0/aboutus', JSON.stringify(changes), {headers: {"Content-Type": "application/json"}})
	    .success( function() {
		$scope.showSuccess = true;
		$scope.successMessage = "Changes submitted successfully";
		initOurTeam();
	    })
	    .error( function() {
		$scope.showError = true;
		$scope.errorMessage = "Error while submitting changes";
	    });
	}
    }

    $scope.deleteTeamAuthors = function() {
	var numAuthors = $scope.team_authors.length;
	for (var i = 0; i < numAuthors ; i++) {
	    var author = $scope.team_authors[i];
	    if (author.selected == true) {
		var indexInTeamAuthors = commonOJService.indexOfByMemberField($scope.team_authors, author.id, "id");
		if (indexInTeamAuthors <= -1) {
		    if (author.id in $scope.added_team_authors_map 
			&& $scope.added_team_authors_map[author.id] != null) {
			$scope.added_team_authors_map[author.id] = null;
		    } else {
			$scope.removed_team_authors_map[author.id] 
			    = author;		    
		    }
		} else {
		    author.selected = false;
		}

		var indexOfAuthorInDisplayedAuhors = commonOJService.indexOfByMemberField($scope.team_authors_displayed, author.id, "id");
		$scope.team_authors_displayed.splice(indexOfAuthorInDisplayedAuhors, 1);
	    }
	}
	$scope.getResultsForKey();
	$scope.filterOutTeamAuthorsFromDisplayedAuthors();
    }
});

testApp.controller('articleController', function($scope, $http, $stateParams, $sce, commonOJService, dateService, profileService) {

    $scope.message = "Welcome to Opinion Junction's First Article";
    $scope.articleId = $stateParams.articleId;
    $("title").text("Opinion Junction - Article");
    $scope.noArticle = false;
    $scope.articleInitialised = false;

    var getOthersArticlesByAuthor = function(authorId) {
	$http.get("/api/1.0/articles?no_content=true&limit=5&status=published&authorId=" + authorId, {headers: {"Content-Type": "application/json"}})
	.success(function(data) {
	    if (data.length > 0) {
		$scope.otherAuthorArticles = data;
		for (var i = 0; i < $scope.otherAuthorArticles.length; i++) {
		    var article = $scope.otherAuthorArticles[i];
		    if (article.id == $scope.article.id) {
			$scope.otherAuthorArticles.splice(i, 1);
			i = i - 1;
			continue;
		    }
		    article.author.displayed_name = $scope.article.author.displayed_name;
		    article.friendly_categories = commonOJService.get_category_friendly_name_string($scope, article);
		}
	    }
	});
    };

    $http.get("/api/1.0/articles/" + $scope.articleId + "?for_display=true", {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		if (data.length > 0) {
		    $scope.article = data[0];
		    $scope.article.author.displayed_name = ((($scope.article.author.first_name == null || $scope.article.author.first_name.trim().length == 0)
						     && ($scope.article.author.last_name == null || $scope.article.author.last_name.trim().length == 0)) ?
						    $scope.article.author.author_name : $scope.article.author.first_name + " " + $scope.article.author.last_name);
		    getOthersArticlesByAuthor($scope.article.author.id);
		    $scope.article.storydisplayedtext = commonOJService.convertYoutubeIframeToHtml5($scope.article.storydisplayedtext)
		    $scope.article.author.image = profileService.getProfileImage($scope.article.author);
		    
		    if ($scope.article.author.user_bio == null || $scope.article.author.user_bio.trim().length == 0 ) {
			$scope.article.author.user_bio = $scope.article.author.displayed_name + " hasn't provided any description.";
		    }
		    commonOJService.activateHeaderNavLink($scope.article.categories[0]);
		    $scope.socialShareArticle = $scope.article;
		    $scope.showFooter=true;
		    $("title").text("Opinion Junction - Article - " + $scope.article.title);
		    var socialbar = $("#floating-socialbar");
		    socialbar.css("position", "relative");
		    socialbar.css("top", "0px");
		    socialbar.css("bottom", "auto");  
		    $scope.article.author.user_bio = commonOJService.convertWhiteSpaceToHtml($scope.article.author.user_bio);
		    $scope.article.friendly_published_date = dateService.getFriendlyDateString(new Date($scope.article.published_date));
		    if ($scope.article.tags && $scope.article.tags.length > 0) {
			$scope.firstTag = $scope.article.tags[0];
			$scope.tagsAfterFirst = $scope.article.tags.slice(1);
			$scope.articleTagsDivVisible = true;
		    } else {
			$scope.articleTagsDivVisible = false;
		    }
		    $scope.articleInitialised = true;
		}
	    }).error(function() { $scope.noArticle= true; $scope.noArticleMessage = "The article you are looking for doesn't exist.";});


    $scope.to_trusted = function(html_code) { //http://stackoverflow.com/questions/24178316/ng-bind-html-strips-elements-attributes
	return $sce.trustAsHtml(html_code);
    };

    $scope.comments_init = function () {
        $('iframe_comments').height($('iframe_comments').contents().height());
        //$(this).width($(this).contents().width());
    }

    $scope.isUserLoggedIn = function() {
	return commonOJService.userData && (commonOJService.userData.id || (commonOJService.userData.code === "user_not_setup_for_oj"));
    }

    $scope.articleUrl = window.location.href;

});

testApp.controller('signinController', function($scope) {
    $scope.message = "Welcome to Opinion Junction's First Article";
});

testApp.controller('aboutusController', function($scope, $timeout, $http) {

    var processTeamAuthors = function(team_authors) {
	var numTeamAuthors = team_authors.length;
	for (var i = 0; i < numTeamAuthors; i++) {
	    var team_author = team_authors[i];
	    if (!team_author.image) {
		team_author.image = "/static/blank-grey.jpg";
	    }
	}
    }


    $http.get("/api/1.0/aboutus/?get_all_information=true", {headers: {"Content-Type": "application/json"}})
    .success(function(data) {
	$scope.team_authors = data["team_authors"];
	processTeamAuthors($scope.team_authors);
	$scope.team_metadata = data["team_metadata"];
	$scope.team_contactus_array = data["team_contactus"];
    });
    $scope.message = "Axl provides people knowledge about roles and privileges of the people who keep things working";
    $scope.members = [{"href": "#aboutus", "friendly_text": "About Us"},
		      {"href": "#ourteam", "friendly_text": "Our Team"},
		      {"href": "#contactus", "friendly_text": "Contact Us"}
		     ];
    $scope.activeMember = 0;
    $scope.callableOnSelect = function(index) {
	$timeout(function() { $($scope.members[index].href ).goTo(-100); }, 200);
	console.log("Axl is GOD");
	
    }

    $scope.aboutusmessage = "In Axl we trust";
    $scope.ourteammessage = "We work with the grace of Axl Rose";
    $scope.contactusmessage = "Reach us in Axlotopia";
});

testApp.controller('userProfileController', function($scope, $http, profileService, commonOJService) {
    $("title").text("Opinion Junction - Settings - Profile");
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
	if ($scope.userData) {
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

	}
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

testApp.controller('publicProfileController', function($scope, commonOJService, profileService, $http, $sce, $stateParams) {
    console.log("$stateParams.userid: " + $stateParams.userid); 
    $scope.to_trusted = function(html_code) { //http://stackoverflow.com/questions/24178316/ng-bind-html-strips-elements-attributes
	return $sce.trustAsHtml(html_code);
    };
    var initUserid = function(commonOJService, scope) {
	scope.userid = commonOJService.userData.id;
	$http.get("/api/1.0/authors/" + $scope.userid + "/activity", {headers: {"Content-Type": "application/json"}})
	    .success( function(data) { 
		$scope.authorActivity = data;
		if ($scope.authorActivity.author_bio) {
		    $scope.authorActivity.author_bio = commonOJService.convertWhiteSpaceToHtml($scope.authorActivity.author_bio);
		} else {
		    //$scope.authorActivity.author_bio = ". . .";
		    $scope.authorActivity.author_bio = $scope.authorActivity.author_name + " hasn't provided any description.";;
		}
		$scope.authorActivity.image = profileService.getProfileImage($scope.authorActivity);
		$("title").text("Opinion Junction - Profile - " + $scope.authorActivity.author_name);
	    });
    };

    var getOthersArticlesByAuthor = function(commonOJService, scope) {
	$http.get("/api/1.0/articles?no_content=true&limit=5&status=published&authorId=" + scope.userid, {headers: {"Content-Type": "application/json"}})
	.success(function(data) {
	    if (data.length > 0) {
		$scope.otherAuthorArticles = data;
		for (var i = 0; i < $scope.otherAuthorArticles.length; i++) {
		    var article = $scope.otherAuthorArticles[i];
		    article.author.displayed_name = $scope.authorActivity.author_name;
		    article.friendly_categories = commonOJService.get_category_friendly_name_string($scope, article);
		}
	    }
	});
    };

    if ("userid" in $stateParams && $stateParams.userid) {
	$scope.userid = $stateParams.userid;
	$http.get("/api/1.0/authors/" + $scope.userid + "/activity", {headers: {"Content-Type": "application/json"}})
	    .success( function(data) { 
		$scope.authorActivity = data;
		if ($scope.authorActivity.author_bio) {
		    $scope.authorActivity.author_bio = commonOJService.convertWhiteSpaceToHtml($scope.authorActivity.author_bio);
		} else {
		    //$scope.authorActivity.author_bio = ". . .";
		    $scope.authorActivity.author_bio = $scope.authorActivity.author_name + " hasn't provided any description.";;
		}
		$scope.authorActivity.image = profileService.getProfileImage($scope.authorActivity);
		$("title").text("Opinion Junction - Profile - " + $scope.authorActivity.author_name);
		getOthersArticlesByAuthor(commonOJService, $scope);
	    });
    } else {
	commonOJService.controllerInitOrRedirect([initUserid, getOthersArticlesByAuthor],$scope);
    }

});

testApp.controller('createArticleFrontPagePreviewController', function($scope, $location) {
    //var articleState = createEditPreviewArticleStateService.getArticleState();
    var articleState = window.articleState; //http://stackoverflow.com/questions/21519113/angularjs-open-a-new-browser-window-yet-still-retain-scope-and-controller-and
    console.log("In createArticleFrontPagePreviewController");
    if (articleState != null) {
	$scope.articleInfos = [articleState.article];
	if (articleState.article.header_image) {
	    $scope.articles = [articleState.article];
	} else {
	    if (articleState.article.primary_image) {
		articleState.article.header_image = articleState.article.primary_image;
		$scope.articles = [articleState.article];
	    }
	}
	$scope.mode = articleState.mode;
    } else {
	commonOJService.messageForControllers.messageViewErrorMessage = "It seems you aren't editing any opinion, click on Home above to go back to the home page";
	

	$location.path("/message");
 
    }
});

testApp.controller('createArticlePreviewController', function($scope, $location, $sce) {
    //var articleState = createEditPreviewArticleStateService.getArticleState();
    var articleState = window.articleState; //http://stackoverflow.com/questions/21519113/angularjs-open-a-new-browser-window-yet-still-retain-scope-and-controller-and
    if (articleState != null) {
	$scope.article = articleState.article;
	$scope.mode = articleState.mode;
	$scope.articleInitialised = true;
    } else {
	commonOJService.messageForControllers.messageViewErrorMessage = "It seems you aren't editing any opinion, click on Home above to go back to the home page";
	

	$location.path("/message");
 
    }

    $scope.to_trusted = function(html_code) { //http://stackoverflow.com/questions/24178316/ng-bind-html-strips-elements-attributes
	return $sce.trustAsHtml(html_code);
    };

});

testApp.controller('editArticleMetadataController', function($scope, $http, commonOJService, authorCacheService, $stateParams) {

    var searchAuthorResultsMapByNumKeyChars = {};
    authorCacheService.initCache(searchAuthorResultsMapByNumKeyChars, $scope);
    //$http.get("/api/1.0/authors", {"Content-Type": "application/json"}).success(function(data) {
    //	$scope.allAuthors = data;
    //	$scope.displayedAuthorResults = data;
    //	searchAuthorResultsMap = {};
    //	searchAuthorResultsMapByNumKeyChars[0] = searchAuthorResultsMap;
    //	searchAuthorResultsMap[""] = data;
    //	
    //});

    $scope.today = function() {
	$scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
	$scope.dt = null;
    };

    $scope.open = function($event) {
	$event.preventDefault();
	$event.stopPropagation();

	$scope.opened = true;
    };

    $scope.dateOptions = {
	formatYear: 'yy',
	startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    
    $scope.authorCollapseSymbol = "+";

    $scope.datePickerCollapseSymbol = "+";

    $scope.authorCollapse = true;

    $scope.handleAuthorCollapse = function() {
	$scope.authorCollapse = !$scope.authorCollapse;
    }

    $scope.datePickerCollapse = true;

    $scope.handleDatePickerCollapse = function() {
	$scope.datePickerCollapse = !$scope.datePickerCollapse;
    }



    $scope.getResultsForKey = function() {
	var key = $scope.authorNameSearchKey;
	if (!key) {
	    $scope.displayedAuthorResults = $scope.allAuthors;
	    return;
	}
	//var localResults = $scope.getResultsForKeyFromCache(key, "author_name");
	var localResults = authorCacheService.getResultsForKeyFromCache(key, searchAuthorResultsMapByNumKeyChars, "author_name");
	
	if (localResults != null) {
	    $scope.displayedAuthorResults = localResults;
	} else {
	    authorCacheService.getResultsForKeyFromRest(key, searchAuthorResultsMapByNumKeyChars, $scope);
	    //$http.get("/api/1.0/authors" + "?author_name=" + key + "&use_contains=true", 
	    //	      {headers: {"Content-Type": "application/json"}}).success(function(data) {
	    //	$scope.displayedAuthorResults = data;
	    //	var keyLength = key.length;
	    //	var searchAuthorResultsMap = null;
	    //	if (keyLength in searchAuthorResultsMapByNumKeyChars) {
	    //	    searchAuthorResultsMap = searchAuthorResultsMapByNumKeyChars[keyLength];
	    //	} else {
	    //	    searchAuthorResultsMap = {};
	    //	    searchAuthorResultsMapByNumKeyChars[keyLength] = searchAuthorResultsMap;
	    //	}
	    //	searchAuthorResultsMap[key] = data;
	    //});
	}
    }

    $scope.getResultsForKeyFromCache = function(key, key_type) {
	if (!key || key == null || key.length <=0 ) {
	    //$scope.displayedAuthorResults = $scope.allAuthors;
	    return $scope.allAuthors;
	} else {
	    var numChars = key.length;
	    if (numChars in searchAuthorResultsMapByNumKeyChars) {
		var searchAuthorResultsMap = searchAuthorResultsMapByNumKeyChars[numChars];
		if (key in searchAuthorResultsMap) {
		    return searchAuthorResultsMap[key];
		}
	    }
	    for (var i = (numChars - 1); i >= 0; i--) {
		var parentKey = key.substring(0,i);
		if (i in searchAuthorResultsMapByNumKeyChars) {
		    var searchAuthorResultsMap = searchAuthorResultsMapByNumKeyChars[i];
		    if (parentKey in searchAuthorResultsMap) {
			result =  getArrayRegexMatches(".*" + key + ".*", searchAuthorResultsMap[parentKey], key_type);
			var searchAuthorResultsMapForKey = null;
			if (numChars in searchAuthorResultsMapByNumKeyChars) {
			    searchAuthorResultsMapForKey = searchAuthorResultsMapByNumKeyChars[numChars];
			} else {
			    searchAuthorResultsMapForKey = {};
			    searchAuthorResultsMapByNumKeyChars[numChars] = searchAuthorResultsMapForKey;
			}
			searchAuthorResultsMapForKey[key] = result;
			return result;
		    }   
		}
	    }
	    
	}
	return null;
    }

    var getArrayRegexMatches = function(regex, array, key_type) {
	var re = new RegExp(regex);
	if (array != null && array.length > 0) {
	    var results = [];
	    var numArrayMembers = array.length;
	    for (var i = 0; i < numArrayMembers; i++) {
		var member = array[i];
		if (member && key_type) {
		    member = member[key_type];
		}
		if (re.test(member)) {
		    results.push(array[i]);
		}
	    }
	    return results;
	}
	return null;
    }

    $scope.$watch("authorNameSearchKey", $scope.getResultsForKey);w

//    $scope.$watch("authorNameSearchKey", function() {alert("Axl is GOD");});

});

testApp.controller('createArticleController', function($scope, $http, commonOJService,  $location, $stateParams) {

    //createEditPreviewArticleStateService.setArticleState(null);

    $("title").text("Opinion Junction");

    fieldsAccessForEditMode = {"topic" : ""};

    $scope.articleFields = ["topic","slug"];

    var setMetadataFieldsOnUi = function(metadata) {
	if (metadata && metadata.hasOwnProperty("robots_tag")) {
	    var robots_tag = metadata.robots_tag.toLowerCase();
	    var robots_tagArray = robots_tag.split(",");
	    if (commonOJService.indexOf(robots_tagArray, "noindex") > -1) {
		$scope.robotnoindex = true;
	    }
	}
    }

    var managedMetadataAttributes = {};
    var getArticleMetadata = function() {
	var metadata = {};
	var robots_tag = "";
	if ($scope.robotnoindex) {
	    robots_tag = robots_tag.concat("noindex, ");
	}
	robots_tag = robots_tag.trim();
	if (robots_tag) {
	    if (robots_tag.substr(robots_tag.length - 1) == ",") {
		robots_tag = robots_tag.substr(0, robots_tag.length - 1);
	    }
	}
	
	metadata["robots_tag"] = robots_tag;
	return metadata;
//	if (oldArticle) {
//	    if ("article_metadata" in oldArticle && oldArticle.hasOwnProperty("article_metadata")) {
//		var oldArticle_metadata = oldArticle.article_metadata;
//		if ("robots_tag" in oldArticle_metadata && oldArticle_metadata.hasOwnProperty("robots_tag") {
//		    var oldRobots_tag = oldArticle.robots_tag;
//		    if (oldRobots_tag) {
//			var oldRobots_tagArray = oldRobots_Tag.split(",");
//			var numOldRobots_tagArray = oldRobots_tagArray.length;
//			if (commonOJService.indexOf("noindex") > -1|| commonOJService.indexOf("NOINDEX") > -1) {
//			    if ($scope.robotsnoindex) {
//				
//			    }
//			}
//			for (var i = 0; i < numOldRobots_tagArray; i++) {
//			    var oldRobots_tagMember = oldRobots_tagArray[i];
//			    
//			}
//		    }
//		}
//
//	    }
//	}
    }

    var resetCategories = function() {
	for (var i = 0; i < numCategories; i++) {
	    if (category === $scope.categories[i].name) {
		$scope.categories[i].selected = true;
		break;
	    }
	}

    }

    $scope.articleAuthor = null;

    $scope.editEnabled = true;

    $scope.displayImagesVisible = false
    $scope.previewDisplayImageCollapseSymbol = "+";

    $scope.robotnoindex = false;

    $scope.toggleDisplayImageDivCollapse = function() {
	$scope.displayImagesVisible = $scope.displayImagesVisible;
	if ($scope.previewDisplayImageCollapseSymbol == "+") {
	    $scope.previewDisplayImageCollapseSymbol = "-";
	} else {
	    $scope.previewDisplayImageCollapseSymbol = "+";
	}

	$scope.displayImagesVisible = !$scope.displayImagesVisible;
    }

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

    var getPrimaryImageBinaryData = function(content) {
	var contentDom = document.createElement( 'div' );
	contentDom.innerHTML = content;
	//var contentDom = new DOMParser().parseFromString(content, "text/xml");
	var imgElements = contentDom.getElementsByTagName("img");
	var numElements = imgElements.length;
	for (var i = 0; i < numElements; i++ ) {
	    var element = imgElements[i];
	    var primaryAttr = element.getAttribute("primaryimage");
	    if (primaryAttr == "true" ) {
		return element.getAttribute("src");
	
		
	    }
	    
	}

	return null;
    }

    var getPrimaryImageName = function(content) {

    }



    $scope.checkImageChange = function() {
	var primaryImage = getPrimaryImageBinaryData($scope.content);
	if (primaryImage != $scope.primaryImage) {
	    $scope.primaryImageChanged = $scope.primaryImageChanged + 1;
	}
    }

    $scope.$watch("primaryImageChanged", function() {
	console.log("primary image changed");

	if ($scope.primaryImageChanged == null || $scope.primaryImageChanged == 0) {
	    $scope.primaryImage = getPrimaryImageBinaryData($scope.content);
	    $scope.primaryImageCropInput = $scope.primaryImage;
	    if (!$scope.headerDataUri) {
		$scope.headerImageCropInput = $scope.primaryImage;
	    }
	    if (!$scope.thumbnailDataUri) {
		$scope.thumbnailImageCropInput = $scope.primaryImage;
	    }
	    return;
	}
	$scope.thumbnailCropStep = 2;
	$scope.headerCropStep = 2;
	$scope.primaryImageCropInput = getPrimaryImageBinaryData($scope.content);
	$scope.headerImageCropInput = $scope.primaryImageCropInput;
	$scope.thumbnailImageCropInput = $scope.primaryImageCropInput
	$scope.primaryImage = $scope.primaryImageCropInput;



	//getPrimaryImageBinaryData($scope.content);

//	if (getPrimaryImageBinaryData($scope.content)) {
//	    $scope.primaryImageCropInput = getPrimaryImageBinaryData($scope.content)
//	}
    });

    $scope.tinymceOptions = {
      // General options
      theme : "modern",
      width : "800px",
      height : "800px",
      plugins : ["advlist","autoresize","autosave","fullscreen","image","media","paste","preview",
		 "searchreplace","spellchecker","visualblocks","visualchars","wordcount", "link", "notwimageupload", "caption", "youtube"],
      toolbar: ["undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | youtube | notwimageupload | notwprimaryimage | notwcaptionimage | caption | attribution"],
      paste_data_images: true, //http://stackoverflow.com/questions/21082723/tinymce-can-no-longer-drag-and-drop-images-after-upgrading-from-version-3-to-ver
      convert_urls: false, //http://www.tinymce.com/tryit/url_conversion.php
      extended_valid_elements: "@[primaryimage|width|height|style]", //http://stackoverflow.com/questions/5444677/wordpress-visual-editor-tinymce-how-to-preserve-custom-attributes
      valid_elements: "@[primaryimage|data*]," + //Your attributes HERE!!!
      "a[name|href|target|title]," +
      "#p,-ol,-ul,-li,br,img[src|style],-sub,-sup,-b,-i," +
      "-span,hr,div[data-label|data-caption-label|data-source-label|data-attribution-label|class]," + 
      "object[width|height|classid|codebase|type|data],param[name|value],iframe[data|width|height|src|allowfullscreen|frameborder|style]," +
      "h1,h2,h3,h4,h5,em,strong,blockquote",
      extended_valid_elements : "embed[src|type|width|height|flashvars|wmode]"

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
	    $("title").text("Opinion Junction - Edit Article");
        } else {
	    scope.mode = "create";
	    $("title").text("Opinion Junction - Create Article");
	    if (!check_create_allowed()) {

		commonOJService.messageForControllers.messageViewErrorMessage = "You don't have permissions to create articles";
		
		scope.pageLeaveBehaviourDisabled = true;

		$location.path("/message");


	    }
	    scope.authorWhoCanEditId = -1;
	    //scope.editingButtonsEnabled = true;
	    scope.editingButtonsDisabled = false;
	    $scope.primaryImageChanged = 0;
	}
    };

    setupEditModeOnInitOJWrapper = function(commonOJService, scope) {
	$scope.setupEditModeOnInit(scope);
    }

    $scope.selectCategoryOnUi  = function(category) {
	var numCategories = $scope.categories.length;
	for (var i = 0; i < numCategories; i++) {
	    if (category === $scope.categories[i].name) {
		$scope.categories[i].selected = true;
		break;
	    }
	}

    }


    $scope.selectArticleCategoriesOnUi = function() {
	var articleCategories = $scope.originalArticle.categories
	var numArticleCategories = articleCategories.length;
	for (var i = 0; i < numArticleCategories; i++) {
	    var articleCategory = articleCategories[i];
	    $scope.selectCategoryOnUi(articleCategory);
	}


    }

    $scope.setStatusText = function(statusValue) {
	var numAllowedStatuses = $scope.allowedStatusValuesMap.length;
	for (var i = 0; i < numAllowedStatuses; i++) {
	    var allowedStatusValueTextArray = $scope.allowedStatusValuesMap[i].split(",");;
	    if (allowedStatusValueTextArray[0] === statusValue) {
		$scope.statusText = allowedStatusValueTextArray[1];
		break;
	    }
	}
    }

    var setSelectedTagsForEditMode = function(article) {
	var articleTags = article.tags;

	if (articleTags != null) {
	    var tagsString = "";
	    var numArticleTags = articleTags.length;
	    if (numArticleTags > 0) {
		tagsString = tagsString + articleTags[0];
	    }
	    for (var i = 1; i < numArticleTags; i++) {
		tagsString = tagsString + "," + articleTags[i];
	    }
	    if (tagsString) {
		$scope.selectedTags = tagsString;
	    }
	}
 
    };

    var getArticleForEditMode = function() {
	$http.get("/api/1.0/articles/" + $scope.articleId, {headers: {"Content-Type": "application/json"}})
	    .success( function(data) {
		if (data.length > 0) {
		    var article = data[0];
		    if (article.hasOwnProperty("header_image") && article.header_image) {
			$scope.headerCropStep=3;
			$scope.headerDataUri = article.header_image;
		    }

		    if (article.hasOwnProperty("thumbnail_image") && article.thumbnail_image) {
			$scope.thumbnailCropStep=3;
			$scope.thumbnailDataUri = article.thumbnail_image;
		    }

		    $scope.topic = article.title;
		    $scope.slug= article.slug;
		    $scope.excerpt = article.excerpt;
		    $scope.articleAuthor = article.author;
		    $scope.content = article.storytext;
		    $scope.primaryImageChanged = 0;
		    $scope.status = article.status;
		    $scope.originalArticle = article;
		    //$scope.content = article.storytext;
		    if ($scope.categories && $scope.categoriesCheckboxDefined !== true) {
			$scope.selectArticleCategoriesOnUi(); 
			$scope.categoriesCheckboxDefined = true;
		    }
		    if ($scope.allowedStatusValuesMap && $scope.initialStatusDefined !==true) {
			$scope.setStatusText($scope.status);	
			$scope.initialStatusDefined = true;
		    }
		    setSelectedTagsForEditMode(article);

		    setMetadataFieldsOnUi(article.article_metadata);
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





    var setCategories = function() {

	$scope.categories = JSON.parse(JSON.stringify(commonOJService.categories)); //Deep copy of commonOJService.categories
	if ($scope.originalArticle && $scope.categoriesCheckboxDefined !== true) {
	    $scope.selectArticleCategoriesOnUi(); 
	    $scope.categoriesCheckboxDefined = true;
	}
    }



    commonOJService.registerCategoryListener(setCategories);
    //$scope.categories = commonOJService.categories;
    $scope.showPopularTags = false;
    $scope.popularTagsDivCollapse = true;

    createArticleModeDict = { "create" : { "articlePostUrl" : "" }, "edit" : { "articlePostUrl" : "" } };

    $scope.setPageLeaveBehaviour = function (commonOJService, scope) {


            scope.$on('$locationChangeStart', function (event, next, current) {
		if (scope.handling) { //Hate this hack but it seems I can't do without it. SHARE!!
	            return;
		} else {
		    scope.handling = true;
		}
		if (scope.pageLeaveBehaviourDisabled != true) {
		    var answer = confirm("Are you sure you want to leave this page?")
		    if (!answer) {
    			event.preventDefault();
		    }
		    scope.handling = false;
		}

            });
	



    };

    $scope.init = function() {
	arrayCallables = [initSidebarCapabilities, setupEditModeOnInitOJWrapper,  $scope.setPageLeaveBehaviour];
	commonOJService.controllerInitOrRedirect(arrayCallables,$scope);
	//$scope.getPopularTags();
	//$scope.getCategories();

    }

    var createTagNameMap = function(tagNameMap, tags) {
	if (tags === null) {
	    tags = $scope.popularTags;
	}

	if (tagNameMap === null) {
	    tagNameMap = {};
	}

	var numTags = tags.length;
	for (var i = 0; i < numTags; i++) {
	    var tag = tags[i];
	    tagNameMap[tag.name] = tag;
	}
	return tagNameMap;
    }

    var checkManuallyEnteredTags = function(tags) {
	if ($scope.selectedTags && tags) {
	    var originalTags = tags;
	    tags = JSON.parse(JSON.stringify(tags)); //http://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript
	    tags.sort(function(tag1,tag2) {
		if (tag1.name > tag2.name) {
		    return 1;
		} else if (tag2.name > tag1.name) {
		    return -1;
		}
		return 0;
	    });
	    var numTags = tags.length;
	    var selectedTagsArray = $scope.selectedTags.split(",");
	    var tagNameMap = {};
	    var tagNameMapCreated = false;
	    selectedTagsArray.sort(function(tag1, tag2) {
		tag1 = tag1.trim();
		tag2 = tag2.trim();
		if (tag1 > tag2) {
		    return 1;
		} else if (tag2 > tag1) {
		    return -1;
		}
		return 0;		
	    });
	    var numSelectedTags = selectedTagsArray.length;
	    for (var i = 0; i < numSelectedTags; i++) {
		var selectedTag = selectedTagsArray[i];
		for (var j = 0; j < numTags; j++) {
		    var tag = tags[j];
		    if (selectedTag && (selectedTag = selectedTag.trim())) {
			if (selectedTag === tag.name) {
			    if (tagNameMapCreated === false) {
				createTagNameMap(tagNameMap, originalTags);
				tagNameMapCreated = true
			    }
			    tagNameMap[tag.name].selected = true;
			    tags = tags.slice(j);
			    break;
			}

		    }
		}
	    }

	}

    }

    $scope.getPopularTags = function() {
	if ($scope.showPopularTags !== true) {
	    $http.get('/api/1.0/tags/?popular=true&num_docs=10').success(function(response) {
		if (response.data && response.data.ok && response.data.ok === "false") {
		
		} else {
		    $scope.popularTags = response;
		    $scope.showPopularTags = true;
		    $scope.popularTagsDivCollapse = false;
		    checkManuallyEnteredTags($scope.popularTags)
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
	if (commonOJService.userData) {
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
		$scope.authorWhoCanEditId = $scope.originalArticle.author.id;
		//$scope.editingButtonsEnabled = true;
		$scope.editingButtonsDisabled = false;
	    }
	    var allowedStatusValuesMap = getAllowedStatusValuesMap();
	    if (allowedStatusValuesMap !==null) {
		$scope.allowedStatusValuesMap = allowedStatusValuesMap;
	    }
	    
	    if ($scope.status) {
		if ($scope.mode === "edit" && $scope.originalArticle && $scope.initialStatusDefined !== true) {
		    $scope.setStatusText($scope.status);	
		    $scope.initialStatusDefined = true;
		}
	    }
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


    $scope.getArticleObject = function() {
	var article = new Object();
	article.title = $scope.topic;
	article.slug = $scope.slug;
	article.excerpt = $scope.excerpt;
	if ($scope.content != $scope.originalContent) {
	    article.storytext = $scope.content;
	}
	article.tags = $scope.getAllSelectedTags($scope.selectedTags, $scope.getSelectedValues($scope.popularTags));

	article.categories = $scope.getSelectedValues($scope.categories);

	article.status = $scope.status;

	if ($scope.primaryImageChanged > 0) {
	    article.header_image = $scope.headerImage;
	    article.thumbnail_image = $scope.thumbnail;
	}

	article.article_metadata = getArticleMetadata();
	return article;

    }

    $scope.previewArticle = function() {
	var article = $scope.getArticleObject();
	var articleState = {};
	articleState.article = article;
	articleState.mode = $scope.mode;
	//createEditPreviewArticleStateService.setArticleState(articleState);
	if ($scope.mode === "create") {
	    var previewWindow = window.open("/user/createarticle/preview");
	    articleState.article.author = $scope.userData;
	    previewWindow.articleState = articleState;
	    //$location.path("/user/createarticle/preview");
	} else {
	    var previewWindow = window.open("/user/editarticle/preview");
	    articleState.article.author = $scope.articleAuthor;
	    previewWindow.articleState = articleState;
	    //$location.path("/user/editarticle/preview");
	}
    }

    $scope.previewArticleFrontPage = function() {
	var article = $scope.getArticleObject();
	var articleState = {};
	articleState.article = article;
	articleState.mode = $scope.mode;
	//createEditPreviewArticleStateService.setArticleState(articleState);
	if ($scope.mode === "create") {
	    var previewWindow = window.open("/user/createarticle/frontpagepreview");
	    articleState.article.author = $scope.userData;
	    previewWindow.articleState = articleState;
	    //$location.path("/user/createarticle/preview");
	} else {
	    var previewWindow = window.open("/user/editarticle/frontpagepreview");
	    articleState.article.author = $scope.articleAuthor;
	    previewWindow.articleState = articleState;
	    //$location.path("/user/editarticle/preview");
	}
    }

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
	var article = $scope.getArticleObject();

	
	permission_logic = {};


	//$scope.editingButtonsEnabled = false;
	$scope.editingButtonsDisabled = true;

	//$scope.$apply();
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
		//$scope.editingButtonsEnabled = true;
		$scope.editingButtonsDisabled = false;
		
            })
            .error(function(data) {
                $scope.submitSuccess = false; $scope.showSuccess = false;
                $scope.submitError = true; $scope.showError = true;
		$scope.setErrorMessage(data);
		//$scope.editingButtonsEnabled = true;
		$scope.editingButtonsDisabled = false;
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
		//$scope.editingButtonsEnabled = true;
		$scope.editingButtonsDisabled = false;
            })
            .error(function(data) {
                $scope.submitSuccess = false; $scope.showSuccess = false;
                $scope.submitError = true; $scope.showError = true;
		$scope.setErrorMessage(data);
		//$scope.editingButtonsEnabled = true;
		$scope.editingButtonsDisabled = false;
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
	if ((typeof data) === "string" || data instanceof String) {
	    $scope.errorMessage = "Something went wrong while submitting your opinion, here are the details, please contact the site administrators with it: " + data;
	}
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
    $("title").text("Opinion Junction - View Articles");
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
	articlesUrl = "/api/1.0/articles/?no_content=true&limit=50";
	if (commonOJService.userData == null) {
	    return;
	}
	if (!(commonOJService.indexOf(commonOJService.userData.user_permissions, "edit_others_articles") > -1 || 
	      commonOJService.indexOf(commonOJService.userData.user_permissions, "publish_others_articles") > -1)) {
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
var SignoutModalInstanceController = function($scope, $modalInstance, $location, $http, commonOJService) {

    $scope.signout = function() {
	    $http.post("/accounts/logout/", {headers: {"Content-Type": "application/json"}})
		.success(function(data){commonOJService.invalidateUserData();$modalInstance.close(true);});
    }

    $scope.closeModal = function() {
	$modalInstance.close();
    }
};

testApp.controller('userController', function($scope, $location, $http, $modal, commonOJService) {

    $scope.sidebarArticleCapabilities = [];
    $scope.sidebarOtherMainCapabilities = [];
    $scope.sidebarAboutusCapabilities = [];
    $scope.sidebarRolesCapabilities = [];


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
    $scope.isAboutusDivCollapsed = true;
    $scope.isRolesDivCollapsed = true;
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

    $scope.signout = function() {
	if ($location.url() && 
	    ($location.url() === "/user/createarticle" || $location.url().indexOf("/user/editarticle/") == 0 )) {
	    	var modalInstance = $modal.open({
		    templateUrl: '/angularstatic/acentral/partials/signout-modal.html',
		    controller: SignoutModalInstanceController,
		    windowClass: 'signout-modal-window',
		    resolve: {
			items: function () {
			    return $scope.items;
			}
		    }
		});

	    modalInstance.result.then(function (signedOut) {
		if (signedOut) {
		    $scope.pageLeaveBehaviourDisabled = true;
		    $location.url("/");
		}
	    });

	} else {
	    $http.post("/accounts/logout/", {headers: {"Content-Type": "application/json"}})
		.success(function(data){commonOJService.invalidateUserData();$location.url("/");});
	}
    }


});

testApp.controller('userSettingsController', function($scope, $location, $http, commonOJService) {

    $("title").text("Opinion Junction - Settings");

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

var SearchModalInstanceController = function($scope, $modalInstance, $http, $location) {
  
    $scope.formData = {};

    $scope.closeModal = function() {
	$modalInstance.close();
    };

    $scope.goToSearchPage = function() {
	$modalInstance.close();
	$location.url("/search?searchString=" + encodeURIComponent($scope.formData.searchString));
    };

};

var ModalInstanceCtrl = function($scope, $modalInstance, $http, $cookies, commonOJService, fbService, fieldPropertiesService) {

    $scope.fbLoginDisabled = fieldPropertiesService.getProperty("fbLoginDisabled");

    var showError = function(errorMessage, onAll) {
	if (onAll) {
	    $scope.errorMessageSignup = $scope.errorMessageSignin = errorMessage;
	} else {
	    if (!signupCollapse) {
		$scope.errorMessageSignup = errorMessage;
	    } else if (!signinCollapse) {
		$scope.errorMessageSignin = errorMessage;
	    }
	}
    }


    $scope.fbLogin = function(nextUrl, action, process) {
	if (fbService.isFBAvailable()) {
	    fbService.login(nextUrl, action, process, [onSuccess]);
	} else {
	    showError("Problems with logging in with Facebook. Log in with Opinion Junction Account instead, or sign up for one", false);
	    fieldPropertiesService.setProperty("fbLoginDisabled", true);
	    $scope.fbLoginDisabled = true;
	}
	
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
				  "fields": [{"id":"id_login_signup"},{"id":"id_email_signup"},
					    {"id":"id_password_signup"},{"id":"id_password_verify_signup"},]}};
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
		console.log(JSON.stringify(data));
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
	    //scope.primaryImageChanged = 0;
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
			if (e.command == "setPrimaryImage") {
			    //console.log("setPrimaryImage called");
			    scope.primaryImageChanged = scope.primaryImageChanged + 1;
			}
			if (!scope.$$phase) {
			    scope.$apply();
			}
		    });
		    ed.on("NodeChange", function(e) {
			console.log('node change event', e);
			ed.save();
			ngModel.$setViewValue(elm.val());
			scope.checkImageChange();
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
		plugins : "advlist autoresize autosave fullscreen image media paste preview searchreplace spellchecker visualblocks visualchars wordcount link notwimageupload caption youtube",
		toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | youtube | notwimageupload | notwprimaryimage | notwcaptionimage | caption | attribution",
		paste_data_images: true, //http://stackoverflow.com/questions/21082723/tinymce-can-no-longer-drag-and-drop-images-after-upgrading-from-version-3-to-ver
		convert_urls: false, //http://www.tinymce.com/tryit/url_conversion.php
		extended_valid_elements: "@[primaryimage|width|height|style]", //http://stackoverflow.com/questions/5444677/wordpress-visual-editor-tinymce-how-to-preserve-custom-attributes
		valid_elements: "@[primaryimage|data*]," + //Your attributes HERE!!!
		"a[name|href|target|title]," +
		    "#p,-ol,-ul,-li,br,img[src|style],-sub,-sup,-b,-i," +
		    "-span,hr,div[data-label|data-caption-label|data-source-label|data-attribution-label|class]," + 
		    "object[width|height|classid|codebase|type|data],param[name|value],iframe[data|width|height|src|allowfullscreen|frameborder|style]," +
		    "h1,h2,h3,h4,h5,em,strong,blockquote",
		extended_valid_elements : "embed[src|type|width|height|flashvars|wmode]"


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
		    if (slideIndex > -1) {
			var articleCategoryName = scope.articles[slideIndex].headerCategory.name;
			var categoryIndex = scope.getCategoryIndex(articleCategoryName);
			commonOJService.focusCategoryLink(categoryIndex);
		    }

		});
		/*elem.on('slide.bs.carousel', function () {
		    alert("Hello From Carousel");
		});*/

		scope.$on("$destroy", function(scope) {
		    commonOJService.blurCategoryLink();
		});
	    }
	}
    }
});


testApp.directive('socialSidebar', function() {
   return {
       scope: {
	   pageurl: "@",
	   article: "=" //it seems this is unavoidable and we can't use "&"
       },
       restrict: 'AE',
       templateUrl: '/angularstatic/socialsidebar/partials/socialsidebar.html',
       compile: function(elem, attrs) {

           return function(scope,elem,attrs) {
	       elem.on('click', function(e){
                   e.preventDefault();
               });
	       //console.log("pageurl: " + scope.pageurl);
	       scope.openShareWindow = function(shareProvider) {
		   var shareUrl = null;
		   if (shareProvider === "facebook") {
		       shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + scope.pageurl;
		   } else if (shareProvider === "twitter") {
		       shareUrl = "https://twitter.com/share?url=" + scope.pageurl;
		   } else if (shareProvider === "googleplus") {
		       shareUrl = "https://plus.google.com/share?url=" + scope.pageurl;
		   } else if (shareProvider === "pinterest") {
		       shareUrl = "http://pinterest.com/pin/create/button/?url=" + scope.pageurl + "&media=" + scope.article.thumbnail_image + 
			   "&description=" + scope.article.excerpt;
		   } else {
		       console.log("Unknow Sharing provider, won't share anything");
		   }
		   var width  = 575,
		   height = 400,
		   left   = ($(window).width()  - width)  / 2,
		   top    = ($(window).height() - height) / 2,
		   url    = shareUrl,
		   opts   = 'status=1' +
                       ',width='  + width  +
                       ',height=' + height +
                       ',top='    + top    +
                       ',left='   + left;

		   window.open(url, 'Social Share Window', opts);
	       }
	    }
	}
   }
});

testApp.directive('svgReplace', function() {
    return {
	restrict: 'AE',
	compile: function(elem, attrs) {
	    var $img = jQuery(elem);
	    var imgID = $img.attr('id');
	    var imgClass = $img.attr('class');
	    var imgURL = $img.attr('src');
	    console.log('in svg-replace compile');
	    jQuery.get(imgURL, function(data) {
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
		var $svg = jQuery(data).find('svg');
		// Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
		// Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }
		// Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);
	    }, 'xml');
	}
    };
});

testApp.directive('hoverSocial', function() {
//http://www.grobmeier.de/angular-js-the-show-on-mouseenter-hide-on-mouseleave-directive-31082012.html#.VEiHTSuSyb8
    return {
       scope: {
	   iframeCollapse: "=",
	   iframeCollapseElement: "@",
	   mouseenter: "=",
	   mouseleave: "="
       },
	compile: function(elem, attrs) {
	    return function(scope,elem,attrs) {

/*		if (!scope.mouseenter || $scope.mouseenter === "true") { */
		    elem.bind('mouseenter', function() {
			scope.$apply(function() {scope.iframeCollapse = false;});
		    });
/*		}		*/
//http://stackoverflow.com/questions/8981463/detect-if-hovering-over-element-with-jquery
//http://stackoverflow.com/questions/16497457/ishover-is-broken-as-of-jquery-1-9-how-to-fix

		elem.bind('mouseleave', function() {
		    if (($("#" + scope.iframeCollapseElement + ":hover").length == 0) && ($($(elem).attr('id') + ":hover").length == 0)) {
			scope.$apply(function() {scope.iframeCollapse = true;});
		    }
		});


	    }
	}
    };
});

testApp.directive('collapseWidth', ['$transition', function ($transition, $timeout) {

    return {
      link: function (scope, element, attrs) {

        var initialAnimSkip = true;
        var currentTransition;

        function doTransition(change) {
          var newTransition = $transition(element, change);
          if (currentTransition) {
            currentTransition.cancel();
          }
          currentTransition = newTransition;
          newTransition.then(newTransitionDone, newTransitionDone);
          return newTransition;

          function newTransitionDone() {
            // Make sure it's this transition, otherwise, leave it alone.
            if (currentTransition === newTransition) {
              currentTransition = undefined;
            }
          }
        }

        function expand() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            expandDone();
          } else {
            element.removeClass('collapse').addClass('collapsing-width');
            doTransition({ width: element[0].scrollWidth + 'px' }).then(expandDone);
          }
        }

        function expandDone() {
          element.removeClass('collapsing-width');
          element.addClass('collapse in');
          element.css({width: 'auto'});
        }

        function collapse() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            collapseDone();
            element.css({width: 0});
          } else {
            // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
            element.css({ width: element[0].scrollWidth + 'px' });
            //trigger reflow so a browser realizes that height was updated from auto to a specific value
            var x = element[0].offsetHeight;

            element.removeClass('collapse in').addClass('collapsing-width');

            doTransition({ width: 0 }).then(collapseDone);
          }
        }

        function collapseDone() {
          element.removeClass('collapsing-width');
          element.addClass('collapse');
        }

        scope.$watch(attrs.collapseWidth, function (shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
}]);

testApp.directive('ojDropdown', function() {
//http://www.grobmeier.de/angular-js-the-show-on-mouseenter-hide-on-mouseleave-directive-31082012.html#.VEiHTSuSyb8
    return {
       restrict: 'AE',
       templateUrl: '/angularstatic/acentral/partials/oj-dropdown.html',
       scope: {
	   members: "=",
	   activeMember: "=",
	   callableOnSelect: "="
       },
	compile: function(elem, attrs) {
	    return function(scope,elem,attrs) {
		scope.memberMetadata = [];
		var numMembers = scope.members.length;
		for (var i = 0; i < numMembers; i++) {
		    var memberMetadataRow = {};
		    if (scope.activeMember != i) {
			memberMetadataRow.ngClass = "inactive";
		    } else {
			memberMetadataRow.ngClass = "active";
		    }
		    scope.memberMetadata[i] = memberMetadataRow;
		}

		scope.dropDownOpened = false;

		var openDropDown = function() {
		    var numMembers = scope.members.length;
		    for (var i = 0; i < numMembers; i++) {
			var memberMetadataRow = scope.memberMetadata[i];
			if (scope.activeMember != i) {
			    memberMetadataRow.ngClass = "inactive-visible";
			} else {
			    memberMetadataRow.ngClass = "active";
			}
		    }

		}

		var closeDropDown = function(activeMemberIndex) {
		    var numMembers = scope.members.length;
		    for (var i = 0; i < numMembers; i++) {
			var memberMetadataRow = scope.memberMetadata[i];
			if (activeMemberIndex != i) {
			    memberMetadataRow.ngClass = "inactive";
			} else {
			    memberMetadataRow.ngClass = "active";
			}
		    }
		    scope.activeMember = activeMemberIndex;

		}

		scope.handleMemberClicked = function(index) {
		    if (!scope.dropDownOpened) {
			openDropDown();
			scope.dropDownOpened = true;
		    } else {
			closeDropDown(index);
			scope.dropDownOpened = false;
			scope.callableOnSelect(index);
		    }
		}
	    }
	}
    }
});

testApp.directive('ojDropdownLi', function() {
    return {
       restrict: 'AE',
       scope: {
	   members: "=",
	   iframeCollapseElement: "@"
       },
	compile: function(elem, attrs) {
	    return function(scope,elem,attrs) {
	    }
	}
    }
});


//http://stackoverflow.com/questions/5445491/height-equal-to-dynamic-width-css-fluid-layout
testApp.directive('imgProportionate', function() {
    return {
       restrict: 'AE',
       scope: {
	   heightRatio: "@",
	   maxMinRule: "@"
       },
	compile: function(elem, attrs) {
	    return function(scope,elem,attrs) {
		var finalHeight = elem.width() * scope.heightRatio;
		elem.css({'height':finalHeight+'px'});
	    }
	}
    }
});
