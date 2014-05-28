(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('coinfu').factory(serviceId,
        ['common', 'config', 'entityManagerFactory', 'authService', '$rootScope', '$http', '$location', datacontext]);

    function datacontext(common, config, emFactory, authService, $rootScope, $http, $location) {
        var entityQuery = breeze.EntityQuery;
        var manager = emFactory.newManager();
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        //var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;


        var service = {
            getAppFilters: getAppFilters,
            getTargets: getTargets,
            getTarget: getTarget,
            getAgeRanges: getAgeRanges,
            getGenderTypes: getGenderTypes,
            saveChanges: saveChanges,
            createTarget: postTarget,
            addTarget: addTarget,
            addScene: addScene,
            saveScene: saveScene,
            attachResource: attachResource,
            dropTarget: dropTarget,
            createSceneAttribute: createSceneAttribute
        };

        return service;

        function getStats()
        {
            //TODO: set this globally for breeze calls
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                headers: {
                    "X-User-Token": $rootScope.token.Token
                }
            };
            var orderBy = 'name';
            var targets;

            return entityQuery.from('Targets')
                .where('enabled','==',true)
                .expand('TargetResource')
                .orderBy(orderBy)
                .toType('Target')
                .using(manager)
                .execute()
                .to$q(querySucceeded, requestFailed);

            function querySucceeded(data) {
                targets = data.results;
                return targets;
            }
        }

//        function createSceneEntity(target)
//        {
//            var scene = manager.createEntity('Scene', {target:target});
//            return scene;
//
//        }

//        function postTarget(uploadResponse) {
//            var target = {};
//            target.Name = uploadResponse.Name;
//            target.Enabled = true;
//            target.TargetResourceId = uploadResponse.ResourceId;
//            target.Description = '';
//            target.Longitude = 0;
//            target.Latitude = 0;
//            target.Altitude = 0;
//
//            var innerconfig = {
//                url: '/api/v1/targets/posttargets',
//                data: target ,
//                method: "POST",
//                headers: {
//                    'X-User-Token': $rootScope.token.Token,
//                    'Accept': 'text/json'
//                }
//            };
//
//            return $http(innerconfig).then(onSuccess, requestFailed);
//
//            function onSuccess(results) {
//                if (results && results.data) {
//                    return results.data;
//                }
//                return null;
//            }
//        }
//
//        function addScene(target) {
//            var scene = {};
//            scene.TargetId = target.targetId;
//            scene.Name = 'New Scene';
//            scene.TargetTypeId = 3;
//
//            var innerconfig = {
//                url: '/api/v1/scenes/postscene',
//                data: scene,
//                method: "POST",
//                headers: {
//                    'X-User-Token': $rootScope.token.Token,
//                    'Accept': 'text/json'
//                }
//            };
//
//            return $http(innerconfig).then(onSuccess, requestFailed);
//
//            function onSuccess(results) {
//
//                if (results && results.data) {
//                    return results.data;
//                }
//                return null;
//            }
//        }
//
//        function saveScene(scene) {
//
//            var innerconfig = {
//                url: '/api/v1/scenes/putscene',
//                data: scene,
//                method: "POST",
//                headers: {
//                    'X-User-Token': $rootScope.token.Token,
//                    'Accept': 'text/json'
//                }
//            };
//
//            return $http(innerconfig).then(onSuccess, requestFailed);
//
//            function onSuccess(results) {
//
//                if (results && results.data) {
//                    return results.data;
//                }
//                return null;
//            }
//        }
//
//        function attachResource(sceneId,resourceId) {
//
//            return manager.fetchEntityByKey('Scene', sceneId)
//                .then(querySucceeded).fail(requestFailed);
//
//            function querySucceeded(data) {
//                if(data)
//                {
//                    var scene = data.entity;
//                    scene.assetResourceId = resourceId;
//                    return saveChanges(scene);
//                }
//                return $q.when('no data');
//            }
//        }
//
//        function getAppFilters() {
//            //TODO: set this globally for breeze calls
//            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
//            ajaxAdapter.defaultSettings = {
//                headers: {
//                    "X-User-Token": $rootScope.token.Token
//                }
//            };
//
//            return entityQuery.from('AppFilters')
//                .using(manager)
//                .execute()
//                .to$q(querySucceeded, requestFailed);
//
//            function querySucceeded(data) {
//                if (data) {
//                    return data.results[0];
//                }
//                return null;
//            }
//        }
//
//        function getTarget(id) {
//            //TODO: set this globally for breeze calls
//            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
//            ajaxAdapter.defaultSettings = {
//                headers: {
//                    "X-User-Token": $rootScope.token.Token
//                }
//            };
//
//            return entityQuery.from('Targets')
//                .where('enabled', '==', true)
//                .where('targetId', '==', id)
//                .expand('TargetResource')
//                .expand(['Scenes', 'Scenes.AssetResource', 'Scenes.SceneAttributes'])
//                .toType('Target')
//                .using(manager)
//                .execute()
//                .to$q(querySucceeded, requestFailed);
//
//            function querySucceeded(data) {
//                if(data)
//                {
//                    var target = data.results[0];
//                    return target;
//                }
//                return null;
//            }
//        }
//
//        function createSceneAttribute(name) {
//            return manager.createEntity('SceneAttribute', {name: name});
//        }
//
//        function saveChanges() {
//            if (manager.hasChanges()) {
//                return manager.saveChanges()
//                    .to$q(saveSuccess, requestFailed);
//            } else {
//                log("No Changes");
//                return $q.when('No Changes');
//            }
//        }
//
//        function dropTarget(id, cb) {
//            var target = manager.getEntityByKey('Target', id);
//            target.enabled = false;
//            manager.saveChanges();
//            return cb;
//
//            //var headers = { headers: { 'X-User-Token': $rootScope.token.Token } };
//            ////var data = { id: id };
//
//            //return $http.delete('/api/v1/targets/' + id, headers).then(deleteSucceeded, deteteFailed);
//
//            //function deleteSucceeded(data) {
//            //    log("Target Deleted");
//            //}
//
//            //function deteteFailed(error) {
//            //    var msg = config.appErrorPrefix + 'Target Delete Failed.' + error.message;
//            //    logError(msg, 'ERROR');
//            //    throw error;
//            //}
//        }
//
//        function addTarget(target) {
//            var so = new breeze.SaveOptions({ resourceName: "addTarget" });
//            var targets = [];
//            targets.push(target);
//            return manager.saveChanges(targets,so);
//        }

        function requestSucceded() {

        }

        function requestFailed(error) {
            if (error.status == 401) {
                logError('Error: Unauthorized, please login again.', 'ERROR', true);
                $location.path('/login');
            } else {
                var msg = 'Error: ' + error.message;
                logError(msg, 'ERROR', true);
            }

            return $q.reject(error);
        }

//        function getGenderTypes() {
//            return [
//                { "gender": 0, "name": "Both" },
//                { "gender": 1, "name": "Male" },
//                { "gender": 2, "name": "Female" }
//            ];
//        }
//
//        function getAgeRanges() {
//            return ["", "0-21", "22-34", "35-44", "45-54", "55-64", "65-150"];
//        }
    }
})();