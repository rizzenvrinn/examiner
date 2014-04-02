'use strict';

angular.module('app.blueprints.create')

   .factory('NewBlueprint', [
   '$resource', '$rootScope', 'webStorage',
   function($resource, $rootScope, webStorage) {

      var Blueprint = (function() {

         var api = {};

         api.data = {
            subject: null,
            date: new Date(),
            lang: 'en',
            lede: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, quidem, ullam dolorum expedita aliquam maiores distinctio esse repudiandae totam magnam saepe iusto ipsam nam a libero suscipit enim architecto nobis!',
            sections: []
         };

         api.clear = function() {
            api.data = {
               subject: null,
               date: new Date(),
               lang: 'en',
               sections: []
            };
         };

         api.save = function() {
            var regExpHTML = /(<([^>]+)>)/g;
            api.data.sections.forEach(function(section) {
               section.questions.forEach(function(question) {
                  question.body.forEach(function(chunk) {
                     if (chunk.datatype === 'code') {
                        chunk.content = chunk.content.replace(regExpHTML, '');
                     }
                  });
                  question.answer.forEach(function(chunk) {
                     if (chunk.datatype === 'code') {
                        chunk.content = chunk.content.replace(regExpHTML, '');
                     }
                  });
               });
            });
            var serializedData = angular.toJson(api.data);//.replace(/(<([^>]+)>)/g, '');
            webStorage.add('blueprint', serializedData);
            return serializedData;
         };

         (function init() {
            var storedSession = angular.fromJson(webStorage.get('blueprint'));
            if (storedSession) {
               api.data = storedSession;
               //webStorage.remove('blueprint');
               api.data.date = new Date(api.data.date);
            }
         })();

         return api;

      })();

      $rootScope.$on('save', Blueprint.save);

      return Blueprint;

   }]);