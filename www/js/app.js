 // Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','pascalprecht.translate'])

.run(function($ionicPlatform, $http, $rootScope, $location, $ionicHistory, SERVER, SildeMessageBinder, GetNative, $state, StateUnread, $ionicLoading) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// falert(window.location.href)or form inputs)
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
		//当进入通知的页面时就获取ssoToken以及服务器地址
		function onDeviceReady() {
			GetNative();
		    //如果conversation_id存在，并且type不存在，则跳转到新建通知
		    //如果conversation_id和id都不存在，就跳转到通知首页
		   // 	if(!request.conversation_id && !request.id){
		   // 		getSSOToken('app_notification');

		   //      function tokenCallBack(result) {
		   //          //将获取到的token数据放到header中的Authorization字段中
		   //          $http.defaults.headers.common['MX-Authorization'] = result;
		   //          getServerUrl();
		   //      }

		   //      function urlCallBack(result) {
		   //          //将获取到的url放到header中的SERVER字段中
					// StateUnread.init(result);
			  //   	$state.go('myNotice');
					// 	$ionicLoading.show({
					//     content: 'Loading',
					//     animation: 'fade-in',
					//     showBackdrop: true,
					//     maxWidth: 200,
					//     showDelay: 0
			 	// 	});
		   //      }
		   //      //通过ocuID获取ssoToken方法
		   //      function getSSOToken(ocuID) {
		   //          MXCommon.getSSOToken(ocuID, tokenCallBack);
		   //      }
		   //      //获取服务器地址方法
		   //      function getServerUrl() {
		   //          MXCommon.getServerUrl(urlCallBack);
		   //      }
		   //  }
			//showIos1();
	  }
	 //  function showIos1(){
		// 	//alert(111);
		// 	//StatusBar.overlaysWebView(doOverlay);
		// }
	  document.addEventListener("deviceready", onDeviceReady, false);
 	});
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider, SERVER, $compileProvider, $sceProvider, $sceDelegateProvider, $ionicConfigProvider) {
  $ionicConfigProvider.backButton.text("");
  $ionicConfigProvider.backButton.previousTitleText(false);
	$stateProvider
	//我的通知
	.state('myNotice', {
			url: '/',
			templateUrl: 'templates/myNotice.html',
			controller: 'MyNoticeCtrl'
	})
	//新建通知
	.state('addNotice', {
			url: '/addNotice?conversation_id',
			templateUrl: 'templates/addNotice.html',
			controller: 'AddNoticeCtrl',
	})
	//全部已读/未读
	.state('allReaded', {
			url: '/allReaded?detailId&type',
			templateUrl: 'templates/allReaded.html',
			controller: 'AllReadedCtrl',
	})
	//通知详情
	.state('noticeDetails', {
		url: '/noticeView?id&type&panelType',
		templateUrl: 'templates/noticeDetails.html',
		//controller: 'NoticeDetailsCtrl'
		controller: function ($scope, $ionicActionSheet, $rootScope,$ionicLoading,$timeout,DetailsNotice,$stateParams,$sce,
			$injector,SERVER,SetMarkread,SendRemind,GetNative,RootscopeApply, GetCurrentUser,  SildeMessageBinder, GetAttachment, $filter) {
			var detailId = $stateParams.id.split('&')[0];
			var panelType = $stateParams.panelType;
				if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
					$ionicLoading.hide();
					$('.buttons-left').hide();
					$scope.$on('mydraft', function(e, server) {
						//获取头像
						$scope.avatar_url = $filter('loginNameFilter')(server.host + '/photos/' + $scope.loginName);
					});
				}
				$scope.id = {};
				//如果从我的通知获取到的通知存在，就将id传递给通知详情页面
				if (detailId) {
					//绑定服务
					$injector.invoke(DetailsNotice.bind, this, {
						$scope: $scope
					});
					RootscopeApply($scope, function() {
						$scope.showNavBtn = true;
					});
					//如果type为1的话，代表是从附件栏发送成功的消息，同在敏行推送过来的处理
					if($rootScope.panelType && $stateParams.type == '1'){
						//DetailsNotice.initDetails(detailId);
						$scope.showNavBtn = false;
					}
	  			if(!$rootScope.panelType && $stateParams.type == '1'){
		    		//若是从敏信推送过来的通知那里查看的话，将删除按钮隐藏掉
		      		$scope.showNavBtn = false;
		      		$scope.$on('mydraft', function(e, data) {
		      			DetailsNotice.initDetails(detailId, panelType);
		      		});
			  	}
				}
				DetailsNotice.initDetails(detailId,panelType);
				//设置我发送的字段信息
				// Setup the loader
				$ionicLoading.show({
				    content: 'Loading',
				    animation: 'fade-in',
				    showBackdrop: true,
				    maxWidth: 200, 
				    showDelay: 0
				});
				function formatLoginName(name) {
					name = name.indexOf('\\') > -1
						? name
						: name.replace(/\\/, '\\\\');
					return encodeURI(name);
				}
				$scope.detailNotice = function(data){
					data = angular.copy(data);
					RootscopeApply($scope, function() {
					    MXCommon.getCurrentUser(
					        getCurrentUserCallBack
					    )
					    function getCurrentUserCallBack(currentUser) {
					      	if(currentUser.name == data.senderName || data.code == 401 || data.code == 500){
					      		$('#wrap-chat').hide();
					      	}else{
								// $('#wrap-chat').css('display','block');
								$('#wrap-chat').bind('click', function(){
								MXChat.chat([data.loginName],function(){});
								if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
									MXWebui.closeWindow();
								}
								});
							}
					    }
				    	$scope.title = data.title;
						//$scope.content = $.trim(data.content).replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\n/g, '<br/>');
						//alert($scope.content)
						$scope.content = $sce.trustAsHtml(data.content);
						$scope.loginName = data.loginName;
						$scope.createTime = data.createTime;
						//获取头像
						$scope.avatar_url = $filter('loginNameFilter')(SERVER.host + '/photos/' + $scope.loginName);
						$scope.senderName= data.senderName;
						$scope.readlists = data.reads;
						$scope.unreadlists = data.unreads;
						$scope.detailId = detailId;
						//将未读列表数组复制一份为cutUnreadlists
						$scope.cutUnreadlists = angular.copy($scope.unreadlists);
						//如果cutUnreadlists的长度大于18
						if($scope.cutUnreadlists && $scope.cutUnreadlists.length > 15){
							//只保留前18个未读的人
							$scope.cutUnreadlists.splice(14);
						}
						//将已读列表数组复制一份为cutReadlists
						$scope.cutReadlists= angular.copy($scope.readlists);
						//如果cutUnreadlists的长度大于18
						if($scope.cutReadlists && $scope.cutReadlists.length > 15){
							//只保留前18个未读的人
							$scope.cutReadlists.splice(14);
						}
						$scope.senderId = data.senderId;
						$scope.currentUserRead = data.currentUserRead;
						//如果title不存在，则显示该消息已删除
						if(!$scope.title){
							$('#taskDetails-list').addClass('empty-notice');
						}
					});
				};
			//})
  	}
	})
	// if none of the above states are matched, use this as the fallback
	//如果从通过附件栏添加的通知应用进入的话，直接跳转到"新建通知页面
	//获取hash后面的所有参数
	function UrlSearch() {
	   var name,value;
	   var str=location.href; //取得整个地址栏
	   var num=str.indexOf("#")
	   str=str.substr(num+2); //取得所有参数   stringvar.substr(start [, length ]

	   var arr=str.split("&"); //各个参数放到数组里
	   for(var i=0;i < arr.length;i++){
	    num=arr[i].indexOf("=");
	    if(num>0){
	     name=arr[i].substring(0,num);
	     value=arr[i].substr(num+1);
	     this[name]=value;
	     }
	    }
	}
	var request=new UrlSearch(); //实例化
	//如果conversation_id存在，并且type不存在，则跳转到新建通知
    //如果conversation_id和id都不存在，就跳转到通知首页
	if(request.conversation_id && !request.type){
    	window.location.href="#addNotice?conversation_id=" + request.conversation_id;
    }
    if(!request.conversation_id && !request.id){
		$urlRouterProvider.otherwise('/');
    }
	//国际化
	// $translateProvider.useStaticFilesLoader({
	// 	prefix: 'i18n/',
	// 	suffix: '.json'
	// });
	// $translateProvider.registerAvailableLanguageKeys(['en','zh'],{
	//     'en-*': 'en',
	//     'zh-*': 'zh'
	// });
	//协议白名单，增加了mxlocalresources，否则图片会不显示，会自动增加unsafe
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|mxlocalresources):|data:image\//);
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|app|data|javascript):/);
	$sceProvider.enabled(false);

	//$translateProvider.determinePreferredLanguage();
 })

.constant('SERVER', {
	 //拼头像所需要的url
     host: '',
	 //请求所需要的url
     url: ''
})