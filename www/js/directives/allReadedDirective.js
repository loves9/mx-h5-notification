angular.module('starter')
//获取已读通知
.directive('allReadlistItem', function($injector, DetailsNotice, SERVER, RootscopeApply) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		template: '<li>\
						<img ng-src="{{host + \'/photos/\' + allReadlistItem.readerCode | loginNameFilter}}"/>\
            <p>{{allReadlistItem.readerName}}</p>\
            </li>',
		controller: ['$scope',
			function($scope) {
				//获取拼头像所需要的上下文地址
				$scope.host = SERVER.host;
			}
		],
		link: function postLink(scope, ele, attrs) {
			var btnViewedPersonInfo = ele.find('img');
			btnViewedPersonInfo.bind('click', function(){
				var currentLoginName = scope.allReadlistItem.readerCode;
				MXCommon.viewPersonInfo(currentLoginName)
			})
		}
	}
})
//获取未读通知
.directive('allUnreadlistItem', function($injector, DetailsNotice, SERVER, RootscopeApply) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		template: '<li>\
						<img ng-src="{{host + \'/photos/\' + allUnreadlistItem.readerCode | loginNameFilter}}"/>\
            <p>{{allUnreadlistItem.readerName}}</p>\
            </li>',
		controller: ['$scope',
			function($scope) {
				//获取拼头像所需要的上下文地址
				$scope.host = SERVER.host;
			}
		],
		link: function postLink(scope, ele, attrs) {
			var btnViewedPersonInfo = ele.find('img');
			btnViewedPersonInfo.bind('click', function(){
				var currentLoginName = scope.allUnreadlistItem.readerCode;
				MXCommon.viewPersonInfo(currentLoginName)
			})
		}
	}
})