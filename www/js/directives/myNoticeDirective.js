angular.module('starter')
//获取通知未读数据列表
.directive('unreadItem', function($state, $injector, StateUnread, StateMarkread, DetailsNotice, SERVER, SetMarkread, RootscopeApply, SildeMessageBinder, $rootScope) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		template: 
		'<div class="mydraft_item_container_cls" ng-click="show()">\
			<div class="layout_h_cls" style="width: 100%; float:left">\
				<div class="item_dot_cls"></div>\
				<span class="item_title_cls" ng-bind="unreadItem.title"></span>\
				<img class="myNotice-attach" src="img/icon_attach.png" width="16" height="16" ng-show="unreadItem.has_attach == true"/>\
			</div>\
			<div class="layout_h_cls">\
				<span class="item_name_cls" ng-bind="unreadItem.senderName"></span>\
				<span class="item_name_cls" style="margin-left:20px" ng-bind="unreadItem.createTime"></span>\
			</div>\
			<div class="item_content_cls" ng-bind="unreadItem.abstract">\
			</div>\
			<div style="font-size: 14px; width:100%; color:#298CCF; margin-top:20px;">确认收到 >></div>\
		</div>',
		controller: ['$scope', 'OperatieConfirm',
			function($scope, OperatieConfirm) {
				//绑定服务
				$injector.invoke(StateUnread.bind, this, {
					$scope: $scope
				});
				//获取拼头像所需要的上下文地址
				$scope.host = SERVER.host;
				
				$scope.onHold = function(e) {
					e.stopPropagation();
					OperatieConfirm.onHold($scope.unreadItem.id, ['delete']);
				}
			}
		],
		link: function postLink(scope, ele, attrs) {
			if(scope.unreadItem.content.length > 36){
				scope.unreadItem.abstract = scope.unreadItem.content.substring(0,36) + '...';

			}else
			{
				scope.unreadItem.abstract = scope.unreadItem.content;
			}

			scope.detailNotice = function(id) {
			};
			//选项卡切换效果
			ele.bind('click', function(e) {
				//初始化信息
				RootscopeApply(scope, function() {
					//DetailsNotice.initDetails(scope.unreadItem.id);
					//获取点击某条未读的信息
					scope.unreads.some(function(ele, i) {
						if (ele.id === scope.unreadItem.id) {
							unreadItem = ele;
							return true;
						}
					});
					if(MXCommon.slideWindow){
						MXCommon.slideWindow.show({'id':'details', 'url': 'noticeView?id='+ scope.unreadItem.id + '&type=1&panelType= ' + $rootScope.panelType, 'isShowTitle': false});
					}else{
						//跳转到详情页面
						$state.go('noticeDetails', {id:scope.unreadItem.id, panelType: $rootScope.panelType});
					}
					scope.title = scope.unreadItem.title;
					scope.content = scope.unreadItem.content;
					scope.loginName = scope.unreadItem.loginName;
					if(scope.unreadItem.currentUserRead === false){
						//将未读通知设置为已读
						SetMarkread.init(scope.unreadItem.id).then(function(data){
							console.log('data==>>',data)
							if(data.code == 402){
								SildeMessageBinder.tip({
									msg: data.message,
									type: 'error'
								});
								scope.unreads.splice(scope.$index, 1);
							}
							if(data.code == 200){
								SildeMessageBinder.tip({
									msg: '已发送回执',
									type: 'message'
								});
								//设置为已读后在未读列表删除一条通知
								scope.unreads.splice(scope.$index, 1);
								//alert(scope.unreadItem);
								//将点击未读的通知放入已读通知中
								StateMarkread.put(scope.unreadItem);
							}
							
						})
					}
				});
			});
		}
	}
})
//获取通知我发送的数据列表
.directive('mydraftItem', function($state, $injector, StateMydraft, DetailsNotice, SERVER, RootscopeApply, $rootScope) {
	return {
		restrict: 'A',
		replace: true,
		scope: true,
		template: 
		'<div class="mydraft_item_container_cls" ng-click="show()">\
		    <div class="layout_h_cls" style="width: 100%; float:left">\
		        <span class="item_title_cls" ng-bind="mydraftItem.title"></span>\
		        <img class="myNotice-attach" src="img/icon_attach.png" width="17" height="17" ng-show="unreadItem.has_attach == true"/>\
			</div>\
			<div class="layout_h_cls">\
			    <span class="item_name_cls" ng-bind="mydraftItem.senderName"></span>\
			    <span class="item_name_cls" style="margin-left:20px" ng-bind="mydraftItem.createTime"></span>\
			</div>\
			<div class="item_content_cls" ng-bind="mydraftItem.abstract">\
			</div>\
			<div style="font-size: 14px; width:100%; color:#298CCF; margin-top:20px;">点击查看详情 >></div>\
    	</div>',
		controller: ['$scope', 'Utils', '$ionicActionSheet', '$ionicPopup', 'DeleteNotice', 'DeleteMydraftNotice', 'OperatieConfirm',
			function($scope, Utils, $ionicActionSheet, $ionicPopup, DeleteNotice, DeleteMydraftNotice, OperatieConfirm) {

				//绑定服务
				$injector.invoke(StateMydraft.bind, this, {
					$scope: $scope
				});
				$scope.isPc = Utils.isPc();
				$scope.host = SERVER.host;
				$scope.onHold = function(e) {
					e.stopPropagation();
					OperatieConfirm.onHold($scope.mydraftItem.id, ['delete', 'revoke']);
				}

				$scope.showDeleteConfirm = function(e) {
					e && e.stopPropagation()
					OperatieConfirm.showDeleteConfirm($scope.mydraftItem.id);
				};
				$scope.showRevokeConfirm = function(e) {
					e && e.stopPropagation()
					OperatieConfirm.showRevokeConfirm($scope.mydraftItem.id);

				}
			}
		],
		link: function postLink(scope, ele, attrs) {
			if(scope.mydraftItem.content.length > 40){
				scope.mydraftItem.abstract = scope.mydraftItem.content.substring(0,40) + '...';

			}else
			{
				scope.mydraftItem.abstract = scope.mydraftItem.content;
			}

			scope.detailNotice = function(id) {
			};
			//选项卡切换效果
			ele.bind('click', function(e) {
				RootscopeApply(scope, function() {
					//初始化信息
					//DetailsNotice.initDetails(scope.mydraftItem.id);
					//获取点击某条我发送信息的信息
					scope.mydrafts.some(function(ele, i) {
						if (ele.id === scope.mydraftItem.id) {
							mydraftItem = ele;
							return true;
						}
					});
					if(MXCommon.slideWindow){
						MXCommon.slideWindow.show({'id':'details', 'url': 'noticeView?id='+ scope.mydraftItem.id + '&type=1&panelType= ' + $rootScope.panelType, 'isShowTitle': false});
					}else{
						//跳转到详情页面
						$state.go('noticeDetails', {id:scope.mydraftItem.id, panelType: $rootScope.panelType});
					}
					scope.title = scope.mydraftItem.title;
					scope.content = scope.mydraftItem.content;
				});
			});
		}
	}
})
//获取通知已读数据列表
.directive('markreadItem', function($state, $injector, StateUnread, StateMarkread, DetailsNotice, SERVER, RootscopeApply, $rootScope) {
	return {
			restrict: 'A',
			replace: true,
			scope: true,
			template: 
			'<div class="mydraft_item_container_cls" ng-click="show()">\
		        <div class="layout_h_cls" style="width: 100%; float:left">\
		            <span class="item_title_cls" ng-bind="markreadItem.title"></span>\
		            <img class="myNotice-attach" src="img/icon_attach.png" width="17" height="17" ng-show="unreadItem.has_attach == true"/>\
			    </div>\
			    <div class="layout_h_cls">\
			        <span class="item_name_cls" ng-bind="markreadItem.senderName"></span>\
			        <span class="item_name_cls" style="margin-left:20px" ng-bind="markreadItem.createTime"></span>\
			    </div>\
			<div class="item_content_cls" ng-bind="markreadItem.abstract">\
			</div>\
			<div style="font-size: 14px; width:100%; color:#298CCF; margin-top:20px;">点击查看详情 >></div>\
    	    </div>',
			controller: ['$scope', 'OperatieConfirm',
				function($scope, OperatieConfirm) {
					//绑定服务
					$injector.invoke(StateMarkread.bind, this, {
						$scope: $scope
					});
					$scope.host = SERVER.host;
					$scope.onHold = function(e) {
						e.stopPropagation();
						OperatieConfirm.onHold($scope.markreadItem.id, ['delete']);
					}
				}
				
			],
			link: function postLink(scope, ele, attrs) {
				if(scope.markreadItem.content.length > 40){
					scope.markreadItem.abstract = scope.markreadItem.content.substring(0,40) + '...';
	
				}else
				{
					scope.markreadItem.abstract = scope.markreadItem.content;
				}
				scope.detailNotice = function(id) {
				};
				//选项卡切换效果
				ele.bind('click', function(e) {
				RootscopeApply(scope, function() {
					//初始化信息
					//DetailsNotice.initDetails(scope.markreadItem.id);
					//获取点击某条已读信息的信息
					scope.markreads.some(function(ele, i) {
						if (ele.id === scope.markreadItem.id) {
							markreadItem = ele;
							return true;
						}
					});
					if(MXCommon.slideWindow){
						//$state.go('noticeDetails', {id:scope.markreadItem.id});
						MXCommon.slideWindow.show({'id':'details', 'url': 'noticeView?id='+ scope.markreadItem.id + '&type=1&panelType= ' + $rootScope.panelType, 'isShowTitle': false});
					}else{
						//跳转到详情页面
						$state.go('noticeDetails', {id:scope.markreadItem.id, panelType: $rootScope.panelType});
					}
					var data = scope.markreadItem;
					$rootScope.$broadcast('data',data);
					scope.title = scope.markreadItem.title;
					scope.content = scope.markreadItem.content;
					//alert(scope.title);
				});
			});
		}
	}
})
//获取通知未读选项卡按钮
.directive('unreadTab', function($injector, $ionicLoading, StateUnread, StateMydraft, StateMarkread, RootscopeApply) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				//StateMydraft.clear();
				//StateMarkread.clear();
				//显示加载状态
				$ionicLoading.show({
			    content: 'Loading',
			    animation: 'fade-in',
			    showBackdrop: true,
			    maxWidth: 200,
			    showDelay: 0
		 		});
				//调用init方法
				StateUnread.init();
				//getSSOToken('notification'); return false;
			});
		}
	}
})
//获取通知我发送的选项卡按钮
.directive('mydraftTab', function($injector, $ionicLoading, StateUnread, StateMydraft, StateMarkread) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {
			}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				//StateUnread.clear();
				//StateMydraft.clear();
				//显示加载状态
				$ionicLoading.show({
			    content: 'Loading',
			    animation: 'fade-in',
			    showBackdrop: true,
			    maxWidth: 200,
			    showDelay: 0
		 		});
				StateMydraft.init();
			});
		}
	}
})
//获取通知已读的选项卡按钮
.directive('markreadTab', function($injector, $ionicLoading, StateUnread, StateMarkread, StateMydraft, RootscopeApply) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				//StateMydraft.clear();
				//StateUnread.clear();
				//显示加载状态
				$ionicLoading.show({
			    content: 'Loading',
			    animation: 'fade-in',
			    showBackdrop: true,
			    maxWidth: 200,
			    showDelay: 0
		 		});
				StateMarkread.init();
			});
		}
	}
})
//获取通知未读列表父级
.directive('unreadNotice', function($injector, $ionicLoading, StateUnread, StateMydraft, SendNotice, DeleteNotice, DetailsNotice, SildeMessageBinder) {
	return {
		restrict: 'A',
		scope: true,
		controller: ['$scope', '$state', 'StateUnread', 'SendNotice', 'DeleteNotice', 'RootscopeApply', '$timeout', '$injector',
			'$ionicGesture', '$ionicNavBarDelegate',
			function($scope, $state, StateUnread, SendNotice, DeleteNotice, RootscopeApply, $timeout, $injector,
				$ionicGesture, $ionicNavBarDelegate) {
				//绑定服务
				$injector.invoke(StateUnread.bind, this, {
					$scope: $scope
				});
				//处理变量
				$scope.scopeWorker = function(data) {
					RootscopeApply($scope, function() {
						$scope.unreads = data;
					});
				};
				//显示加载状态
				$ionicLoading.show({
				    content: 'Loading',
				    animation: 'fade-in',
				    showBackdrop: true,
				    maxWidth: 200,
				    showDelay: 0
		 		});
		 		if(navigator.onLine === false) {
		          	//提示发送失败
			        SildeMessageBinder.tip({
			            msg: '网络连接异常，请检查您的网络',
			            type: 'error'
		          	});
		          	$ionicLoading.hide();
				}
				//接收广播
				$scope.$on('mydraft', function() {
					console.log('mydraft')
					//初始化信息
					StateUnread.init();
				});
			}
		]
	}
})
//获取我发送的通知未读列表父级
.directive('mydraftNotice', function($injector, StateMydraft, DetailsNotice, SendNotice, DeleteNotice) {
	return {
		restrict: 'A',
		scope: true,
		controller: ['$scope', '$state', 'StateMydraft', 'SendNotice', 'DetailsNotice', 'DeleteNotice', 'RootscopeApply', '$timeout', '$injector',
			'$ionicGesture', '$ionicNavBarDelegate',
			function($scope, $state, StateMydraft, SendNotice, DetailsNotice ,DeleteNotice, RootscopeApply, $timeout, $injector,
				$ionicGesture, $ionicNavBarDelegate) {
				//绑定服务
				$injector.invoke(StateMydraft.bind, this, {
					$scope: $scope
				});

				//处理变量
				$scope.scopeWorker = function(data) {
					RootscopeApply($scope, function() {
						$scope.mydrafts = data;
						//alert($scope.mydrafts);
					});
				};
				//新增我发送的信息
				$scope.addMydraftNotice = function(data) {
					RootscopeApply($scope, function() {
						//将我发送的列表数据默认显示在顶部第一条
						$scope.mydrafts.unshift(data);
					});
				};
				//删除我发送的信息
				$scope.delMydraftNotice = function(id) {
					RootscopeApply($scope, function() {
						$scope.mydrafts.splice(scope.$index, 1);
					});
				};
				//初始化信息
				//StateMydraft.init();
			}
		]
	}
})
//获取通知已读列表父级
.directive('markreadNotice', function($injector, $ionicLoading, $rootScope, StateMarkread, StateMydraft, SendNotice, DetailsNotice) {
	return {
		restrict: 'A',
		scope: true,
		controller: ['$scope', '$state', 'StateMarkread', 'SendNotice', 'RootscopeApply', '$timeout', '$injector',
			'$ionicGesture', '$ionicNavBarDelegate', 'DetailsNotice',
			function($scope, $state, StateMarkread, SendNotice, RootscopeApply, $timeout, $injector,
				$ionicGesture, $ionicNavBarDelegate, DetailsNotice) {
				//绑定服务
				$injector.invoke(StateMarkread.bind, this, {
					$scope: $scope
				});
				//处理变量
				$scope.scopeWorker = function(data) {
					RootscopeApply($scope, function() {
						$scope.markreads = data;
						//alert($scope.markreads);
					});
				};
				//StateMarkread.delMarkreadNotice(data);
				//初始化信息
				//StateMarkread.init();
			}
		]
	}
})
//获取通知已读列表父级
.directive('btnAdd', function($injector, $state, StateMarkread, AddSelectUsers, AddPictures) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				//点击添加按钮跳转到新建通知页面
				$state.go('addNotice');
				$('#title').val('');
				$('#textarea').val('');
				$('.selectUser-item').remove();
				$('.bt-del').hide();
				$('.img-wrap .img').remove();
				// AddSelectUsers.clear();
				// AddPictures.clear();
			});
		}
	}
})
//关闭
.directive('btnBack', function($injector, $state, StateMarkread) {
	return {
		restrict: 'A',
		controller: ['$scope',
			function($scope) {}
		],
		link: function postLink(scope, ele, attrs) {
			//选项卡切换效果
			ele.bind('click', function(e) {
				e.preventDefault();
				//调用安卓的关闭窗口js
				MXWebui.closeWindow();
			});
			if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		        ele.css('display', 'none')
		    }
		}
	}
})