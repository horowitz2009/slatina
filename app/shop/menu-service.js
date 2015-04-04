angular.module('felt.menu.service', [])
// A RESTful factory for retrieving menu items from 'menu.json'

    .factory('Menus', ['$http', function ($http) {

        var path = 'assets/menu.json';
        var data = $http.get(path).then(function (resp) {
            return resp.data;
        });


        var req = $http.get(path);

        var factory = {};

        factory.getMenu = function () {
            return data;
        };

        factory.getReq = function () {
            return req;
        };


        return factory;

    }]);

