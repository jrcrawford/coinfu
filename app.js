//angular.module('coinfu', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.route', 'coinfu.header', 'coinfu.home', 'coinfu.articles', 'coinfu.stats']);

//angular.module('coinfu.header', []);
//angular.module('coinfu.home', []);
//angular.module('coinfu.articles', []);
//angular.module('coinfu.stats', []);

angular.module( 'coinfu', [
        'coinfu.directives',
        'coinfu.filters',
        'coinfu.service',
        'coinfu.nav',
        'coinfu.home',
        'coinfu.poolstats',
        'coinfu.minerstats',
        'ui.router'
    ])

    .config( function coinFuConfig ( $stateProvider, $urlRouterProvider ) {
        $urlRouterProvider.otherwise( '/' );
    })

    .run( function run () {
    })

    .controller( 'coinfuCtrl', function coinfuCtrl ( $scope, $location, $window ) {
        $scope.showMaxNav = false;
        $scope.toggleNav = function() {
            $scope.showMaxNav = $scope.showMaxNav === false ? true: false;
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if ( angular.isDefined( toState.data.pageTitle ) ) {
                $scope.pageTitle = "CoinFu | " + toState.data.pageTitle;
            }

            $window.ga('send', 'pageview', { page: $location.path() });
        });
    })

;
