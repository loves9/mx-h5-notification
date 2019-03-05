angular.module('starter')

//错误处理
.factory('PopMessage', ['RootscopeApply',
	function(RootscopeApply) {
		var o = {};
		var that, scope;

		var noPermission = function(data) {
			var msg = data.errors.message;

			that.showMessage(msg);
		};

		o.bind = function($scope) {
			that = this;
			scope = $scope;
		};

		o.err = function(err) {
			var status = err.status || 0;
			var msg = '请求失败，请稍后重试.';
			var opt = {
				msg: msg,
				type: 0
			};

			switch(status) {
				case 401:
					refreshToken();
					break;
				case 403:
					opt.msg = err.data.errors.message;
					o.tip(opt);
					break;
				case 502:
					o.tip(opt);
					break;
				case 500:
					o.tip(opt);
					break;
				default:
					opt.msg = err.message || msg;
					o.tip(opt);
			}
		};

		/**
		 * 显示滑动提示
		 * @param options[Object]: 初始化的参数
		 *			options.msg[String]: 提示信息
		 *			options.type[String]: 提示类型{0: '错误提示'; 1: '消息提示'}
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