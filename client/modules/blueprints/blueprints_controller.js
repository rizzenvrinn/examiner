'use strict';

angular.module('app.blueprints')

   .controller('BlueprintsController',
   ['$scope', '$stateParams', '$state', 'Blueprints',
   function($scope, $stateParams, $state, Blueprints) {

      $scope.subject = $stateParams.subject;

      $scope.blueprints = Blueprints.query({
         fields: 'subject,date,lang'
      }, function(blueprints) {

         blueprints = _.groupBy(blueprints, function(blueprint) {
            return blueprint.subject;
         });

         var subjects = _.keys(blueprints);

         if (subjects.length === 1) {
            $scope.subject = subjects[0];
         }

         if ($scope.subject) {
            $scope.items = blueprints[$scope.subject];
         } else {
            $scope.items = subjects;
         }

      });

   }])

   .controller('BlueprintController',
   ['$scope', '$stateParams', '$state', 'Blueprint', 'NewBlueprint', 'Modal',
   function($scope, $stateParams, $state, Blueprint, NewBlueprint, Modal) {

      $scope.blueprint = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      }, function(blueprint) {
         $scope.editable = moment(blueprint.date) > moment();
      });

      $scope.copyQuestion = function(question) {
         var sections = NewBlueprint.data.sections;
         sections[sections.length - 1].questions.push(question);
      };

      $scope.clone = function() {
         Modal.open('confirm', 'Are you sure you want to clone the blueprint? Any work in-progress will be overwritten.', function(confirmed) {
            if (confirmed) {
               NewBlueprint.data.lede = $scope.blueprint.lede;
               NewBlueprint.data.sections = angular.fromJson(JSON.stringify($scope.blueprint.sections, function stripJunk(key, value) {
                  if (/^[\$_]/.test(key)) {
                     return undefined;
                  }
                  return value;
               }));
               $state.go('examTerms');
               }
         }, 'Clone');
      };

      $scope.edit = function() {
         NewBlueprint.data = angular.fromJson(angular.toJson($scope.blueprint));
         NewBlueprint.isOngoing = true;
         $state.go('examTerms');
      };

   }]);