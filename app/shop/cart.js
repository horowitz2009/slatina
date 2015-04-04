angular.module('felt.shop.cart', [
  'ui.router',
  'angularUtils.directives.uiBreadcrumbs',
  'common.utils.service'
  
])

.config(
  ['$stateProvider', '$filterProvider',
    function ($stateProvider, $filterProvider) {
      // register a filter factory which uses the
      // greet service to demonstrate DI.
      $filterProvider.register('shortCategory', function() {
        return function(text) {
          console.log("shortCategory");
          console.log(text);
          if(text === "wool")
            return "w";
          return text;
        };
      });
      $filterProvider.register('shortOrigin', function() {
        return function(text) {
          console.log("shortOrigin");
          console.log(text);
          if(text === "България")
            return "bg";
          if(text === "Германия")
            return "de";
          if(text === "Англия")
            return "en";
          return text;
        };
      });
      $filterProvider.register('numberAligned', function() {
        return function(text) {
          console.log("numberAligned");
          console.log(text);
          
          var floatNumber = parseFloat(text);
          var integerPart= Math.floor(floatNumber);
          floatNumber = floatNumber - integerPart;
          
          var frac = Math.round(floatNumber * 100);
          console.log(integerPart);
          console.log(floatNumber);
          console.log(frac);
          
          
          return '<span class="left">'+integerPart+'</span><span class="right">'+frac+'</span>';
        };
      });
    
    
    
      $stateProvider

        ///////////////////
        //  SHOP > CART  //
        ///////////////////
        .state('shop.cart', {

          abstract: true,

          url: '/cart',

          views: {
           'filter': {
              templateUrl: 'app/shop/filter.html'
            },
            
            'content': {
              template: '<div ui-view="cartContent"></div>'
            }
          },

          data: {
            breadcrumbProxy: 'shop.cart.edit'
          }

        })
        
        
        .state('shop.cart.edit', {
          
          url: '',
          
          data: {
            displayName: 'Количка'
          },
          
          views: {
            'cartContent': {
              templateUrl: 'app/shop/cart.details.html',
              controller: ['$scope', 'cart', 'cartService',
                function ($scope, cart, cartService) {
                  if (!$scope.cart) {
                    console.log('adding cart to this scope');
                    $scope.cart = cart;
                  }
                }]
            }
          }
          
        });
    }
  ])


.directive('myRepeatDirective', ['$timeout', '$animate',
  function($timeout, $animate) {
    return {
      link: function(scope, element, attrs) {

        if (scope.$last){
          scope.$emit('LastElem');
        }

        //apply TouchSpin
        scope.$watch('item', function(){
          $(element).children().find('input.qtyInput').TouchSpin({
                min: 1,
				        max: 999,
                stepinterval: 1,
                maxboostedstep: 3,
				        replacementval: 1,
                buttondown_class: 'btn btn-default',
				        buttonup_class: 'noborder-round btn btn-default',
				        buttondown_txt: '<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>',
				        buttonup_txt: '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'

              });
        });
        
        var delayInMs = 100;
        var timeoutPromise;
        
        
        scope.$watch('item.quantity', function() {
        
          $timeout.cancel(timeoutPromise);  //does nothing, if timeout alrdy done
          timeoutPromise = $timeout(function(){   //Set timeout
            scope.recalcCart();
          }, delayInMs);
          
        });
     
      }
    };
  }
])


.value("maxVisibleElements", 10)

.value("maxV", {"value": 10})

.value("cart", 
  /*{
    "items": [],
    "subTotal": 0.00,
    "shippingCosts": 0.00,
    "total": 0.00
  }*/
  
  
  
  
  
  {"items":[
      {"id":"wool-yellow",
       "product":{"id":"yellow","color":"жълт","image":"images/wool_jylta.jpg",
                  "name":"Жълта вълна","origin":"България",
                  "description":"Прана, дарачена, багрена и пак дарачена. Изключително подходяща за основа поради бързото и лесно степване.","longdesc":"Тъй като вълната е много лека и обемна, ще ви дадем ориентировъчно какво количество е необходимо за някои от нещата, които можете да си изработите. За едно цвете са ви необходими около 3-8г според големината му. Малките фигури за фиба, направени с иглонабиване, са по-леки от грам. Гривните са около 2-7г според вида им. Шапките - около 60-80г. Чантите - около 50-100г пак според големината им.","price":0.8,"quantity":10,"unit":"грама","categoryId":"wool","fullId":"wool-yellow"},"quantity":1,"sum":0.8},{"id":"wool-grapefruit","product":{"id":"grapefruit","color":"светло розов","image":"images/wool_grapefruit.jpg","name":"Грейпфрут","origin":"България","description":"Прана, дарачена, багрена и пак дарачена. Изключително подходяща за основа поради бързото и лесно степване.","longdesc":"Тъй като вълната е много лека и обемна, ще ви дадем ориентировъчно какво количество е необходимо за някои от нещата, които можете да си изработите. За едно цвете са ви необходими около 3-8г според големината му. Малките фигури за фиба, направени с иглонабиване, са по-леки от грам. Гривните са около 2-7г според вида им. Шапките - около 60-80г. Чантите - около 50-100г пак според големината им.","price":0.8,"quantity":10,"unit":"грама","categoryId":"wool","fullId":"wool-grapefruit"},"quantity":2,"sum":1.6},{"id":"wool-darkgrapefruit","product":{"id":"darkgrapefruit","color":"тъмно розов","image":"images/wool_grapefruit2.jpg","name":"ТЪМЕН ГРЕЙПФРУТ","origin":"България","description":"Прана, дарачена, багрена и пак дарачена. Изключително подходяща за основа поради бързото и лесно степване.","longdesc":"Тъй като вълната е много лека и обемна, ще ви дадем ориентировъчно какво количество е необходимо за някои от нещата, които можете да си изработите. За едно цвете са ви необходими около 3-8г според големината му. Малките фигури за фиба, направени с иглонабиване, са по-леки от грам. Гривните са около 2-7г според вида им. Шапките - около 60-80г. Чантите - около 50-100г пак според големината им.","price":0.8,"quantity":10,"unit":"грама","categoryId":"wool","fullId":"wool-darkgrapefruit"},"quantity":3,"sum":2.4000000000000004}],
                 
                  "subTotal":4.80,
                  "shippingCosts":0,
                  "shipping": {"method":'', 
                    "shippingAddress":{
                      "country": "България", 
                      "zipCode":'', 
                      "cityData":'', 
                      "province":'', 
                      "":''
                    },
                    "isBillingAddressSame": true,
                    "billingAddress":{}
                  },
                 "total":4.80
      }
  
  
  
  
  
  
  
  
  
  )

.factory('cartService', ['cart', 'utils',
  function(cart, utils) { 
    var service = {};
    service.cart = cart;
    
    service.addItem = function(product, qty) {
      var quantity = parseInt(qty);
      var item = this.findItem(product.fullId);
      if (item) {
        console.log("already exists");
        item.quantity = parseInt(item.quantity) + parseInt(quantity);
      } else {
        console.log("adding new item in cart");
        this.cart.items.push(buildItem(product, quantity));
      }
      this.recalcTotals();
    }
    
    service.removeItem = function(id) {
      var index = utils.getIndexOf(this.cart.items, id);
      if (index >= 0) {
        this.cart.items.splice(index, 1);
        this.recalcTotals();
      }
    }

    service.editItem = function(id, newQty) {
      var quantity = parseInt(newQty);
      var item = this.findItem(id);
      if (item) {
        if (quantity == 0) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
          this.recalcTotals();
        }
      }
    }
    
    service.recalcTotals = function() {
      var newTotal = 0.00;
      this.cart.items.forEach(function(item) {
        item.sum = item.product.price * item.quantity;
        newTotal += item.sum;
      });
      this.cart.subTotal = newTotal;
      //TODO recalcShippingCosts
      this.cart.shippingCosts = 6.00;
      if(this.cart.subTotal >= 20)
        this.cart.shippingCosts = 3.00;
      if(this.cart.subTotal >= 40)
        this.cart.shippingCosts = 0.00;
      this.cart.total = this.cart.subTotal + this.cart.shippingCosts;
    }
    
    service.findItem = function(id) {
      return utils.findById(this.cart.items, id);
    }
    
    return service;
  }]
)


;



//private functions

function buildItem(product, qty) {
  var quantity = parseInt(qty);
  var item = {};
  item.id = product.fullId;
  item.product = product;
  item.quantity = quantity;
  item.sum = product.price * quantity;
  return item;
}
