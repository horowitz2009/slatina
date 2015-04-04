angular.module('felt.shop.service', [])

// A RESTful factory for retrieving contacts from 'contacts.json'
  .factory('Shop', ['$http', 'utils', function ($http, utils) {
    var pathCategories = 'assets/categories.json';
    var pathAllColors = 'assets/allColors.json';
    var categoriesPromise = null;
    var allColorsPromise = null;
    var factory = {};
    
    factory.getCategories = function() {
      if (categoriesPromise == null) {
        console.log("READING " + pathCategories + " ...");
        categoriesPromise = $http.get(pathCategories).then(function (resp) {
          var res = resp.data.categories;
          enrich(res);
          return res;
        }); 
      }
      return categoriesPromise;  
    }

    factory.getAllColors = function() {
      if (allColorsPromise == null) {
        console.log("READING " + pathAllColors + " ...");
        allColorsPromise = $http.get(pathAllColors).then(function (resp) {
          return resp.data;
        }); 
      }
      return allColorsPromise;  
    }
    
    factory.clearCache = function() {
      dataPromise = null;
    }
    
    factory.extractCatMenuItems = function(categories) {
      var items = [];
      for(var i = 0; i < categories.length; i++) {
        items.push(
            { "name": categories[i].name,
              "id": categories[i].id,
              "cnt": categories[i].products.length
            });  
      }
      return items;
    }
    
    factory.extractOrigins = function(category) {
      var origins = [];
      if (category !== null) {
        category.products.forEach(function(p){
          var found = false;
          for (var i = 0; i < origins.length; i++) {
            if (origins[i].name === p.origin) {
              found = true;
              origins[i].cnt = origins[i].cnt + 1;
              break;
            }
          }
          
          if (!found) 
            origins.push({ "name": p.origin, 'value': false, 'cnt': 1 });
          
        });
      }
      return origins;
    }
    
    factory.extractColors = function(category) {
      var colors = [];
      
      if(category !== null)
        category.products.forEach(function(p){
          var found = false;
          for (var i = 0; i < colors.length; i++) {
            if (colors[i].name === p.color) {
              found = true;
              colors[i].cnt = colors[i].cnt + 1;
              break;
            }
          }
          
          if (!found) 
            colors.push({ "name": p.color, 'value': false, 'cnt': 1 });
        });
      
      return colors;
    }
    
    
    
    return factory;
  }]);
  
  
  function enrich(categories) {
    if (categories) {
      categories.forEach(function (cat) {
        for(var i = 0; i < cat.products.length; i++) {
          var p = cat.products[i];
          if (!p.categoryId)
            p.categoryId = cat.id;
          if (!p.fullId) 
            p.fullId = p.categoryId + '-' + p.id;
        }
      });
    }
  }
