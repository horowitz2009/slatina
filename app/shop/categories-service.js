angular.module('felt.categories.service', [])

// A RESTful factory for retrieving contacts from 'contacts.json'
  .factory('Categories', ['$http', 'utils', function ($http, utils) {
    var path = 'assets/categories.json';
    var categories = $http.get(path).then(function (resp) {
      return resp.data.categories;
    });

    var factory = {};
    factory.all = function () {
      return categories;
    };

    factory.getCategoryById = function (id) {
      return categories.then(function (data) {
        return utils.findById(data, id);
      })
    };
    return factory;
  }]);
