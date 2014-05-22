var ojControllers = angular.module('ojControllers',[]);

function HomeControllerExt($scope){
    //$scope.totalResults = 5;
    $scope.message="Welcome to Opinion Junction";
}

ojControllers.controller('TestController',['$scope',
    function TestController($scope){
        $scope.totalResults = 5;
    }]
);
	      
ojControllers.controller('HomeController',['$scope',
    function HomeController($scope){
        $scope.message="Welcome to Opinion Junction";
    }]
);

ojControllers.controller('ArticleController',['$scope',
    function ArticleController($scope){
        $scope.message="Welcome to Opinion Junction's First Article";
    }]
);