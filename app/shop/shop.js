angular.module('felt.shop', [
  'ui.router',
  /*'common.utils.service',*/
  'angularUtils.directives.uiBreadcrumbs'
])

  .config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
    
      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider
          
          .when('/shop/cart', ['$state', function ($state) {
            $state.go('shop.cart.edit');
          }]);
          
            
/*                .when('/shop/cart', ['$match', '$stateParams', 
            function ($match, $stateParams) {
              //if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
              //  $state.transitionTo(state, $match, false);
              //}
              console.log('match:');
              console.log($match);
            }]
          )*/

          // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state

    
      $stateProvider

        /////////////
        //  SHOP   //
        /////////////
        .state('shop', {

          abstract: true,

          url: '/shop',

          templateUrl: 'app/shop/shop.html',

          data: {
            breadcrumbProxy: 'shop.all'
          },

          resolve: {
            
            categories: ['Shop',
              function (Shop) {
                return Shop.getCategories();
              }],
              
            allColors:  ['Shop',
              function (Shop) {
                return Shop.getAllColors();
              }]
          },

          controller: ['$scope', '$state', 'categories', 'utils', 'allColors', 'Shop',
            function ($scope, $state, categories, utils, allColors, Shop) {

              $scope.categories = categories;

              $scope.goToRandom = function () {
                var randId = utils.newRandomKey($scope.categories, "id", $state.params.categoryId);

                $state.go('shop.category', {categoryId: randId});
              };
              
              
              $scope.filters = [];
              
              $scope.categories.forEach(function(category) {
                $scope.filters[category.id] = {};
                $scope.filters[category.id].origins = Shop.extractOrigins(category);
                $scope.filters[category.id].colors = Shop.extractColors(category);
              });

              
                //$scope.colors = [];
                var colors = [
                  {"name": "бял", "code": "white", "value": false},
                  {"name": "червен", "code": "red", "value": false},
                  {"name": "розов", "code": "pink", "value": false},
                  {"name": "зелен", "code": "green", "value": false},
                  {"name": "син", "code": "blue", "value": false},
                  {"name": "светло син", "code": "lightblue", "value": false}
                ];
                
              
            }]
        })

        ///////////////////////
        // SHOP > CATEGORIES //
        ///////////////////////
        .state('shop.all', {

          url: '',

          data: {
            displayName: 'Начало',
            title: 'Онлайн магазин за вълна и коприна'
          },

          views: {

            'filter': {
              templateUrl: 'app/shop/filter.html'
            },

            'content': {
              templateUrl: 'app/shop/categories.all.html'
            }
          }

        })

        ////////////////////////////////
        // SHOP > CATEGORY > PRODUCTS //
        ////////////////////////////////
        .state('shop.one', {

          url: '/{categoryId}',

          data: {
            displayName: '{{category.name}}' //{{category.name}}
          },


          resolve: {
            category: ['categories', '$stateParams', 'utils',
              function (categories, $stateParams, utils) {
                return utils.findById(categories, $stateParams.categoryId);
              }]
          },

          views: {
            'filter': {
              templateUrl: 'app/shop/filter.html',
              controller: ['$scope', 'Shop', 'category',
                  function($scope, Shop, category) {
                    if (category) {
                      var catFilter = $scope.filters[category.id];
                      /*if (!catFilter) {
                        var newFilter = {};
                        newFilter.origins = Shop.extractOrigins(category);
                        $scope.filters[category.id] = newFilter;
                        catFilter = newFilter;
                      }*/
                  
                      $scope.filter = catFilter;
                    }
                  }
              ]
            },

            'content': {
              templateUrl: 'app/shop/categories.one.html',
              controller: ['$scope', 'category',
                function ($scope, category) {
                  $scope.category = category;
                  
                  
                //SEARCH FUNCTION USED TO FILTER DATA IN NG-REPEAT
                //TODO REFACTOR IT!!!
                $scope.search = function (product) {
                  var originFilter = [];
                  var colorFilter = [];
                  var filterObj = $scope.filters[$scope.category.id];
                  for (var i = 0; i < filterObj.origins.length; i++) {
                    if (filterObj.origins[i].value) {
                      originFilter.push(filterObj.origins[i].name);
                    }
                  }
                  if (filterObj.colors)
                  for (var i = 0; i < filterObj.colors.length; i++) {
                    if (filterObj.colors[i].value) {
                      colorFilter.push(filterObj.colors[i].name);
                    }
                  }

                  //check origin
                  var matchOrigin = false;
                  if (originFilter.length == 0) {
                    matchOrigin = true;
                  } else {
                    for (var i = 0; i < originFilter.length; i++) {
                      if (originFilter[i] === product.origin) {
                        matchOrigin = true;
                        break;
                      }
                    }
                  }
                  /*
                   if (filter.indexOf(product.origin)) {
                   console.log(product.origin + ' in ' + filter);
                   return true;
                   }*/
                  //console.log(product);

                  //check color
                  var matchColor = false;
                  if (matchOrigin) {
                    if (colorFilter.length == 0) {
                      matchColor = true;
                    } else {
                      for (var i = 0; !matchColor && i < colorFilter.length; i++) {
                        if (colorFilter[i] === product.color) {
                          matchColor = true;
                          break;
                        }
                      }
                    }
                  }

                  return matchColor;

                };

                  
                  
                  
                  
                  
                  
                }]

            }
          }

        })

        ///////////////////////////////
        // SHOP > Category > Product //
        ///////////////////////////////
        .state('shop.one.product', {

          url: '/:productId',

          data: {
            displayName: '{{product.name}}'
          },

          resolve: {
            product: ['category', '$stateParams', 'utils',
              function (category, $stateParams, utils) {
                return utils.findById(category.products, $stateParams.productId);
              }]
          },

          views: {
            'filter@shop': { template: '' },
            'content@shop': { template: '' },
            
            'content2@shop': {
              templateUrl: 'app/shop/product.html',
              controller: ['$scope', 'product',
                function ($scope, product) {
                  $scope.product = product;
                }]
            }
          }
        })

    }
  ]
);
