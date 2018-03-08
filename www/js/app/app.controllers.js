angular.module('your_app_name.app.controllers', [])


.controller('AppCtrl', function($scope, AuthService) {
 
  $scope.loggedUser = AuthService.getLoggedUser(); 

  console.log(AuthService.getLoggedUser());
})


.controller('ProfileCtrl', function($scope, $stateParams, PostService, AuthService, $ionicHistory, $state, $ionicScrollDelegate) {

  $scope.$on('$ionicView.afterEnter', function() {
    $ionicScrollDelegate.$getByHandle('profile-scroll').resize();
  });

  var userId = $stateParams.userId;

  $scope.dadosUser = AuthService.getLoggedUser();
  $scope.myProfile = $scope.loggedUser._id == userId;
  $scope.posts = [];
  $scope.likes = [];
  $scope.user = AuthService.getLoggedUser();

  PostService.getUserPosts(userId).then(function(data){
    $scope.posts = data;
  });

  PostService.getUserDetails(userId).then(function(data){
    $scope.user = data;
  });

  PostService.getUserLikes(userId).then(function(data){
    $scope.likes = data;
  });

  $scope.getUserLikes = function(userId){
    //we need to do this in order to prevent the back to change
    $ionicHistory.currentView($ionicHistory.backView());
    $ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('app.profile.likes', {userId: userId});
  };

  $scope.getUserPosts = function(userId){
    //we need to do this in order to prevent the back to change
    $ionicHistory.currentView($ionicHistory.backView());
    $ionicHistory.nextViewOptions({ disableAnimate: true });

    $state.go('app.profile.posts', {userId: userId});
  };

})


.controller('ProductCtrl', function($scope, $state, $stateParams, ShopService, $ionicPopup, $ionicLoading) {
  var productId = $stateParams.productId;
   

  
     
      $scope.ingresso = {
        qtd: {0: 0, 1:0, 2:0, 3:0},
        valor: {0: 0, 1:0, 2:0, 3:0},
        detalhe: {0: 0, 1:0, 2:0, 3:0},
      };
  
  $scope.somaItens = function(qtd, tipo, valor, ids, detalheSel, detalheForm, valorForm){ 
   var i = 1;
 
   if (tipo == "menos" && qtd == 0){
      
   } else {
     if (tipo == "menos"){
       var somaQtd = qtd[ids] - i; 
       var somaValor = valor * somaQtd;  

     }
     else { 
       var somaQtd = qtd[ids] + i;
       var somaValor =  valor * somaQtd;  
     }
     qtd[ids] = somaQtd;    
     detalheForm[ids] = detalheSel;
     valorForm[ids] = somaValor; 

    var total = 0;  
 for (var f = 0; f < 4; f++) {
           total += valorForm[f];
     }
      $scope.valor =  total; 
   }
    

  };


  ShopService.getProduct(productId).then(function(product){
    $scope.product = product;
  });

$scope.showDetails = function(product) {
    console.log(product);

      $scope.detalhesEvento = product;


    var myPopup = $ionicPopup.show({
      cssClass: 'add-to-cart-popup',
      templateUrl: 'views/app/shop/partials/products-details.html',
      title: 'DETALHES DO EVENTO',
      scope: $scope,
      buttons: [
        { text: '', type: 'close-popup ion-ios-close-outline' } 
      ]
    });
    myPopup.then(function(res) {
      if(res)
      {
         
      }
      else {
        console.log('Popup closed');
      }
    });
  };


  // show add to cart popup on button click
  $scope.showAddToCartPopup = function(product, qtd, valor, descricao) {
    console.log(product, qtd, valor, descricao);

    $scope.data = {};
    $scope.data.product = product; 
    $scope.quantidade = qtd;
    $scope.descricao = descricao;
    $scope.data.product.valor = valor;

    $scope.data.product.quantidade = qtd;
    $scope.data.product.descricao = descricao; 


    var myPopup = $ionicPopup.show({
      cssClass: 'add-to-cart-popup',
      templateUrl: 'views/app/shop/partials/add-to-cart-popup.html',
      title: product.evento.descricaoevento,
      scope: $scope,
      buttons: [
        { text: '', type: 'close-popup ion-ios-close-outline' },
        {
          text: 'ADD CARRINHO',
          onTap: function(e) {
            return $scope.data;
          }
        }
      ]
    });
    myPopup.then(function(res) {
      if(res)
      {
        $ionicLoading.show({ template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">Adicionando ao carrinho</p>', duration: 1000 });
        ShopService.addProductToCart(res.product, qtd, valor);
        console.log('Item added to cart!', res);
        $state.go('app.cart');
      }
      else {
        console.log('Popup closed');
      }
    });
  };
})


.controller('FeedCtrl', function($scope, PostService) {
  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    PostService.getFeed(1)
    .then(function(data){
      $scope.totalPages = data.totalPages;
      $scope.posts = data.posts;

      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.getNewData = function() {
    //do something to load your new data here
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getFeed($scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.totalPages;
      $scope.posts = $scope.posts.concat(data.posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.doRefresh();

})


.controller('ShopCtrl', function($scope, ShopService) {
  $scope.products = [];
  $scope.popular_products = [];

  ShopService.getProducts().then(function(products){
    $scope.products = products;
  });



  ShopService.getProducts().then(function(products){
    $scope.popular_products = products.slice(0, 2);
  });
})


.controller('ShoppingCartCtrl', function($scope, $state, AuthService, ShopService, $ionicActionSheet, _) {
  $scope.products = ShopService.getCartProducts();

 $scope.concluiCompra = function() {
    if (AuthService.getLoggedUser() == null){
      $state.go('welcome-back');

    } else {
      $state.go('checkin');
    }
 };


  $scope.removeProductFromCart = function(product) {
    $ionicActionSheet.show({
      destructiveText: 'Remover Item',
      cancelText: 'Cancela',
      cancel: function() {
        return true;
      },
      destructiveButtonClicked: function() {
        ShopService.removeProductFromCart(product);
        $scope.products = ShopService.getCartProducts();
        return true;
      }
    });
  };

  $scope.getSubtotal = function() {
    return _.reduce($scope.products, function(memo, product){ return memo + product.valor; }, 0);
  };

})


.controller('CheckoutCtrl', function($scope) {
  //$scope.paymentDetails;
})

.controller('SettingsCtrl', function($scope, $ionicModal) {

  $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

  $scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

})



;
