// Make sure to include the `ui.router` module as a dependency
angular.module('felt', [

    'felt.shop',
    'felt.menu.service',
    'felt.categories.service',
    'felt.shop.cart',
    'felt.shop.service',
    'felt.color.service',
    
    'common.utils.service',
	  'ui.bootstrap',
    'ui.router',
	
    'ngAnimate'
])


.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
		
    
    

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                console.log('state changed from ' + fromState.name + ' to ' + toState.name);

                $("html, body").animate({ scrollTop: 0 }, 200);
                
                /*
                console.log("fromState:");
                console.log(fromState);
                console.log("toState:");
                console.log(toState);
                console.log("fromParams:");
                console.log(fromParams);
                console.log("toParams:");
                console.log(toParams);
                console.log("EVENT:");
                console.log(event);
                */
                
                if (toState.name === 'home') {


                }

            });


  }
])

.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

            /////////////////////////////
            // Redirects and Otherwise //
            /////////////////////////////
            $urlRouterProvider.otherwise('/');


            //////////////////////////
            // State Configurations //
            //////////////////////////
            $stateProvider
                //////////
                // Home //
                //////////
                .state("home", {

                    // Use a url of "/" to set a state as the "index".
                    url: "/",

                    data: {
                      displayName: 'Добре дошли!'
                    },

                    views: {
                        'banner': {
                            templateUrl: 'app/home/slider.html'
                        },

                        '': {

                        }

                    },
                    
                    onExit: function () {
                        $('.slider-v1').cycle('destroy');
                    }

                })

                ///////////
                // About //
                ///////////

                .state('about', {
                    url: '/about',

                    data: {
                      displayName: 'За нас'
                    },
                    // Showing off how you could return a promise from templateProvider
                    templateProvider: ['$timeout',
                        function ($timeout) {
                            return $timeout(function () {
                                return '<p class="lead">UI-Router Resources</p><ul>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
                                    '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
                                    '</ul>';
                            }, 300);
                        }]
                })
                
                
                
                
  }
])


.controller('MainCtrl', ['$scope', 'Shop', 'maxVisibleElements', 'cart', 'cartService', '$animate', '$timeout',
  function ($scope, Shop, maxVisibleElements, cart, cartService, $animate, $timeout) {
    console.log("CART");
    console.log(cart);
    console.log(cartService);
    
    
    var subTotalPromise = null;
    var addToCartPromise = null;
    
    
    
    $scope.cart = cart;
    
		$scope.maxx = 300;
    var categories;

    Shop.getCategories().then(function (data) {
      var categories = data;
      console.log("Categories:");
      console.log(categories);
      $scope.catMenuItems = Shop.extractCatMenuItems(categories);
      console.log("CatMenuItems:");
      console.log($scope.catMenuItems);
      
    });
		
		$scope.gridview = function () {
		  $scope.productView = '';
		  $scope.gridView = 'sel';
		  $scope.listView = '';
		  console.log("gridview");
		}							
							
		$scope.listview = function () {
		  $scope.productView = 'list-view';
		  $scope.gridView = '';
		  $scope.listView = 'sel';
			console.log("listview");
		}							
							
		$scope.gridview();

		
		$scope.addToCart = function(product, quantity) {
      this.flashIt(product);
      cartService.addItem(product, quantity);
    }
    
    $scope.flashIt = function(product) {
      if ($scope.cartPromise) {
        $animate.cancel($scope.cartPromise);
      }
      
      $timeout(function(){   
        $scope.cartPromise = $animate.addClass($('#btn-'+product.fullId), "btn2-activated");
        $scope.cartPromise.then( 
          function () {
            $('#btn-'+product.fullId).removeClass("btn2-activated");
          });
      }, 1);

      
    }
		
		$scope.removeFromCart = function(id) {
      cartService.removeItem(id);
      console.log("cart changed2");
      console.log(cart);
    }
    
    $scope.recalcCart = function() {
      cartService.recalcTotals();
      console.log("cart recalculated");
    }
		

    
    
    
    
          $scope.$watch('cart.subTotal', function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
              console.log("SUBTOTAL");
              if (subTotalPromise) {
                $animate.cancel(subTotalPromise);
              }
              
              $timeout(function(){
                subTotalPromise = $animate.addClass($('.cart111'), "flashing");
                subTotalPromise.then( 
                  function () {
                    $('.cart111').removeClass("flashing");
                  });
              }, 1);
              
            }
          });

    
    

  }
])
    
    
.factory('Title', ['$rootScope', '$interpolate', function ($rootScope,   $interpolate) {

        var factory = {};

        factory.getTitle = function () {
          var title = '';
          var currentState = $rootScope.$state.$current;
          var data = null;
          if (currentState.data) {
            if (currentState.data.title)
              data = currentState.data.title;
            else
              data = currentState.data.displayName;
            if (data) {
              var interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
              title = $interpolate(data)(interpolationContext);
            }
          }
          return title;
        };
        

        return factory;

  }
])
	 
.directive('updateTitle', ['$rootScope', '$timeout', 'Title',
  function($rootScope, $timeout, Title) {
    return {
      link: function(scope, element, attrs) {
        console.log(attrs);
        var listener = function(event, toState) {

          var title = attrs.prefix + ' ' + Title.getTitle();
            
          $timeout(function() {
            element.text(title);
          }, 0, false);
        };

        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
])

; //the end

