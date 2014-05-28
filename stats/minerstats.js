angular.module( 'coinfu.minerstats', [
    'ui.router',
    'ngResource',
    'angles',
    'angularMoment'
])

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'minerstats', {
            url: '/minerstats/:address',
            templateUrl: 'stats/minerstats.html',
            controller: 'MinerStatsCtrl',
            data:{ pageTitle: 'Miner Stats' }
        });
    })

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'userstats', {
            url: '/userstats/:address',
            templateUrl: 'stats/minerstats.html',
            controller: 'MinerStatsCtrl',
            data:{ pageTitle: 'Miner Stats' }
        });
    })

    .controller('MinerStatsCtrl', ['$resource', '$scope', '$stateParams', function MinerStatsController( $resource, $scope, $stateParams ) {
        "use strict";
        $scope.profitability = 0.0;
        $scope.profitabilityChange = 0.0;
        $scope.profitabilityWeek = 0.0;
        $scope.profitabilityChangeWeek = 0.0;
        $scope.hashrate = 0;
        $scope.miner = []

        var twitter = $resource('/twitter', {});
        twitter.query({}, function(res) {
            $scope.tweets = res;
        });

        $scope.balances = {'exchanged': 0, 'unexchanged': 0, 'immature': 0};
        var currentBalances = $resource('/balances/current/' + $stateParams.address, {});
        currentBalances.query({}, function(res) {
            $scope.balances = {'exchanged': res[0].exchanged, 'unexchanged': res[0].unexchanged, 'immature': res[0].immature};
        });

        var hashrate = $resource('/hashrate/' + $stateParams.address, {});
        hashrate.query({}, function(res) {
            $scope.hashrate = res[0].hashrate;
        });

        var payments = $resource('/payments/' + $stateParams.address, {});
        payments.query({}, function(res) {
            $scope.payments = res;

            var totalPayments = 0;
            for (var i = 0; i<res.length; i++){
                totalPayments += res[i].payment;
            }

            $scope.totalPayments = totalPayments;
        });

        var period1Hours = 24;
        var period2Hours = 120;
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