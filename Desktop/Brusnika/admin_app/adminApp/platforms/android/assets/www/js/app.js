// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('brusnika', ['naif.base64','ionic', 'brusnika.controllers', 'brusnika.services','ngMaterial', 'firebase','ngStorage','ngMask'])

.run(function($ionicPlatform,$rootScope,$localStorage) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)



    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


    // $rootScope.$apply();
  });
})

.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider) {



  $mdThemingProvider.definePalette('amazingPaletteName', {
  '50': 'a0d228',
  '100': 'a0d228',
  '200': 'a0d228',
  '300': 'a0d228',
  '400': 'a0d228',
  '500': 'a0d228',
  '600': 'a0d228',
  '700': 'a0d228',
  '800': 'a0d228',
  '900': 'a0d228',
  'A100': 'a0d228',
  'A200': 'a0d228',
  'A400': 'a0d228',
  'A700': 'a0d228',
  'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                      // on this palette should be dark or light

  'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
   '200', '300', '400', 'A100'],
  'contrastLightColors': undefined    // could also specify this if default was 'dark'
});

$mdThemingProvider.theme('default')
  .primaryPalette('amazingPaletteName')



  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('chat', {
    url: '/chat',
    cache: false,
    templateUrl: 'templates/chat.html',
    controller: 'chatCtrl'
  })

  .state('helloview', {
    url: '/',
    cache: false,
    templateUrl: 'templates/helloview.html',
    controller: 'helloviewCtrl'
  })

  .state('register', {
    url: '/register',
    cache: false,
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('wait', {
    url: '/wait',
    cache: false,
    templateUrl: 'templates/wait.html',
    controller: 'waitCtrl'
  })

  .state('auth', {
    url: '/auth',
    cache: false,
    templateUrl: 'templates/auth.html',
    controller: 'authCtrl'
  })

  .state('logon', {
    url: '/logon',
    cache: false,
    templateUrl: 'templates/logon.html',
    controller: 'logonCtrl'
  })
  .state('prefs', {
    url: '/prefs',
    cache: false,
    templateUrl: 'templates/prefs.html',
    controller: 'prefsCtrl'
  })
  .state('base', {
    url: '/base',
    cache: false,
    templateUrl: 'templates/base.html',
    controller: 'baseCtrl'
  })
  .state('contacts', {
    url: '/contacts',
    cache: false,
    templateUrl: 'templates/contacts.html',
    controller: 'contactsCtrl'
  })


.state('showUserChat', {
  url: '/showUserChat/:id',
  cache: false,
  templateUrl: 'templates/showUserChat.html',
  controller: 'showUserChat'
})


.state('users', {
  url: '/users',
  cache: false,
  templateUrl: 'templates/users.html',
  controller: 'usersCtrl'
})

.state('files', {
  url: '/files/:dir',
  cache: false,
  templateUrl: 'templates/files.html',
  controller: 'filesCtrl'
})


  .state('exit', {
    url: '/exit',
    cache: false,
    controller: 'exitCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
