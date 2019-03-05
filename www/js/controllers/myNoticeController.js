angular.module('starter')
//最外层父级controller
.controller('MyNoticeAllCtrl', function($scope, $rootScope, $location, $ionicLoading, $timeout) {
  	$rootScope.panelType = 1;
})
//通知切换的列表的controller
.controller('MyNoticeCtrl', function($scope){
})