/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'coinfu.poolstats', [
        'ui.router',
        'ngResource',
        'angles',
        'angularMoment',
        'dangle'
    ])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'stats', {
            url: '/stats',
            templateUrl: 'stats/poolstats.html',
            controller: 'StatsCtrl',
            data:{ pageTitle: 'Pool Stats' }
            });
    })

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'poolStats', {
            url: '/poolstats',
            templateUrl: 'stats/poolstats.html',
            controller: 'StatsCtrl',
            data:{ pageTitle: 'Pool Stats' }
        });
    })

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'adminStats', {
            url: '/adminstats',
            templateUrl: 'stats/poolstats.html',
            controller: 'StatsCtrl',
            data:{ pageTitle: 'Pool Stats' }
        });
    })

/**
 * And of course we define a controller for our route.
 */
    .controller('StatsCtrl', ['$http', '$resource', '$scope', '$state', 'socket', function StatsController( $http, $resource, $scope, $state, socket ) {
        "use strict";
        $scope.address = "Stats Controller";
        $scope.profitability = 0.0;
        $scope.profitabilityChange = 0.0;
        $scope.profitabilityWeek = 0.0;
        $scope.profitabilityChangeWeek = 0.0;
        $scope.hashrate = 0;
        $scope.miners = [];

//        socket.on('hashrate', function (data) {
//            console.log(data);
//            //$scope.hashrate = data.hashrate;
//        });
//
//        $scope.$on('$destroy', function (event) {
//            socket.removeListener('hashrate');
//            // or something like
//            // socket.removeListener(this);
//        });

        var twitter = $resource('/twitter', {});
        twitter.query({}, function(res) {
            $scope.tweets = res;
        });

        //if ($state.current.name !== 'adminStats') return;

        $scope.balances = {'exchanged': 0, 'unexchanged': 0, 'immature': 0};
        var currentBalances = $resource('/balances/current', {});
        currentBalances.query({}, function(res) {
            $scope.balances = {'exchanged': res[0].exchanged, 'unexchanged': res[0].unexchanged, 'immature': res[0].immature};
        });

        var hashrate = $resource('/hashrate', {});
        hashrate.query({}, function(res) {
            $scope.hashrate = res[0].hashrate;
        });

        $scope.hashrates = [5,5,2,1,4,4,7,5,6,9,6,4,3,3,2,4];

        var blocks = $resource('/blocks', {});
        blocks.query({}, function(blocks) {
            //select coin, txid, block_hash, creation_time, orphan_time, mature_time, send_tx_time, trade_complete_time, credited_time
            for (var i = 0; i < blocks.length; i++){
//                if (blocks[i].credited_time){
//                    blocks[i].status = "Credited";
//                } else
                if (blocks[i].trade_complete_time){
                    blocks[i].status = "Traded";
                } else if (blocks[i].send_tx_time){
                    blocks[i].status = "Sent";
                } else if (blocks[i].mature_time){
                    blocks[i].status = "Mature";
                } else if (blocks[i].orphan_time){
                    blocks[i].status = "Orphaned";
                } else if (blocks[i].creation_time){
                    blocks[i].status = "Found";
                } else {
                    blocks[i].status = "Undefined";
                }
            }

            $scope.blocks = blocks;
        });

        var payments = $resource('/payments', {});
        payments.query({}, function(res) {
            $scope.totalPayments = res[0].total_payments;
        });

        var miners = $resource('/miners', {});
        miners.query({}, function(res) {
            $scope.miners = res;
        });

        var period1Hours = 24;
        var period2Hours = 120;
//        var profitabilityHours = $resource('/profitability/' + (period2Hours*2) + '/hourly', {});
//        profitabilityHours.query({}, function(res) {
//            var day1btc = 0.0;
//            var day1mhs = 0.0;
//            var day2btc = 0.0;
//            var day2mhs = 0.0;
//            var week1btc = 0.0;
//            var week1mhs = 0.0;
//            var week2btc = 0.0;
//            var week2mhs = 0.0;
//
//            for (var i = 0; i < res.length; i++){
//                if (i < period1Hours){
//                    day1btc += res[i].btc;
//                    day1mhs += res[i].mh_s;
//                } else if (i >= period1Hours && i < period1Hours*2) {
//                    day2btc += res[i].btc;
//                    day2mhs += res[i].mh_s;
//                }
//
//                if (i < period2Hours){
//                    week1btc += res[i].btc;
//                    week1mhs += res[i].mh_s;
//                } else {
//                    week2btc += res[i].btc;
//                    week2mhs += res[i].mh_s;
//                }
//            }
//            var day1 = day1btc / day1mhs * 24;
//            var day2 = day2btc / day2mhs * 24;
//            var week1 = week1btc / week1mhs * 24;
//            var week2 = week2btc / week2mhs * 24;
//            var dayChange = (day1 - day2)/day2;
//            var weekChange = (week1 - week2)/week2;
//
//            $scope.dayHours = period1Hours;
//            $scope.profitability = day1;
//            $scope.profitabilityChange = dayChange;
//            $scope.weekHours = period2Hours;
//            $scope.profitabilityWeek = week1;
//            $scope.profitabilityChangeWeek = weekChange;
//        });

        var profitabilityHours = $resource('/profitability/' + (period2Hours*2) + '/hourly', {});
        profitabilityHours.query({}, function(res) {
            var day1btc = 0.0;
            var day1mhs = 0.0;
            var day2btc = 0.0;
            var day2mhs = 0.0;
            var week1btc = 0.0;
            var week1mhs = 0.0;
            var week2btc = 0.0;
            var week2mhs = 0.0;

            for (var i = 0; i < res.length; i++){
                if (i < period1Hours){
                    day1btc += res[i].btc;
                    day1mhs += res[i].mh_s;
                } else if (i >= period1Hours && i < period1Hours*2) {
                    day2btc += res[i].btc;
                    day2mhs += res[i].mh_s;
                }

                if (i < period2Hours){
                    week1btc += res[i].btc;
                    week1mhs += res[i].mh_s;
                } else {
                    week2btc += res[i].btc;
                    week2mhs += res[i].mh_s;
                }
            }
            var day1 = day1btc * 86400 / day1mhs;
            var day2 = day2btc * 86400 / day2mhs;
            var week1 = week1btc * 86400 / week1mhs;
            var week2 = week2btc * 86400 / week2mhs;
            var dayChange = (day1 - day2)/day2;
            var weekChange = (week1 - week2)/week2;

            $scope.dayHours = period1Hours;
            $scope.profitability = day1;
            $scope.profitabilityChange = dayChange;
            $scope.weekHours = period2Hours;
            $scope.profitabilityWeek = week1;
            $scope.profitabilityChangeWeek = weekChange;
        });
    }])
;