angular.module('starter')
//获取已读通知
.directive('readlistItem', function($injector, DetailsNotice, SERVER, RootscopeApply) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		template: '<li>\
			<img ng-src="{{host + \'/photos/\' + readlistItem.readerCode | loginNameFilter}}"/>\
            <p>{{readlistItem.readerName}}</p>\
            </li>',
		controller: ['$scope',
			function($scope) {
				//绑定服务
				$injector.invoke(DetailsNotice.bind, this, {
					$scope: $scope
				});

				//处理变量
				$scope.detailNotice = function(data) {
					RootscopeApply($scope, function() {
					});
				};
				//获取拼头像所需要的上下文地址
				$scope.host = SERVER.host;
			}
		],
		link: function postLink(scope, ele, attrs) {
			var btnViewedPersonInfo = ele.find('img');
			btnViewedPersonInfo.bind('click', function(e){
				e.preventDefault();
				var currentLoginName = scope.readlistItem.readerCode;
				MXCommon.viewPersonInfo(currentLoginName)
			})
		}
	}
})
//获取未读通知
.directive('unreadlistItem', function($injector, DetailsNotice, SERVER, RootscopeApply) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		template: '<li>\
			<img ng-src="{{host + \'/photos/\' + unreadlistItem.readerCode | loginNameFilter}}"/>\
            <p>{{unreadlistItem.readerName}}</p>\
            </li>',
		controller: ['$scope',
			function($scope) {
				//绑定服务
				$injector.invoke(DetailsNotice.bind, this, {
					$scope: $scope
				});

				//处理变量
				$scope.detailNotice = function(data) {
					RootscopeApply($scope, function() {
					});
				};
				//获取拼头像所需要的上下文地址
				$scope.host = SERVER.host;
			}
		],
		link: function postLink(scope, ele, attrs) {
			var btnViewedPersonInfo = ele.find('img');
			btnViewedPersonInfo.bind('click', function(e){
				e.preventDefault();
				var currentLoginName = scope.unreadlistItem.readerCode;
				MXCommon.viewPersonInfo(currentLoginName)
			})
		}
	}
})
//获取已读通知
.directive('readWrap', function() {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
			}
		],
		link: function postLink(scope, ele, attrs) {
			//获取手机屏幕宽度
			var widthBox = ele[0].offsetWidth;
			//获取li的宽度以及它的margin值
			var widthLi = $('#read-list li').width() + parseInt($('#read-list li').css('marginLeft')) + parseInt($('#read-list li').css('marginRight'));
			//计算在手机屏幕上可以容纳几个li
			var count = parseInt(widthBox/widthLi);
			//将个数*每个li以及它的margin值设置为已读列表的宽度
			var widthLiNew = count * widthLi;
			$('.read-list').css('width', widthLiNew);

		}
	}
})
//获取未读通知
.directive('notreadWrap', function() {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
			}
		],
		link: function postLink(scope, ele, attrs) {
			var widthBox = ele[0].offsetWidth;
			var widthLi = $('#notread-list li').width() + parseInt($('#notread-list li').css('marginLeft')) + parseInt($('#notread-list li').css('marginRight'));
			//alert($('#notread-list li').width());
			var count = parseInt(widthBox/widthLi);
			var widthLiNew = count * widthLi;
			$('.notread-list').css('width', widthLiNew);
		}
	}
})
//删除通知
.directive('btnDel', function($injector, $ionicActionSheet, $rootScope, StateUnread, DetailsNotice, DeleteNotice, DeleteMydraftNotice, SildeMessageBinder, RootscopeApply, $ionicPopup, OperatieConfirm) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {

			}
		],
		link: function postLink(scope, ele, attrs) {
			//alert(scope.showNavBtn);
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				//获取删除的通知的id
				var id = DetailsNotice.getId();
				// var senderId = DetailsNotice.getSenderId();
				// var recevierId = DetailsNotice.getRecevierId();
				//alert(senderId);
				//alert(recevierId);
				//调用删除通知的弹窗控件
				// Show the action sheet
				var hideSheet = $ionicActionSheet.show({
					destructiveText: '删除',
					cancelText: '取消',
					cancel: function() {},
					destructiveButtonClicked: function() {
						OperatieConfirm.showDeleteConfirm(id);
					}
				});
			});
		}
	}
})
//发送提醒
.directive('btnSend', function($injector, $stateParams, DetailsNotice, SendRemind, StateMydraft, RootscopeApply,$rootScope) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
				$scope.detailsNotice = function(data) {
					// $scope.id = data.id;
					// console.log($scope.id);
					RootscopeApply($scope, function() {
					});
				};
			}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				if(scope.showNavBtn == false){
					SendRemind($stateParams.id.split('&')[0]);
				}else{
					//给未读用户发送提醒
					SendRemind($stateParams.id);
				}
			});
		}
	}
})
//关闭
.directive('btnClose', function($injector, $state, $rootScope, $location, StateMarkread) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				//alert("关闭")
				e.preventDefault();
				//根据showNavBtn判断，如果为false，执行安卓的关闭窗口js，
				//否则跳转到我的通知页面
				//alert(JSON.stringify(scope.showNavBtn));
				if(scope.showNavBtn == false){
					MXWebui.closeWindow();
				}else{
					$state.go('myNotice');
				}
			});
			//先停止其它语音的播放
      $rootScope.$broadcast('stop_audio_play');
			if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		        if($location.path() == '/noticeView'){
		        	ele.css('display', 'none')
		        }
		    }
		}
	}
})

//PC关闭
.directive('btnClosePc', function($injector, $state, $rootScope, StateMarkread) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {}
		],
		link: function postLink(scope, ele, attrs) {
			ele.bind('click', function(e) {
				e.preventDefault();
				MXWebui.closeWindow();
		        ele.removeClass('activated')
			});
			//先停止其它语音的播放
      $rootScope.$broadcast('stop_audio_play');
			if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		        ele.css('display', 'block')
		    }
		}
	}
})


//点击头像发起聊天
.directive('btnHeadpic', function($state) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
			}
		],
		link: function postLink(scope, ele, attrs) {
			// GetCurrentUser(function(result) {
			// 	//将调取选择发送人获取的字符串转换为对象类型
			// 	//var result1 = JSON.parse(result1);
			// 	scope.name = result.name
			// 	if(scope.name == scope.senderName){
			// 		$('#wrap-chat').hide();
			// 	}else{
			// 		$('#wrap-chat').css('display','block');
			// 	}
			// });
			// ele.bind('click', function(){
			// 	//点击聊天按钮发起聊天，但是不能自己和自己聊天
			// 	if(scope.loginName){
			// 		if(scope.loginName == scope.senderName) return;
			// 		MXChat.chat([scope.loginName],function(){});
			// 	}
			// });
		}
	}
})

//已读点击更多按钮查看全部未读
.directive('btnReadMore', function($state) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
			}
		],
		link: function postLink(scope, ele, attrs) {
			ele.bind('click', function(e){
				e.preventDefault();
				//跳转到详情页面
				$state.go('allReaded',{detailId: scope.detailId, type: 'read'});
			})
		}
	}
})

//未读点击更多按钮查看全部未读
.directive('btnUnreadMore', function($state) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
			}
		],
		link: function postLink(scope, ele, attrs) {
			ele.bind('click', function(e){
				e.preventDefault();
				//跳转到详情页面
				$state.go('allReaded',{detailId: scope.detailId, type: 'unread'});
			})
		}
	}
})


