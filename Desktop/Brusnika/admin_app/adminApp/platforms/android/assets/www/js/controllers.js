angular.module('brusnika.controllers', [])
//----------------------------------------------------------------------------------
.controller('helloviewCtrl',  function($scope,$http,$rootScope,$localStorage,$state) {

  if(!$localStorage.uId || $localStorage.uId == ""){
    setTimeout(function () {
      $state.go('auth');
    }, 500);
  }else{
    setTimeout(function () {
      $state.go('chat');
    }, 500);
  }

})

//----------------------------------------------------------------------------------
.controller('authCtrl',  function($scope,$rootScope,$http,$mdDialog,$state,$localStorage) {


  $scope.showAlert = function(ev) {
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title($scope.title)
        .textContent($scope.text)
        .ariaLabel('')
        .ok('Ок')
        .targetEvent(ev)
    );
  };
  $scope.status = '  ';
  $scope.user = {
    login:"",
    password:""
  }
  $scope.preload_text = "Авторизация";
  $scope.preload_text2 = "Введите логин и пароль";
  $scope.title = 'Не верный логин или пароль';
  $scope.text = 'Проверьте правильность написания пароля или обратитесь к администратору';
  $scope.login = false;

  $scope.loginAdmin = function(){
    $scope.login = true;
    if($scope.user.login=="" || $scope.user.password==""){
      $scope.title = 'Заполните логин и пароль';
      $scope.text = 'Для авторизации необходимо ввести логин и пароль';
      this.showAlert();
      $scope.login = false;
    }
    else{
    $http({
        method: 'GET',
        url: 'https://brusnikaapp-12e78.firebaseio.com/admins.json?orderBy="login"&equalTo="'+$scope.user.login+'"'
      }).then(function successCallback(response) {
        console.log(Object.keys(response.data).length);

        for(var index in response.data) {
            var user = response.data[index];
            var uID = index;
        }
        if(Object.keys(response.data).length!=0 && user.password == $scope.user.password){
          $localStorage.uId = uID;
          $localStorage.user = user.fio;
          $localStorage.role = user.role;
          $localStorage.avatar = user.avatar;
          $localStorage.city = user.city;
          console.log(user.avatar)
          setTimeout(function () {
            $state.go('chat');
          }, 500);

        }else{
          $scope.login = false;
          $scope.title = 'Пароль не верный';
          $scope.text = 'Для авторизации необходимо ввести верный пароль';
          $scope.showAlert();
        }

      });
    }

  }

})
//------------------------------------------------------------------------------

.controller('GridBottomSheetCtrl', ['$scope','$rootScope','$http','$mdDialog','$firebase','$firebaseArray','$mdSidenav','$ionicScrollDelegate','$localStorage','$timeout','$mdBottomSheet','$mdToast','$state','$interval' , function($scope,$rootScope,$http,$mdDialog,$firebase,$firebaseArray,$mdSidenav,$ionicScrollDelegate,$localStorage,$timeout,$mdBottomSheet,$mdToast,$state,$interval) {

    var refShared = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/sharedmes/' );
    var syncShared = $firebaseArray(refShared);
    $scope.sharedMess = syncShared;

}])

.controller('chatCtrl', ['$scope','$rootScope','$http','$mdDialog','$firebase','$firebaseArray','$mdSidenav','$ionicScrollDelegate','$localStorage','$timeout','$mdBottomSheet','$mdToast','$state','$interval' ,function($scope,$rootScope,$http,$mdDialog,$firebase,$firebaseArray,$mdSidenav,$ionicScrollDelegate,$localStorage,$timeout,$mdBottomSheet,$mdToast,$state,$interval) {
  //$rootScope.uKey


    var textarea = document.querySelector('textarea');

    textarea.addEventListener('keydown', autosize);

    function autosize(){
        var el = this;
        setTimeout(function(){
            //  $scope.height = el.scrollHeight;
            el.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
            //el.style.cssText = '-moz-box-sizing:content-box';
            el.style.cssText = 'height:' + (el.scrollHeight+10) + 'px; border:0 !important;';
            angular.element(document.querySelector(".slack-menssage-bar")).css( 'height', (el.scrollHeight+30) + 'px' );

        },0);
    }


    $scope.toggleLeft = function () { console.log('clicked menu')

        $mdSidenav('left').toggle();

    }


    $scope.showGridBottomSheet = function() {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'templates/bottomgrid.html',
            controller: 'GridBottomSheetCtrl',
            clickOutsideToClose: true
        }).then(function(clickedItem) {
                /*$mdToast.show(
                 $mdToast.simple()
                 .textContent('добавлена форма')
                 .position('top right')
                 .hideDelay(1500)
                 );*/
            }
        );
    };



  if(!$localStorage.uId || $localStorage.uId == ""){
    setTimeout(function () {
      $state.go('auth');
    }, 500);
  }

  $scope.avatar = "data:image/png;base64,"+$localStorage.avatar;


  $scope.showSend = false;
  $scope.userName = $localStorage.user;
  $scope.textFocused = false;
  console.log($localStorage);
  var day = new Date();
  var month=new Array(12);
      month[0] = "января";
      month[1] = "февраля";
      month[2] = "марта";
      month[3] = "апреля";
      month[4] = "мая";
      month[5] = "июня";
      month[6] = "июля";
      month[7] = "августа";
      month[8] = "сентября";
      month[9] = "октября";
      month[10] = "ноября";
      month[11] = "декабря";

  $scope.currday = day.getUTCDay();
  $scope.currmonth = month[day.getUTCMonth()];
  $scope.curryear = month[day.getUTCFullYear()];

  $scope.currentMenu = "Лента";
  $scope.nousers = true;



  $scope.role = $localStorage.role;
  if($localStorage.role == "admin"){
  $http({
      method: 'GET',
      url: 'https://brusnikaapp-12e78.firebaseio.com/users.json?orderBy="active"&equalTo=true'
    }).then(function successCallback(response) {

      console.log(response.data);
      $scope.users = response.data;
      $scope.nousers = false;

    });
  }else{

    console.log('https://brusnikaapp-12e78.firebaseio.com/conversations.json?orderBy="receiverId"&equalTo='+$localStorage.uId);

    var oldResponce;
    $interval(function() {
    $http({
        method: 'GET',
        url: 'https://brusnikaapp-12e78.firebaseio.com/conversations.json?orderBy="receiverId"&equalTo="'+$localStorage.uId+'"'
      }).then(function successCallback(response) {

        if(oldResponce != response){

        $scope.users = [];
        oldResponce = response;
        for(var index in response.data) {

          $http({
              method: 'GET',
              url: 'https://brusnikaapp-12e78.firebaseio.com/users.json?orderBy="$key"&equalTo="'+response.data[index].userId+'"'
            }).then(function successCallback(response2){

              for(var index in response2.data) {
                $scope.users.push ( response2.data[index] );
              }
              $scope.nousers = false;

            });

        }
        console.log($scope.users);

        setTimeout(function () {
          console.log($scope.users);
          $ionicScrollDelegate.scrollBottom(true);
        }, 1500);

      }
      });


    }, 10000);
  }

  $scope.sendChatAll = function(chat) {
    var ref = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/chat/' );
    var sync = $firebaseArray(ref);


    var day = new Date();
    var month=new Array(12);
        month[0] = "января";
        month[1] = "февраля";
        month[2] = "марта";
        month[3] = "апреля";
        month[4] = "мая";
        month[5] = "июня";
        month[6] = "июля";
        month[7] = "августа";
        month[8] = "сентября";
        month[9] = "октября";
        month[10] = "ноября";
        month[11] = "декабря";

    //  alert(day.getDate())

    $scope.currday = day.getDate();
    $scope.currmonth = month[day.getUTCMonth()];
    $scope.curryear = month[day.getUTCFullYear()];



    $scope.chats = sync;
    var date = day.getHours()+":"+day.getMinutes();
    for( var id in $scope.users) {
      $scope.chats.$add({
        message_date: ""+date+"",
        message_currday: ""+$scope.currday+"",
        message_currmonth: ""+$scope.currmonth+"",
        user: ""+$localStorage.user+"",
        message: chat.message,
        uid: $localStorage.uId,
        convId: id,
        status: 0
      })
    }

    var refShared = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/sharedmes/' );
    var syncShared = $firebaseArray(refShared);
    $scope.shared = syncShared;
    $scope.shared.$add({
        message_date: ""+date+"",
        message_currday: ""+$scope.currday+"",
        message_currmonth: ""+$scope.currmonth+"",
        user: ""+$localStorage.user+"",
        message: chat.message,
        uid: $localStorage.uId,
        convId: id,
        status: 0
      })

    chat.message = "";
  };

}])
//------------------------------------------------------------------------------

.controller('GridBottomAdminsCtrl', ['$scope','$rootScope','$http','$mdDialog','$firebase','$firebaseArray','$mdSidenav','$ionicScrollDelegate','$localStorage','$timeout','$mdBottomSheet','$mdToast','$state','$interval' , function($scope,$rootScope,$http,$mdDialog,$firebase,$firebaseArray,$mdSidenav,$ionicScrollDelegate,$localStorage,$timeout,$mdBottomSheet,$mdToast,$state,$interval) {

     $http({
      method: 'GET',
      url: 'https://brusnikaapp-12e78.firebaseio.com/admins.json'
      }).then(function successCallback(response) {

        console.log(response.data);
        $scope.admins = response.data;

      });

}])


.controller('showUserChat', ['$scope', '$firebase','$firebaseArray', '$localStorage', '$http', '$mdSidenav', '$stateParams','$ionicScrollDelegate','$state' ,'$timeout','$firebaseObject','$window','$mdBottomSheet', function($scope, $firebase,$firebaseArray, $localStorage,$http,$mdSidenav,$stateParams,$ionicScrollDelegate,$state,$timeout,$firebaseObject,$window,$mdBottomSheet){


  //---------------------------------------------------
  $scope.showGridBottomSheet = function() {
    $scope.alert = '';

    


    $mdBottomSheet.show({
      templateUrl: 'templates/bottom_from_chat.html',
      controller: 'GridBottomAdminsCtrl',
      clickOutsideToClose: true
    }).then(function(clickedItem) {
      /*$mdToast.show(
            $mdToast.simple()
              .textContent('добавлена форма')
              .position('top right')
              .hideDelay(1500)
          );*/
        }
  );
  };
  //---------------------------------------------------

  delete $scope.unread[$stateParams.id];

    $scope.toggleLeft = function () { console.log('clicked menu')

        $mdSidenav('left').toggle();

    }

  if(!$localStorage.uId || $localStorage.uId == ""){
    setTimeout(function () {
      $state.go('auth');
    }, 500);
  }
$scope.avatar = "data:image/png;base64,"+$localStorage.avatar;
var refConv,conv ;

  $http({
      method: 'GET',
      url: 'https://brusnikaapp-12e78.firebaseio.com/conversations.json?orderBy="userId"&equalTo="'+$stateParams.id+'"'
    }).then(function successCallback(response) {

        console.log(Object.keys(response.data).length);
        if(Object.keys(response.data).length==0){
          refConv = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/conversations/' );
          conv = $firebaseArray(refConv);
          conv.$add({
              userId : $stateParams.id,
              receiverId : 0
          });
        }
    });

  $scope.userName = $localStorage.user;
  $scope.role = $localStorage.role;

  $scope.delegate = function(){
      refConv = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/conversations/' );
      refConv.orderByChild("userId").equalTo( ""+$stateParams.id+"" ).on('child_added', function(convers) {
          console.log(convers.val()); // Works fine
          convers.ref().set({userId: $stateParams.id, receiverId: $scope.reciver}); // Yay!
          $ionicScrollDelegate.scrollBottom(true);
      });
      setTimeout(function () {
        $state.go('chat');
      }, 500);
  };


  $scope.currentMenu = "Чат";
  $scope.showchat = true;
  var ref = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/chat/' );
  var sync = $firebaseArray( ref.orderByChild("convId").equalTo( $stateParams.id ) );
  $scope.chats = sync;

  console.log( sync );
  $scope.checkUser = function(uid){
    if($localStorage.uId!=uid) return "left";
    else return "right";
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.ajustarScroll = function () {

      $ionicScrollDelegate.resize();
      $ionicScrollDelegate.scrollBottom(true);

  }

 

  var day = new Date();
  var month=new Array(12);
     month[0]="января";
     month[1]="февраля";
     month[2]="марта";
     month[3]="апреля";
     month[4]="мая";
     month[5]="июня";
     month[6]="июля";
     month[7]="августа";
     month[8]="сентября";
     month[9]="октября";
     month[10]="ноября";
     month[11]="декабря";

  $scope.role = $localStorage.role;
  $scope.currday = day.getUTCDay();
  $scope.currmonth = month[day.getUTCMonth()];
  $scope.curryear = month[day.getUTCFullYear()];

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    setTimeout(function () {
        $ionicScrollDelegate.scrollBottom(true);
        console.log("i think it scrolled");

    },4000);


  $scope.sendChat = function(chat){

     var date = day.getHours()+":"+day.getMinutes();
     var user = $localStorage.fio;
     $scope.showSend = false;

     var ref = new Firebase( 'https://brusnikaapp-12e78.firebaseio.com/chat/' );
     var sync = $firebaseArray( ref.orderByChild("convId").equalTo( $stateParams.id ) );
     $scope.chats = sync;


     chat.state = chat.state || null;

     var chatData = {
       message_date: ""+date+"",
       message_currday: ""+$scope.currday+"",
       message_currmonth: ""+$scope.currmonth+"",
       user: ""+$localStorage.user+"",
       message: chat.message,
       state: chat.state,
       uid: $localStorage.uId,
       convId: $stateParams.id,
       status: 0
     };

     console.log(chatData)
     //console.log($scope.chats);


     $scope.chats.$add(chatData);

     chat.message = "";
       $timeout(function() {
         //alert('has to be scroller')
         $ionicScrollDelegate.resize();
         $ionicScrollDelegate.scrollBottom(true);

         //$('#chatcont').animate({scrollTop: $(document).height() + $('#chatcont').height()});

        // $window.document.getElementById("chatcont").scrollBottom = 0;
       },500);

  };

  //files sending
  var actualDirs = ['Риэлторам', 'Базовая информация', 'Документы'];

  /*$scope.fstruct = [ { dirname: 'folder1', files: ['f1', 'f2'] },
  { dirname: 'folder2', files: ['b1', 'b2', 'b3'] } ];*/

  $scope.fstruct = [];

  actualDirs.forEach(function(aDir, i, arr) {
    $http({
        method: 'GET',
        url: '/getfiles/' + aDir
    }).then(function successCallback(response) {
      //console.log(aDir, i, arr.length);
      $scope.fstruct = $scope.fstruct.concat([{dirname: aDir, files: response.data.data}]);
      //console.log($scope.fstruct);
    });
  });

  $scope.sendFileUrl = function(dir, file) {
    $scope.sendChat({message: {href: '/' + dir.dirname + '/' + file.name, name: file.name}, state: "sendFile"});
    console.log("file to send: ", file);
  };

}])
//------------------------------------------------------------------------------
.controller('prefsCtrl', function($scope, $firebase,$firebaseArray, $localStorage,$http,$mdSidenav){
$scope.avatar = "data:image/png;base64,"+$localStorage.avatar;
  $scope.currentMenu = "Личные данные";
  $scope.role = $localStorage.role;
  $scope.userName = $localStorage.user;
    $scope.toggleLeft = function () { console.log('clicked menu')

        $mdSidenav('left').toggle();

    }
  $http({
      method: 'GET',
      url: 'https://brusnikaapp-12e78.firebaseio.com/admins.json?orderBy="$key"&equalTo="'+$localStorage.uId+'"'
    }).then(function successCallback(response) {

      console.log(response.data);
      for(index in response.data){
        $scope.user = response.data[index];
      }

    });

  $scope.savePrefs = function(){
    $scope.userName  = $scope.user.fio;
    $localStorage.user = $scope.user.fio;
    $localStorage.avatar = $scope.user.avatar.base64;
    var updRef = new Firebase('https://brusnikaapp-12e78.firebaseio.com/admins/'+$localStorage.uId);
    updRef.update({ fio: $scope.user.fio,
                    login: $scope.user.login,
                    phone: $scope.user.phone,
                    avatar: $scope.user.avatar.base64,
                    password: $scope.user.password });
  }
})
//-------------------------------------------------------------------------------
.controller('baseCtrl', function($scope,$mdSidenav ){
  $mdSidenav('left')
   .close()
   .then(function(){
     console.log('closed');
   });
   $scope.avatar = "data:image/png;base64,"+$localStorage.avatar;
   $scope.toggleLeft = function () { console.log('clicked menu')

         $mdSidenav('left').toggle();

   }
  $scope.currentMenu = "База знаний";


})
//------------------------------------------------------------------------------
.controller('usersCtrl', function( $scope,$mdSidenav ,$http,$localStorage,$mdDialog,$firebaseArray,$firebaseObject){
$scope.avatar = "data:image/png;base64,"+$localStorage.avatar;
   $scope.currentMenu = "Пользователи";
   $scope.currentUser = $localStorage.uId;
   $scope.role = $localStorage.role;
   $scope.addForm = false;


   $scope.showAlert = function(ev) {
     $mdDialog.show(
       $mdDialog.alert()
         .parent(angular.element(document.querySelector('#popupContainer')))
         .clickOutsideToClose(true)
         .title($scope.title)
         .textContent($scope.text)
         .ariaLabel('')
         .ok('Ок')
         .targetEvent(ev)
     );
   };

  var updRef = new Firebase('https://brusnikaapp-12e78.firebaseio.com/admins/');
  var conv = $firebaseArray(updRef);
  $scope.admins = conv;

  console.log($scope.admins);

  $scope.delUser = function(id){

    updRef.child(id).remove(function(error){  });

  }

  $scope.newuser = {};
  $scope.newuser.userType = 'admin';
  $scope.EditForm = false;

  $scope.SaveUser = function(id){

    console.log($scope.user)

    updRef.child(id).update({

      fio: $scope.user.fio,
      login: $scope.user.login,
      role: $scope.user.role,
      password:    $scope.user.password

    });
    $scope.EditForm = false;
  }

  $scope.editUser = function(id){
      $scope.EditForm = true;
      $scope.uId = id;
      var base = updRef.child(id);
      $scope.user = $firebaseObject( base );

      console.log($scope.user);
  }

  $scope.addUser = function(){
    console.log($scope.newuser);
    if($scope.newuser.role==undefined || $scope.newuser.fio == undefined || $scope.newuser.login==undefined || $scope.newuser.password==undefined){
      $scope.title = "Не все поля заполненны для добавления";
      $scope.text = "Для добавления пользователя необходимо заполнить все поля";
      this.showAlert();
    }else{

      conv.$add({ fio: $scope.newuser.fio, login: $scope.newuser.login, password: $scope.newuser.password, role: $scope.newuser.role });
      $scope.addForm = false;
    }

  }

})
//------------------------------------------------------------------------------
.controller('contactsCtrl', function($scope,$mdSidenav){
  $scope.avatar = "data:image/png;base64,"+$localStorage.avatar;
  $mdSidenav('left')
   .close()
   .then(function(){
     console.log('closed');
   });


  $scope.toggleLeft = function () { console.log('clicked menu')

        $mdSidenav('left').toggle();

  }

  //buildToggler('left');
  $scope.currentMenu = "Связаться с нами";

  $scope.types = [
    "Телефоны",
    "Email",
    "Адреса"
  ]

})

.controller('filesCtrl', function($scope, $localStorage, $stateParams, $http){

  $scope.avatar = "data:image/png;base64,"+$localStorage.avatar;
  $scope.userName = $localStorage.user;
  $scope.role = $localStorage.role;
  $scope.currentMenu = "Управление файлами";
  $scope.curDir = $stateParams.dir;

  var updateFileList = function (aDir) {
    return $http({
      method: 'GET',
      url: '/getfiles/' + aDir || ''
    }).then(function successCallback(response) {
      $scope.flist = response.data.data;
    });
  }

  if($stateParams.dir !== '') {
    updateFileList($scope.curDir)
  } else {
    console.log('folders');
  }

  $scope.file_upload = function() {
    var file = document.getElementById('file').files[0];
    if (!file) return;
    var fileReader = new FileReader();
    var formData = new FormData();
    formData.append('file', file);

    fileReader.onload = function(ev) {
      var data = ev.target.result;
      $http({
        method: 'POST',
        url: '/upload/'+$scope.curDir,
        data: formData,
        headers: {'Content-Type': undefined}
      }).then(function successCallback(response) {
        console.log('uploaded');
        updateFileList($scope.curDir);
      }, function errorCallback(response) {
        console.log('upload error');
      });
    }
    fileReader.readAsBinaryString(file);
  }

  $scope.file_delete = function(file) {
      console.log(file.name);

      $http({
        method: 'GET',
        url: '/delete/'+$scope.curDir+'/'+file.name,
      }).then(function successCallback(response) {
        console.log('deleted');
        updateFileList($scope.curDir);
      }, function errorCallback(response) {
        console.log('delete error');
      });

      //console.log('file delete');
  }

  /*$scope.toggleLeft = function () {
    console.log('clicked menu')
    $mdSidenav('left').toggle();
  }*/

  //console.log($stateParams.dir);
})

//------------------------------------------------------------------------------
.controller('exitCtrl', function($scope,$mdSidenav,$localStorage,$state){

    $localStorage.uId = "";
    setTimeout(function () {
      $state.go('helloview');
    }, 500);


})
.controller('appCtrl', ['$state', '$localStorage', '$scope', '$firebaseArray',
            function ($state, $localStorage, $scope, $firebaseArray) {

  var ref = new Firebase('https://brusnikaapp-12e78.firebaseio.com/chat/');
  var chat = $firebaseArray(ref.limitToLast(1));

  var first = true;
  var me = $localStorage.uId;

  var unread = $scope.unread = {};

  chat.$watch( function (ev) {
    if (first) {
      first = false;
      // Data fetched for the first time -- do nothing
      return;
    }
    //console.log(`AppCtrl`, $state.is('chat'), me, chat, ev.key);

    var sender = chat && chat[0] && chat[0].uid;

    if (ev.event !== 'child_added') return;
    // Ignore my own messages:
    if (sender === me) return;

    if ($state.is('chat')) {
      unread[sender] = unread[sender]? unread[sender] + 1 : 1;
    }

    // Create notification if API available
    if ( "Notification" in window ) {
      Notification.requestPermission( function (permission) {
        if (permission !== 'granted') return;

        var n = new Notification('Получено новое сообщение', {
          icon: 'img/logo.png',
          body: 'от ' + chat[0].user,
        });
        setTimeout(n.close.bind(n), 2000);
      });
    }
  })

}])
