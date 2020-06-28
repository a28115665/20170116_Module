"use strict";

angular.module('app').controller("LanguagesCtrl",  function LanguagesCtrl($scope, $rootScope, $log, Language, APP_CONFIG){

    $rootScope.lang = $rootScope.lang || {};
    
    Language.getLanguages(function(data){

        var languageNumber = 0;
        data.forEach(function(value, index, fullArray){
            if(value.key == APP_CONFIG.view_lang){
                languageNumber = index;
            }
        });

        $rootScope.currentLanguage = data[languageNumber];

        $rootScope.languages = data;

        Language.getLang(data[languageNumber].key, function(data){

            $rootScope.lang = toLowerCaseKeys(data);
        });

    });

    function toLowerCaseKeys(obj) {
        return Object.keys(obj).reduce(function(accum, key) {
            accum[key.toLowerCase()] = obj[key];
            return accum;
        }, {});
    }

    $scope.selectLanguage = function(language){
        $rootScope.currentLanguage = language;
        
        Language.getLang(language.key,function(data){

            $rootScope.lang = toLowerCaseKeys(data);
            
        });
    }

    $rootScope.getWord = function(key){
        if(angular.isDefined($rootScope.lang[key.toLowerCase()])){
            return $rootScope.lang[key.toLowerCase()];
        } 
        else {
            return key;
        }
    }

});