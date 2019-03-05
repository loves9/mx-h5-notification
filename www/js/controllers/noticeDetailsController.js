angular.module('starter')
//通知详情的controller
.controller('NoticeDetailsCtrl', function($scope, $state, $ionicActionSheet, $timeout,
   $ionicGesture, $ionicNavBarDelegate, $stateParams) {
	if ($stateParams.id) {
       console.info('跳转到了main.newMsg', JSON.parse($stateParams.id));
	}
})