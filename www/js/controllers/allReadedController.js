angular.module('starter')
//添加通知的controller
.controller('AllReadedCtrl', function($scope, $stateParams, $injector, GetAllUsers, $ionicLoading) {
  console.log('$stateParams:::::', $stateParams);
  $injector.invoke(GetAllUsers.bind, this, {
    $scope: $scope
  });

  $scope.detailId = $stateParams.detailId;
  $scope.type = $stateParams.type;
  console.log('$scope.type:::::', $scope.type);
  //显示加载状态
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  if($scope.type == 'read'){
    $scope.title = '全部已读';
    $scope.allReadedScope = function(allReaded){
      console.log('allReaded:::', allReaded)
      $scope.allReadlists = allReaded;
    };
    //向下滚动进行分页
    var data;
    var limit = 60;
    var index = 1;
    var eachPageCount = 0;
    $('#overflow-scroll').scroll(function(){
      $(".loading-wrap").show();
      var domId = document.getElementById('overflow-scroll');
  　　var scrollTop = domId.scrollTop;
  　　var scrollHeight = domId.scrollHeight;
      var clientHeight = domId.clientHeight;


      if(eachPageCount.length < limit) {
        $(".loading-wrap").hide();
        return;
      }

  　　if(scrollTop + clientHeight + 10 > scrollHeight){
          index += 1;
          GetAllUsers.getAllReaded($scope.detailId, index).then(function(data) {
            $(".loading-wrap").hide();
              eachPageCount = data;
              $scope.allReadlists = $scope.allReadlists.concat(data)
          });
          return;
  　　}
    });
    setTimeout(function(){
      GetAllUsers.getAllReaded($scope.detailId, 1);
    },1000)
  }else{
    $scope.title = '全部未读';
    $scope.allUnReadedScope = function(allUnReaded){
      $scope.allUnreadlists = allUnReaded;
    };
    //向下滚动进行分页
    var data;
    var limit = 60;
    var index = 1;
    var eachPageCount = 0;
    $('#overflow-scroll').scroll(function(){
      $(".loading-wrap").show();
      var domId = document.getElementById('overflow-scroll');
  　　var scrollTop = domId.scrollTop;
  　　var scrollHeight = domId.scrollHeight;
      var clientHeight = domId.clientHeight;


      if(eachPageCount.length < limit) {
        $(".loading-wrap").hide();
        return;
      }

  　　if(scrollTop + clientHeight + 10 > scrollHeight){
          index += 1;
          GetAllUsers.getAllUnReaded($scope.detailId, index).then(function(data) {
            $(".loading-wrap").hide();
              eachPageCount = data;
              $scope.allUnreadlists = $scope.allUnreadlists.concat(data)
          });
          return;
  　　}
    });
    setTimeout(function(){
      GetAllUsers.getAllUnReaded($scope.detailId, 1);
    },1000)
  }
});