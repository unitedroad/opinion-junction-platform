var testApp = angular.module('testApp', ['ngRoute', 'ui.bootstrap', 'ngCookies']);

testApp.config(function($routeProvider, $locationProvider, $httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        
  $routeProvider
	.when('/', {
	    templateUrl: '/angularstatic/home/partials/index.html',
	    controller: 'mainController'
	})
	.when('/article', {
	    templateUrl: '/angularstatic/article/partials/article.html',
	    controller: 'articleController'
	})
	.when('/signin', {
	    templateUrl: '/angularstatic/signin/partials/index.html',
	    controller: 'signinController'
	})
    	.when('/user/settings', {
	    templateUrl: '/angularstatic/usersettings/partials/index.html',
	    controller: 'userSettingsController'
	})
	.when('/user/createarticle', {
	    templateUrl: '/angularstatic/createarticle/partials/index.html',
	    controller: 'createArticleController'
	}).when('/user/articles', {
	    templateUrl: '/angularstatic/articleslist/partials/index.html',
	    controller: 'viewArticlesController'
	}).when('/user/editarticle', {
	    templateUrl: '/angularstatic/createarticle/partials/index.html',
	    controller: 'createArticleController'
	});
    $locationProvider.html5Mode(true);




}).
    run([
	'$http', 
	'$cookies', 
	function($http, $cookies) {
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
	    
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

    serviceInstance.userData = null;


    serviceInstance.sidebarArticlePermissions = 
	{"create_articles" : {"id" : "create_articles", "title" : "Create Article", "content" : "Create Article", "url" : "/user/createarticle" }
	 ,"edit_articles" : {"id" : "edit_articles", "title" : "View Articles", "content" : "View Articles", "url" : "/user/articles"}};


    serviceInstance.getKeys = function(obj) {
	var keys = [];
	for(var key in obj){
	    keys.push(key);
	}
	return keys;

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


    serviceInstance.controllerInit = function() {

	$http.get('/api/1.0/authors/loggedin/self/').then(function(response) {
	    if (response.data.ok && response.data.ok === "false") {

	    } else if (response.data.id && response.data.id!=null){
		serviceInstance.userData = response.data;
	    }
	});

    }

    serviceInstance.controllerInitOrRedirect = function(arrayCallables, scope) {

	$http.get('/api/1.0/authors/loggedin/self/').then(function(response) {
	    if (response.data.ok && response.data.ok === "false") {
		window.location.href="/accounts/login?next=" + $location.path();		
	    } else if (response.data.id && response.data.id!=null){
		serviceInstance.userData = response.data;
		for (var i = 0; i < arrayCallables.length; i++) {
		    arrayCallables[i](serviceInstance, scope);
		}
	    }  else {
		window.location.href="/accounts/login?next=" + $location.path();
	    }
	});

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

    serviceInstance.messageForViewArticlesController = "";

    serviceInstance.getPath = function(fullUrl) {
	var baseLen = $location.absUrl().length - $location.url().length;
	return fullUrl.substring(baseLen);
    }

    return serviceInstance;

    invalidateUserData = function () {

    };


});

testApp.controller('testController', function($scope) {
    $scope.totalResults = 5;
    $scope.message = "Welcome to Opinion Junction";
});

testApp.controller('mainController', function($scope, $http, $modal, commonOJService) {

    $scope.rightNavBar = "signinNavBar.html";
    $scope.message = "Welcome to Opinion Junction!";
    $scope.totalResults = 5;
    $scope.userData = null;
    $scope.articles = [{
	"name": "Article 1",
	"text": "Article 1 text",
	"image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rummu_aherainem%C3%A4gi2.jpg/1024px-Rummu_aherainem%C3%A4gi2.jpg"
    }, {
	"name": "Article 2",
	"text": "Article 2 text",
	"image": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Prinzenbau%2C_24.jpg/1024px-Prinzenbau%2C_24.jpg"
    }];

    $scope.signinModal = function() {
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
		$scope.rightNavBar = "loggedInNavBar.html";
	    }
        });

    };


    $scope.initFunction = function() {


	    $http.get('/api/1.0/authors/loggedin/self/').then(function(response) {
		if (response.data.ok && response.data.ok === "false") {

		} else if (response.data.id && response.data.id!=null){
		    $scope.rightNavBar = "loggedInNavBar.html";
		    $scope.userData = response.data;
		    commonOJService.userData = response.data;
		}
	    });
	
    };

});

testApp.controller('articleController', function($scope) {
    $scope.message = "Welcome to Opinion Junction's First Article";
});

testApp.controller('signinController', function($scope) {
    $scope.message = "Welcome to Opinion Junction's First Article";
});

testApp.controller('createArticleController', function($scope, $http, commonOJService, $location, $rootScope) {
    $scope.message = "Welcome to Opinion Junction's First Article";
    $scope.sidebarArticleCapabilities = [];

    $scope.invitationDivCollapse = false;

    $scope.popularTags = [];
    $scope.categories = [];

    $scope.showPopularTags = false;
    $scope.popularTagsDivCollapse = true;

    createArticleModeDict = { "create" : { "articlePostUrl" : "" }, "edit" : { "articlePostUrl" : "" } };

    $scope.init = function() {
	arrayCallables = [initSidebarCapabilities];
	commonOJService.controllerInitOrRedirect(arrayCallables,$scope);
	//$scope.getPopularTags();
	$scope.getCategories();

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

    $scope.getCategories = function(){
	$http.get('/api/1.0/categories/').success(function(response) {
	    if (response.data && response.data.ok && response.data.ok === "false") {
		
	    } else {
		    $scope.categories = response;
	    }
	});
    }


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

    $scope.mode = "create";

    $scope.activateItem = function(id) {
            
        $scope.activeItem = id;
    };
            
    $scope.statusText = "Draft";

    $scope.status = "draft";

    $scope.allowedStatusValuesMap = ["draft,Draft", "pending_review,Pending Review", "published,Published" ]; 

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
    
    $scope.submitArticle = function() {
	validationResult = $scope.validateInputs();
	if (validationResult.error == true)
	    return;
	article = new Object();
	article.title = $scope.topic;
	article.slug = $scope.slug;
	article.excerpt = $scope.excerpt;
	article.storytext = $scope.content;
	article.tags = $scope.getAllSelectedTags($scope.selectedTags, $scope.getSelectedValues($scope.popularTags));

	article.categories = $scope.getSelectedValues($scope.categories);

	article.status = $scope.status;

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

    $scope.$on('$locationChangeStart', function (event, next, current) {
        var answer = confirm("Are you sure you want to leave this page?")
        if (!answer) {
	    event.preventDefault();
        }
    });

    

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

testApp.controller('userSettingsController', function($scope, $location, commonOJService) {

    $scope.sidebarArticleCapabilities = [];

    $scope.init = function() {
	arrayCallables = [initSidebarCapabilities];
	commonOJService.controllerInitOrRedirect(arrayCallables,$scope);

        if (commonOJService.userData == null) {
        	//$location.path("/accounts/login?login_redirect_url=/"); 
        } else {

	}
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

var ModalInstanceCtrl = function($scope, $modalInstance, $http, $cookies, commonOJService) {


    $scope.message="";
    $scope.errorMessage = "";
    $scope.loginFormData = {};

  // process the form
    $scope.processLoginForm = function() {
	$http({
	    method: 'POST',
	    url: '/accounts/login/',
	    data: $.param($scope.loginFormData) + '&csrfmiddlewaretoken=' + $cookies.csrftoken, // pass in data as strings
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		//'csrfmiddlewaretoken' : $cookies.csrftoken ,
		
	    } // set the headers so angular passing info as form data (not request payload)
	})
	    .success(function(data) {
		console.log(data);

		if (!data.success) {
          // if not successful, bind errors to error variables
		    $scope.errorMessage = data.form_errors;
		} else {
          // if successful, bind success message to message
		    $scope.message = data.html;
		}

		try {
		    resultJson = JSON.parse(data.html);
		    commonOJService.userData = resultJson;
		    isLoggedIn = resultJson.code!=null && resultJson.code === "login_successful";
		    $modalInstance.close(isLoggedIn);
		} catch (exception) {
		 //log exception, probably becasue double sign in which we haven't handled properly   
		}
	    });
    };
};





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