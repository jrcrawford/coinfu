angular.module( 'coinfu.nav', ['ui.router', 'ui.bootstrap'])

/**
 * And of course we define a controller for our route.
 */
    .controller('NavCtrl', function NavController($scope, $modal, $state) {
        "use strict";

        //$scope.items = ['item1', 'item2', 'item3'];

        $scope.openModal = function () {

            var modalInstance = $modal.open({
                templateUrl: 'common/modal.html',
                controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function (address) {
                $state.go('minerstats', {'address': address});
                //$scope.selected = address;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
    })
;

var ModalInstanceCtrl = function ($scope, $modalInstance) {

    $scope.selected = {
        address: ''
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.address);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};