angular.module('your_app_name.auth.controllers', [])


.controller('WelcomeCtrl', function($scope, $state, $ionicModal){
	// $scope.bgs = ["http://lorempixel.com/640/1136"];
	$scope.bgs = ["img/welcome-bg.jpeg"];

	$scope.facebookSignIn = function(){
		console.log("doing facebbok sign in");
		$state.go('app.feed');
	};

	$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

	$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

  $scope.showPrivacyPolicy = function() {
    $scope.privacy_policy_modal.show();
  };

	$scope.showTerms = function() {
    $scope.terms_of_service_modal.show();
  };
})

.controller('CreateAccountCtrl', function($scope, $state, $timeout, AuthService, $ionicSlideBoxDelegate){

  $scope.next = function(){
    $ionicSlideBoxDelegate.next();
  }
  $scope.back = function(){
    $ionicSlideBoxDelegate.previous();
  } 
  
  $scope.slide = -1;
  $scope.slides = [];
  $timeout(function(){
    $scope.$watch(function(){
        return $ionicSlideBoxDelegate.currentIndex();
    }, function(index){

      $scope.errorMessage = "";

      //Initial state, don't validate
      if($scope.slide < 0){
        $scope.slide = 0;
        return;
      }

      if($scope.slides[$scope.slide].isValid()){
        $scope.slide = index;
        return;
      } else {
        $ionicSlideBoxDelegate.slide($scope.slide);
        $scope.errorMessage = $scope.slides[$scope.slide].errorMessage;
      }

    });
  },0);


	$scope.doSignUp = function(forms){
		//console.log(forms);
		    AuthService.saveUser(forms);
        $state.go('checkin');

	};
})

.controller('WelcomeBackCtrl', function($scope, $state, $ionicModal, AuthService){

  var senha = {nome: 'admin', senha: '123mudar'};

	$scope.doLogIn = function(forms){
		 if (forms.userName == senha.nome){ 
      AuthService.saveUser(senha);
      $state.go('checkin');
    } else {
      alert('Você digitou o usuário ou senha incorretos.')
    }
	};

	$ionicModal.fromTemplateUrl('views/auth/forgot-password.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.forgot_password_modal = modal;
  });

  $scope.showForgotPassword = function() {
    $scope.forgot_password_modal.show();
  };

	$scope.requestNewPassword = function() {
    console.log("requesting new password");
  };

  // //Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });
})

.controller('ForgotPasswordCtrl', function($scope){

})

;
