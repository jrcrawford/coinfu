//Setting up route
angular.module('coinfu').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
//        when('/articles', {
//            templateUrl: 'views/articles/list.html'
//        }).
//        when('/articles/create', {
//            templateUrl: 'views/articles/create.html'
//        }).
//        when('/articles/:articleId/edit', {
//            templateUrl: 'views/articles/edit.html'
//        }).
//        when('/articles/:articleId', {
//            templateUrl: 'views/articles/view.html'
//        }).
        when('/', {
            templateUrl: 'views/home.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('coinfu').config(['$locationProvider',
    function($locationProvider) {
        //$locationProvider.hashPrefix("!");
    }
]);