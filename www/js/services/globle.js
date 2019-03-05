angular.module('starter')
//顶部消息提醒
.factory('SildeMessageBinder', ['RootscopeApply',
	function(RootscopeApply) {
		var o = {};
		var that, scope;

		o.bind = function($scope) {
			that = this;
			scope = $scope;
		};

		/**
		 * 显示滑动提示
		 * @param options[Object]: 初始化的参数
		 *			options.msg[String]: 提示信息
		 *			options.type[String]: 提示类型{'error': '错误提示'; 'message': '消息提示'}
		 * 			options.time[Number]: 持续时间
		 */
		o.tip = function(options) {
			RootscopeApply(scope, function() {
				that.showMessage(options);
			});
		};

		return o;
	}
])
//用于scope需要apply的逻辑
.factory('RootscopeApply', ['$rootScope', function($rootScope) {
	return function($scope, fn) {
		if (!$rootScope.$$phase) {
			$scope.$apply(fn);
		} else {
			fn();
		}
	};
}])
.factory('Utils', [function() {
	var service = {
		isPc: isPc
	};

	return service;

	function isPc() {
		return !(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))
			|| (navigator.userAgent.indexOf('PC Client') > -1)
	}
}])