angular.module('starter')
//点击发送按钮
.directive('addNotice', function(RootscopeApply, SendNotice, $injector, $state, StateMydraft, AddSelectUsers, StateUnread, $rootScope, AddPictures, $ionicLoading, SildeMessageBinder, SERVER) {
    return {
        restrict: 'A',
        controller: ['$scope',
            function($scope) {
                //绑定服务
                $injector.invoke(AddSelectUsers.bind, this, {
                    $scope: $scope
                });
                //清除选人信息数据
                $scope.clear = function() {
                    RootscopeApply($scope, function() {
                        $scope.receivers = [];
                    });
                }
                //将收到的图片广播出去
                $scope.$on('picItems', function(event, picItems) {
                    $scope.picItems = picItems;
                })
            }
        ],
        //链接函数
        link: function postLink(scope, ele, attrs) {
            //声明正在发送
            var isSending = false;
            ele.bind('click', function(e) {
                e.preventDefault();
                if (isSending === true) {
                    return;
                }
                scope.picItems = AddPictures.getPicture();
                //上传图片方法
                if (scope.picItems.length > 0) {
                    var images = {
                        serverId: []
                    };
                    //上传图片方法
                    var i = 0,
                        length = scope.picItems.length;
                    images.serverId = [];
                    //如果必填信息校验不成功，则不进行图片上传操作
                    if (SendNotice.genData() != false) {
                        //if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                        var localIds = [];
                        for (var i = 0; i < scope.picItems.length; i++) {
                            if (scope.picItems[i].url || scope.picItems[i].fid) {
                                if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || (navigator.userAgent.indexOf('PC Client') > -1)) {
                                    localIds.push(scope.picItems[i].timestamp)
                                }else {
                                    localIds.push(scope.picItems[i].url)
                                }
                            } else {
                                localIds.push(scope.picItems[i].localIds)
                            }
                        };
                        scope.picItems = localIds;

                        function upload() {
                            //显示加载状态
                            $ionicLoading.show({
                                content: 'Loading',
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
                            if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                                console.log('loading进入判断条件了')
                            }
                            MXCommon.uploadFile(scope.picItems, true, completeUploadCallback, errorUploadCallBack);
                        }
                        upload();
                    }

                    function completeUploadCallback(result) {
                        var attachs = JSON.parse(result).map(function(item) {
                            var ret = {
                                file_id: item.serverId,
                                name: item.name,
                                size: item.size,
                                content_type: item.contentType,
                                finger_print: item.fingerprint,
                                file_pointer: item.file_pointer
                            }
                            if (item.source) {
                                ret.source = item.downloadUrl ? 2 : item.source
                            }
                            if (item.upload_type) {
                                ret.upload_type = item.upload_type
                            }
                            if (item.downloadUrl) {
                                ret.disk_url = item.downloadUrl;
                                ret.source = 2;
                                ret.file_id = -1;
                            }
                            return ret;
                        })
                        $rootScope.$broadcast('attachs', attachs);
                        isSending = true;

                        //将通过通讯录选人获取到的数据存到data中
                        SendNotice.save().then(function(data) {
                            console.log('data:::', data)
                            //data.code不存在，代表发送成功，存在的话，代表有错误
                            if (!data.code && navigator.onLine === true && SERVER.url) {
                                //提示发送成功
                                SildeMessageBinder.tip({
                                    msg: '发送成功',
                                    type: 'message'
                                });
                                //如果是从附件栏发送的通知，需要将type为传递过去，并跳转到详情页面
                                //否则跳转到通知的首页
                                if (!$rootScope.panelType) {
                                    var params = {
                                        id: data.id,
                                        type: '1',
                                        panelType: 10
                                    }
                                    $state.go('noticeDetails', params);
                                    //StateUnread.init();
                                    //window.location.href = "#noticeView?id=" + data.id + "&type=1"
                                } else {
                                    //跳转到我的通知页面
                                    $state.go('myNotice');
                                    StateUnread.init();
                                }
                                //点击取消将选择的接收人清空
                                AddSelectUsers.clear();
                                AddPictures.clear();
                                isSending = false;
                                //StateUnread.init();
                                $('#title').val('');
                                $('#textarea').val('');
                                $('.selectUser-item').remove();
                                $('.bt-del').hide();
                                $('.img-wrap .img').remove();
                            } else {
                                //提示发送失败
                                SildeMessageBinder.tip({
                                    msg: '发送失败',
                                    type: 'error'
                                });
                                $ionicLoading.hide();
                                isSending = false;
                            }
                        }, function(data) {
                            $ionicLoading.hide();
                            isSending = false;
                            SildeMessageBinder.tip({
                                msg: JSON.stringify(data.message),
                                type: 'error'
                            });
                            //StateUnread.init();
                        });
                    }

                    function errorUploadCallBack(result) {
                        isSending = false;
                        $ionicLoading.hide();
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                            if (result) {
                                SildeMessageBinder.tip({
                                    msg: result,
                                    type: 'error'
                                });
                            } else {
                                SildeMessageBinder.tip({
                                    msg: '上传失败',
                                    type: 'error'
                                });
                            }
                        } else {
                            SildeMessageBinder.tip({
                                msg: '上传失败',
                                type: 'error'
                            });
                        }
                        //alert("上传失败!");
                    }
                } else {
                    isSending = true;
                    //alert('isSending' + isSending);
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    //发送信息
                    //异步操作，将isSending设为false;
                    SendNotice.save().then(function(data) {
                        console.log('data:::', data)
                        console.log('navigator.onLine:::', navigator.onLine)
                        //data.code不存在，代表发送成功，存在的话，代表有错误
                        if (!data.code && navigator.onLine === true && SERVER.url) {
                            //提示发送成功
                            SildeMessageBinder.tip({
                                msg: '发送成功',
                                type: 'message'
                            });
                            //如果是从附件栏发送的通知，需要将type为传递过去，并跳转到详情页面
                            //否则跳转到通知的首页
                            if (!$rootScope.panelType) {
                                var params = {
                                    id: data.id,
                                    type: '1',
                                    panelType: 10
                                }
                                $state.go('noticeDetails', params);
                                //StateUnread.init();
                                //window.location.href = "#noticeView?id=" + data.id + "&type=1"
                            } else {
                                //跳转到我的通知页面
                                $state.go('myNotice');
                                StateUnread.init();
                            }
                            //点击取消将选择的接收人清空
                            AddSelectUsers.clear();
                            AddPictures.clear();
                            isSending = false;
                            //StateUnread.init();
                            $('#title').val('');
                            $('#textarea').val('');
                            $('.selectUser-item').remove();
                            $('.bt-del').hide();
                            $('.img-wrap .img').remove();
                        } else {
                            //提示发送失败
                            SildeMessageBinder.tip({
                                msg: '发送失败',
                                type: 'error'
                            });
                            $ionicLoading.hide();
                            isSending = false;
                        }
                    }, function(data) {
                        //alert('data:::' + JSON.stringify(data))
                        $ionicLoading.hide();
                        isSending = false;
                        if (data) {
                            SildeMessageBinder.tip({
                                msg: JSON.stringify(data.message),
                                type: 'error'
                            });
                        }
                        //StateUnread.init();
                    });
                }
            });
        }
    }
})
//点击取消按钮
.directive('cancelNotice', function($state, $injector, AddSelectUsers, SendNotice, RootscopeApply, $rootScope, StateUnread, $stateParams, AddPictures) {
    return {
        restrict: 'A',
        controller: ['$scope',
            function($scope, $stateParams) {
                //绑定服务
                $injector.invoke(AddSelectUsers.bind, this, {
                    $scope: $scope
                });
                $injector.invoke(AddPictures.bind, this, {
                    $scope: $scope
                });
                //清除选人信息数据
                $scope.clear = function() {
                    RootscopeApply($scope, function() {
                        $scope.receivers = [];
                        $scope.title = '';
                        $scope.content = '';
                    });
                }
            }
        ],
        //链接函数
        link: function postLink(scope, ele, attrs) {
            ele.bind('click', function(e) {
                e.preventDefault();
                //如果是从附件栏添加的通知，点击取消按钮则关闭页面，否则跳转到上一级页面
                if (!$rootScope.panelType) {
                    MXWebui.closeWindow();
                } else {
                    $('#title').val('');
                    $('#textarea').val('');
                    $('.selectUser-item').remove();
                    $('.bt-del').hide();
                    $('.img').remove();
                    $('.img-wrap .img').remove();
                    //receiverHtml
                    AddSelectUsers.clear();
                    AddPictures.clear();
                    //跳转到我的通知页面
                    $state.go('myNotice');
                    StateUnread.init();
                }
            });
        }
    }
})
.directive('inputChange', function() {
    return {
        scope: true,
        link: function(scope, ele, attrs) {
            ele.on('input', function(e) {
                scope.$eval(attrs.inputChange, {$event: e.target.value})
            })
        }
    }
})
//新建通知列表
.directive('noticeForm', function(RootscopeApply, SendNotice, $injector, $state, $ionicModal, $rootScope, $stateParams, SelectUsers, GetCurrentUser, AddSelectUsers, AddPictures, SildeMessageBinder, GetLoginName, $ionicGesture) {
    return {
        restrict: 'A',
        controller: ['$scope', '$ionicModal', '$ionicGesture', '$timeout',
            function($scope, $ionicModal, $ionicGesture, $timeout) {
                //绑定服务
                $injector.invoke(SendNotice.bind, this, {
                    $scope: $scope
                });
                function UrlSearch() {
                    var name, value;
                    var str = location.href; //取得整个地址栏
                    var num = str.indexOf("#")
                    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
                    var arr = str.split("?"); //各个参数放到数组里
                    for (var i = 0; i < arr.length; i++) {
                        num = arr[i].indexOf("=");
                        if (num > 0) {
                            name = arr[i].substring(0, num);
                            value = arr[i].substr(num + 1);
                            this[name] = value;
                        }
                    }
                }
                var request = new UrlSearch(); //实例化
                var conversation_id = request.conversation_id;
                if (conversation_id && window.MXChat) {
                    onDeviceReady();
                } else if (conversation_id) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                }
                function onDeviceReady() {
                    MXChat.getConversationByID(conversation_id, getConversationByIDCallback //callback
                    );

                    function getConversationByIDCallback(result) {
                        RootscopeApply($scope, function() {
                            GetCurrentUser(function(result1) {
                                //将调取选择发送人获取的字符串转换为对象类型
                                //var result1 = JSON.parse(result1);
                                $scope.senderId = result1.id;
                                $scope.senderName = result1.name;
                                $scope.loginName = result1.login_name;
                            });
                            var receiversByCon = [];
                            var login_name;
                            for (var i = 0; i < JSON.parse(result).persons.length; i++) {
                                var obj = JSON.parse(result).persons[i];
                                if (!obj.login_name) {
                                    var id = obj.id;
                                    GetLoginName.getLoginName(id).then(function(data) {
                                        obj.type = 'user';
                                        receiversByCon.push(obj);
                                        $scope.receivers = receiversByCon;
                                    }, function(data) {
                                    })
                                } else {
                                    obj.type = 'user';
                                    receiversByCon.push(obj);
                                    $scope.receivers = receiversByCon;
                                }
                            }
                            //$scope.receivers = receiversByCon;
                            //$scope.receivers = receiversByCon;
                            //alert('$scope.receivers' + JSON.stringify($scope.receivers));
                            //将群里面的人进行保存
                            AddSelectUsers.saveUser($scope.receivers);
                            //如果进行了删除操作，将接收到的人重新赋值
                            $scope.$on('receiverListsDel', function(event, receiverListsDel) {
                                $scope.receivers = receiverListsDel;
                            });
                        });
                    }
                }
                //数组去重方法
                var delRepeat = function(array) {
                    var n = []; //一个新的临时数组存储id
                    var n1 = []; //另一个数组存储新的不重复对象
                    for (var i = 0; i < array.length; i++) //遍历当前数组
                    {
                        if (array[i].type === 'user') {
                            //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                            if (n.indexOf(array[i].id) == -1) {
                                //将当前项的idpush到临时数组里面
                                n.push(array[i].id);
                                //将当前项的对象放入新数组中
                                n1.push(array[i]);
                            }
                        }
                        if (array[i].type === 'department') {
                            //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                            if (n.indexOf(array[i].dept_id) == -1) {
                                //将当前项的idpush到临时数组里面
                                n.push(array[i].dept_id);
                                //将当前项的对象放入新数组中
                                n1.push(array[i]);
                            }
                        }
                    }
                    return n1;
                };
                RootscopeApply($scope, function() {
                    $scope.receivers = delRepeat(AddSelectUsers.getUser());
                    //$scope.receivers = AddSelectUsers.getUser();
                });
                $scope.$on('attachs', function(event, attachs) {
                    $scope.attachs = attachs;
                })
                 var dataroot="config.json";
                $.getJSON(dataroot, function(data){
                    var titleMaxNum = data.titleMaxNum;
                    $scope.titleMaxNum = titleMaxNum;
                    var contentMaxNum = data.contentMaxNum;
                    $scope.contentMaxNum = contentMaxNum;
                    $scope.titleNum = Number(titleMaxNum)
                    $scope.titleInputChange = function(title) {
                        console.log('$scope.title =>', title.length);
                        $timeout(function() {
                            if(title){
                                if(title.length > Number(titleMaxNum)){
                                    $scope.title = $scope.title.substring(0, Number(titleMaxNum));
                                    SildeMessageBinder.tip({
                                      msg: '输入内容达到最大字数限制，请使用附件形式发送',
                                      type: 'error'
                                    });
                                }else {
                                    $scope.title = title;
                                }
                                $scope.titleNum = Number(titleMaxNum) - title.length;
                            }else{
                                $scope.titleNum = Number(titleMaxNum)
                            }
                            if($scope.titleNum < 0){
                                //$scope.title = $scope.title.substring(0, Number(titleMaxNum));
                                $scope.titleNum = 0;
                            }
                        })
                    }

                    $scope.contentNum = Number(contentMaxNum)
                    $scope.contentInputChange = function(content) {
                        $timeout(function() {
                            if(content){
                                if(content.length > Number(contentMaxNum)){
                                    SildeMessageBinder.tip({
                                      msg: '输入内容达到最大字数限制，请使用附件形式发送',
                                      type: 'error'
                                    });
                                }
                                $scope.contentNum = Number(contentMaxNum) - content.length;
                            }else{
                                $scope.contentNum = Number(contentMaxNum)
                            }
                            if($scope.contentNum < 0){
                                $scope.content = $scope.content.substring(0, Number(contentMaxNum));
                                $scope.contentNum = 0;
                            } else {
                                $scope.content = content;
                            }
                        })
                    }
                });
            }
        ], //链接函数
        link: function postLink(scope, ele, attrs) {
            var btnAddPic = $('.addPicture');
            var btnAddFile = $('.addFile');
            var btnAddVoice = $('.addvoice');
            var btnStartRecord = $('.vaudio');
            var voiceItems = [];
            //时间
            var timeIndex = 0;
            var times;

            function setTime() {
                //alert('timeIndex:'+timeIndex);
                var minutes = parseInt((timeIndex % 3600) / 60);
                var seconds = parseInt(timeIndex % 60);
                minutes = minutes < 10 ? "0" + minutes + '"' : minutes + '"';
                seconds = seconds < 10 ? "0" + seconds : seconds;
                //alert(timeIndex)
                if (timeIndex == 60) {
                    //$(".span").text("");
                    $(".avoice").css("display", "none");
                    $(".aoice").css("display", "none");
                    $(".Voice").css("display", "none");
                    $(".statevoice").css("display", "none")
                    clearInterval(times);
                }else{
                    timeIndex++;
                    timeIndex = timeIndex < 10 ? "0" + timeIndex : timeIndex;
                    $(".showTime").text(timeIndex + '"');
                }
               // alert('timeIndex:'+timeIndex);
            }
            btnAddPic.bind('click', function(e) {
                e.preventDefault();
                var browseImages = [];
                //选择照片并预览照片方法
                var images = {
                    localId: [],
                    serverId: []
                };
                var pictureNum;
                var dataroot = "config.json";
                $.getJSON(dataroot, function(data) {
                    var pictureNum = data.pictureNum;
                    var picItemsLength = scope.picItems ? scope.picItems.length : 0;
                    //调用相机或相册或其他文件方法
                    MXCommon.chooseFile(pictureNum - picItemsLength, ['album', 'camera', 'file', 'cloudDrive'], completeCallback, errorCallBack);
                    // MXCommon.chooseFile(pictureNum, ['album', 'camera', 'file'], completeCallback, errorCallBack);

                    function completeCallback(result) {
                        var pictures = [];
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || (navigator.userAgent.indexOf('PC Client') > -1)) {
                            result = JSON.parse(result).slice(0, pictureNum);
                            pictures = result;
                        } else {
                            pictures = result;
                        }
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || (navigator.userAgent.indexOf('PC Client') > -1)) {
                            if (result.length < pictureNum) {
                                // alert('已选择 ' + result.length + ' 张图片或文件');
                            } else {
                                // alert('已选择 ' + pictureNum + ' 张图片或文件');
                            }
                            $('.img-wrap').show();
                            RootscopeApply(scope, function() {
                                scope.picItems = result;
                                var picItems = scope.picItems;
                                AddPictures.setPicture(picItems);
                                pictures = AddPictures.getPicture();
                                scope.picItems = pictures;
                            });
                        } else {
                            $('.img-wrap').show();
                            RootscopeApply(scope, function() {
                                scope.picItems = JSON.parse(result).localRes;
                                var picItems = scope.picItems;
                                scope.browseImages = browseImages;
                                AddPictures.setPicture(picItems);
                                pictures = AddPictures.getPicture();
                                scope.picItems = pictures;
                                scope.picItems.some(function(val){
                                    if(val.contentType && val.contentType.slice(0, 5) == 'image'){
                                        browseImages.push(val.url);
                                    }
                                })
                            });
                        }
                    }

                    function errorCallBack(result) {
                        SildeMessageBinder.tip({
                            msg: result,
                            type: 'error'
                        });
                }
            });
        })
            btnAddFile.bind('click', function(e) {
                e.preventDefault();
                //选择照片并预览照片方法
                var images = {
                    localId: [],
                    serverId: []
                };
                var pictureNum;
                var dataroot = "config.json";
                $.getJSON(dataroot, function(data) {
                    var pictureNum = data.pictureNum;
                    //调用相机或相册或其他文件方法
                    MXCommon.chooseFile(pictureNum, ['file'], completeCallback, errorCallBack);

                    function completeCallback(result) {
                        var pictures = [];
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || (navigator.userAgent.indexOf('PC Client') > -1)) {
                            result = JSON.parse(result).slice(0, pictureNum);
                            pictures = result;
                        } else {
                            pictures = result;
                        }
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || navigator.userAgent.indexOf('PC Client') > -1) {
                            if (result.length < pictureNum) {
                                // alert('已选择 ' + result.length + ' 张图片或文件');
                            } else {
                                // alert('已选择 ' + pictureNum + ' 张图片或文件');
                            }
                            $('.img-wrap').show();
                            RootscopeApply(scope, function() {
                                scope.picItems = result;
                                var picItems = scope.picItems;
                                AddPictures.setPicture(picItems);
                                pictures = AddPictures.getPicture();
                                scope.picItems = pictures;
                            });
                        } else {
                            $('.img-wrap').show();
                            RootscopeApply(scope, function() {
                                scope.picItems = JSON.parse(result).localRes;
                                var picItems = scope.picItems;
                                AddPictures.setPicture(picItems);
                                pictures = AddPictures.getPicture();
                                scope.picItems = pictures;
                            });
                        }
                    }

                    function errorCallBack(result) {
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                            SildeMessageBinder.tip({
                                msg: result,
                                type: 'error'
                            });
                        } else {
                            SildeMessageBinder.tip({
                                msg: result,
                                type: 'error'
                            });
                            // function alertDismissed() {}
                            // navigator.notification.alert(result, // message
                            //     alertDismissed, // callback
                            //     '提示', // title
                            //     '确定' // buttonName
                            // );
                        }
                    }
                });
            })
            btnAddVoice.bind("touchend", function(e) {
                e.originalEvent.targetTouches[0];
                $(".avoice").css("display", "block")
                $(".aoice").css("display", "block")
                $(".showTime").text("00" + '"');
                $(".span").show();
                $(".span").text("长按开始录音");
            })
            //按下录音
            //btnStartRecord.bind("touchstart", function(e) {
            $ionicGesture.on('touch', function(){
                clearInterval(times);
                times = setInterval(setTime, 1000);
                //alert('times::::::' + times)
                $(".Voice").css("display", "block");
                $(".statevoice").css("display", "block");
                $(".showTime").css("display", "block");
                // if(timeIndex==timeIndex){
                //      timeIndex=0;
                // }else{
                MXCommon.startRecord();
            }, btnStartRecord);
                //e.originalEvent.targetTouches[0];
                //alert('点击了按下录音！');

            //});
            //点击其他地方停止录音
            $('.avoice').bind("touchstart",function(e){
                e.originalEvent.targetTouches[0];
               clearTime();
            })


            //清零
            var clearTime = function(){
                timeIndex = 0;
                //$(".span").text("");
                $(".avoice").css("display", "none");
                $(".aoice").css("display", "none");
                $(".Voice").css("display", "none");
                $(".statevoice").css("display", "none")
                $(".showTime").text("00" + '"');
                clearInterval(times);
            }
            //松开停止录音
            //btnStartRecord.bind("touchend", function(e) {
            $ionicGesture.on('release', function(){
                //e.originalEvent.targetTouches[0];
               
                // timeIndex=0;
                // $(".showTime").text(showTime);
                $(".showTime").css("display", "none");

                timeIndex = timeIndex - 1;
                if (timeIndex < 1) {
                 timeIndex = 0
                }
                //alert(MXCommon.stopRecord)
                MXCommon.stopRecord(endRecordCompleteCallback, errorCallBack);
                //MXCommon.stopRecord(function(e){},function(err){});
                function endRecordCompleteCallback(result) {
                    RootscopeApply(scope, function() {
                        scope.picItems = JSON.parse(result);
                        var voiceItem = {};
                        var localIds = scope.picItems.localIds;
                        voiceItem.localIds = localIds[0];
                        voiceItem.timeIndex = timeIndex + 1;
                        voiceItems = voiceItem;
                        //var picItems = scope.picItems;
                        AddPictures.setPicture(voiceItems);
                        pictures = AddPictures.getPicture();
                        scope.picItems = pictures;
                        //alert('scope.picItems::::' + JSON.stringify(scope.picItems))
                        //$rootScope.$broadcast('timeIndex',timeIndex);
                    });
                     clearTime();
                     $(".showTime").text("");
                };

                function errorCallBack(result) {
                    if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                        SildeMessageBinder.tip({
                            msg: result,
                            type: 'error'
                        });
                    } else {
                        // function alertDismissed() {
                        //     //alert('You selected button');
                        // }
                        // navigator.notification.alert(result, // message
                        //     alertDismissed, // callback
                        //     '提示', // title
                        //     '确定' // buttonName
                        // );
                        SildeMessageBinder.tip({
                            msg: result,
                            type: 'error'
                        });
                    }
                }
            },btnStartRecord);
        }
    }
})
//获取选人列表
.directive('receiverItem', function($state, $injector, $rootScope, SERVER, SetMarkread, RootscopeApply, SelectUsers, GetCurrentUser, AddSelectUsers) {
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        template: '<div>\
            <img class="selectUser-headPic" ng-if="!(receiverItem.type == \'department\' && receiverItem.dept_code.length > 0)" ng-src="{{receiverItem.avatar_url || host + \'/photos/\' + receiverItem.login_name}}" onerror="this.src=\'./img/offline_img.png\'"/>\
            <img class="selectUser-headPic" ng-if="receiverItem.type == \'department\' && receiverItem.dept_code.length > 0" src="img/img_dept.png" />\
            <p class="selectUser-username">{{receiverItem.name || receiverItem.short_name}}</p>\
            <img class="ico-del" id="ico-del" src="img/ico_delSmall.png"/>\
        </div>',
        controller: ['$scope',
            function($scope) {
                //获取拼头像所需要的上下文地址
                $scope.host = SERVER.host;
                //alert(JSON.stringify($scope.receiverItem));
            }
        ],
        //链接函数
        link: function postLink(scope, ele, attrs) {
            //alert(scope.receivers);
            var btDelete1 = ele[0].querySelector('.ico-del');
            btDelete1.addEventListener('click', function(e) {
                //alert("click");
                e.preventDefault();
                //对通过调取通讯录获得的数组进行遍历
                //根据接收类型是用户还是部门进行判断找到数组中的某一个与选中的id相匹配的，将其删掉
                RootscopeApply(scope, function() {
                    if (scope.receiverItem.type === 'user') {
                        AddSelectUsers.delUser(scope.receiverItem.id);
                        var receiverListsDel = AddSelectUsers.getUser();
                        $rootScope.$broadcast('receiverListsDel', receiverListsDel);
                    }
                    if (scope.receiverItem.type === 'department') {
                        AddSelectUsers.delUser1(scope.receiverItem.dept_id);
                    }
                    scope.receivers = AddSelectUsers.getUser();
                    //alert(scope.receivers);
                });
            }, false);
        }
    }
})
//选人操作
.directive('selectuserWrap', function(RootscopeApply, $injector, $state, $stateParams, $rootScope, SelectUsers, GetCurrentUser, AddSelectUsers) {
    return {
        restrict: 'A',
        controller: ['$scope',
            function($scope) {
                //绑定服务
                $injector.invoke(AddSelectUsers.bind, this, {
                    $scope: $scope
                });
            }
        ],
        //链接函数
        link: function postLink(scope, ele, attrs) {
            console.log('$rootScope.panelType:::', $rootScope.panelType)
            if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) || (!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) && $rootScope.panelType == undefined)) {
                //获取手机屏幕的宽度
                var widthBox = ele[0].offsetWidth;
                //将选人列表的li宽度设为70
                var widthLi = 70;
                //计算在手机上可以放几个li
                var count = parseInt(widthBox/widthLi);
                //将放置li的数量 * 每个li的宽度赋值给选人列表的宽度
                var widthLiNew = (count * widthLi);
                $('#selectUser-list').css('width', widthLiNew);
                $('.pc #selectUser-list').css('min-width', widthLiNew)
            }else{
                $('#selectUser-wrap').css('background', 'none')
            }
            $('.bt-add img').css('margin-left', '4px');
            // $('.bt-add img').css('margin-top','14px');
            $('.bt-del img').css('margin-left', '8px');
            //数组去重方法
            var delRepeat = function(array) {
                var n = []; //一个新的临时数组存储id
                var n1 = []; //另一个数组存储新的不重复对象
                for (var i = 0; i < array.length; i++) //遍历当前数组
                {
                    if (array[i].type === 'user') {
                        //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                        if (n.indexOf(array[i].id) == -1) {
                            //将当前项的idpush到临时数组里面
                            n.push(array[i].id);
                            //将当前项的对象放入新数组中
                            n1.push(array[i]);
                        }
                    }
                    if (array[i].type === 'department') {
                        //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                        if (n.indexOf(array[i].dept_id) == -1) {
                            //将当前项的idpush到临时数组里面
                            n.push(array[i].dept_id);
                            //将当前项的对象放入新数组中
                            n1.push(array[i]);
                        }
                    }
                }
                return n1;
            };
            //声明将通过调取通讯录获取到的数组
            var receivers = AddSelectUsers.getUser();
            scope.receivers = delRepeat(receivers);
            btAdd = ele[0].querySelector('#bt-add');
            btDel = ele[0].querySelector('#bt-del');
            btAdd.addEventListener('click', function(e) {
                e.preventDefault();
                $('.bt-add img').css('margin-left', '4px');
                // $('.bt-add img').css('margin-top','14px');
                $('.bt-del img').css('margin-left', '8px');
                // $('.bt-del img').css('margin-top','14px');
                $('#selectUser-item .ico-del').css('display', 'none');
                //调取通讯录选择发送人
                GetCurrentUser(function(result1) {
                    //将调取选择发送人获取的字符串转换为对象类型
                    //var result1 = JSON.parse(result1);
                    scope.senderId = result1.id;
                    scope.senderName = result1.name;
                    scope.loginName = result1.login_name;
                    //alert(result1.login_name);
                    //alert(result1);
                });
                //AddSelectUsers.saveUser(scope.receivers)
                // //调取通讯录选择发送人
                //scope.exceptUserIds = _.pluck(scope.receivers, 'id');
                //console.log('scope.exceptUserIds::', scope.exceptUserIds);
                SelectUsers(function(result) {
                    var receivers = [];
                    //对获取到的选人结果进行遍历
                    console.log('select users =>', result);
                    for (var i = 0; i < result.data.length; i++) {
                        //根据选择的是用户还是部门进行判断
                        if (result.data[i].type === 'user') {
                            receivers.push(result.data[i]);
                        } else if (result.data[i].type === 'department') {
                            receivers.push(result.data[i]);
                        }
                    }
                    RootscopeApply(scope, function() {
                        AddSelectUsers.saveUser(receivers);
                        receivers = AddSelectUsers.getUser();
                        scope.receivers = receivers;
                        if (scope.receivers.length > 0) {
                            $('.bt-del').show();
                        }
                        //scope.receivers = delRepeat(scope.receivers);
                    });
                });
                if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                    var widthBox = ele[0].offsetWidth;
                    var widthLi = 70;
                    //alert(widthLi);
                    var count = parseInt(widthBox/widthLi);
                    //alert(count);
                    var widthLiNew = (count * widthLi);
                    //alert(widthLiNew);
                    $('#selectUser-list').css('width', widthLiNew);
                }
            }, false);
            //点击删除按钮需要改变的样式
            btDel.addEventListener('click', function(e) {
                e.preventDefault();
                $('#selectUser-item img').css('display','block');
                $('#selectUser-item #ico-del').css('margin-top','-105px');
                $('#selectUser-item #ico-del').css('margin-left','-4px');
                $('#selectUser-item p').css('margin-top','5px');
            }, false);
        }
    }
})
//添加照片
.directive('picItem', function($injector, $rootScope, AddPictures, RootscopeApply, $filter) {
    return {
        restrict: 'A',
        replace: false,
        scope: true,
        template: 
            '<img class="war-icon" ng-src="{{pc_url || picItem.url}}" type="{{contentType}}" ng-show="showAttachment">\
            <img class="war-icon" ng-src="img/loading.png" ng-show="showVoice">\
            <img class="war-icon" ng-src="img/pauseVoice.png" ng-show="showVoice">\
            <div class="thumbnail-wrap" ng-show="showAttachment">\
                <span class="thumbnail-name" title="{{picItem.name}}">{{picItem.name}}</span>\
                <span class="thumbnail-size" title="{size}}">{{size}}</span>\
            </div>\
            <div class="wave-and-time" ng-show="showVoice">\
                <img class="voive-wave" src="img/wave.png" width="110" height="17">\
                <span class="voive-time">{{picItem.timeIndex}}"</span>\
            </div>\
            <a class="delete-attachment" href="#"></a>',
        controller: ['$scope',
            function($scope) {
                //绑定服务
                $injector.invoke(AddPictures.bind, this, {
                    $scope: $scope
                });
                var size = $scope.picItem.size
                var sizeFilter = $filter('fileSizeFilter');
                //内存大小换算
                $scope.size = sizeFilter(size);
            }
        ],
        //链接函数
        link: function postLink(scope, ele, attrs) {
            //alert('scope.browseImages ************' + scope.browseImages )
            scope.showVoice = false;
            scope.showAttachment = false;
            if (!scope.picItem.url && !scope.picItem.fid) {
                scope.showVoice = true;
            } else {
                var contentType = scope.picItem.contentType;
                if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || (navigator.userAgent.indexOf('PC Client') > -1)) {
                    if(contentType !== 'image' || (scope.picItem.fid && contentType == 'image')){
                        scope.pc_url = scope.picItem.thumbnailUrl;
                        console.log('scope.pc_url:::::', scope.pc_url)
                    }
                }
                // alert('contentType ==>>' + scope.picItem.contentType)
                scope.showAttachment = true;
            }
            scope.originalTime = angular.copy(scope.picItem.timeIndex);
            //删除图片操作
            btDelPic = ele[0].querySelector('.delete-attachment');
            btDelPic.addEventListener('click', function(e) {
                e.preventDefault();
                AddPictures.delPicture(scope.picItem);
                RootscopeApply(scope, function() {
                    scope.picItems = AddPictures.getPicture();
                });
            }, false)
            //点击图片进行预览
            if(contentType && contentType.slice(0, 5) == 'image'){
                scope.contentType = contentType.slice(0, 5);
            }
            //alert('$scope.contentType:::::' + $scope.contentType)
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                btnPreviewPic = ele[0].querySelector('.thumbnail');
                btnPreviewPic.addEventListener('click', function(e) {
                    e.preventDefault();
                    setTimeout(function(){
                      if(scope.browseImages && scope.contentType == 'image'){
                        var arr = [];
                        for(var i =0; i < scope.$index ; i++){
                            if($('.warpul li:eq('+i+') img').attr('type') == 'image'){
                                arr.push('1');
                            }
                        }
                        MXCommon.browseImages(scope.browseImages,arr.length);
                      }
                    },200);
                }, false)
            }
            //播放
            btnPlay = ele[0].querySelector('.thumbnail-loading');
            btnPlay.addEventListener('click', function(e) {
                e.preventDefault();
                $(this).css("display", "none")
                $(this).next().css("display", "block")
                // alert('dataUrl====>'+dataUrl+'--播放--');
                var localIdArrs = [];
                localIdArrs.push(scope.picItem.localIds);
                //先停止其它语音的播放
                $rootScope.$broadcast('stop_audio_play', scope.picItem.localIds);
                MXCommon.playVoice(localIdArrs);
                tes = setInterval(function() {
                    RootscopeApply(scope, function() {
                        scope.picItem.timeIndex = scope.picItem.timeIndex - 1;
                        if (scope.picItem.timeIndex == 0) {
                            clearInterval(tes);
                            ele[0].querySelector('.thumbnail-pause').style.display = "none";
                            ele[0].querySelector('.thumbnail-loading').style.display = "block";
                            scope.picItem.timeIndex = scope.originalTime;
                            var localIdArrs = [];
                            localIdArrs.push(scope.picItem.localIds);
                            MXCommon.stopVoice(localIdArrs);
                            //$(this).parent().find(".count-down").text(timeIndex)
                        }
                        if (scope.picItem.timeIndex < 0) {
                            scope.picItem.timeIndex = 0;
                            var localIdArrs = [];
                            localIdArrs.push(scope.picItem.localIds);
                            MXCommon.stopVoice(localIdArrs);
                        }
                    });
                }, 1000);
            }, false)
            //监听停止播放事件，当点击其他音频时停止播放当前音频
            var scopeListener = scope.$on('stop_audio_play', function(e, id) {
                if (scope.picItem.localIds !== id) {
                    //pause();
                    var localIdArrs = [];
                    localIdArrs.push(id);
                    MXCommon.stopVoice(localIdArrs);
                    clearInterval(tes);
                    ele[0].querySelector('.thumbnail-pause').style.display = "none";
                    ele[0].querySelector('.thumbnail-loading').style.display = "block";
                }
            });
            //暂停
            btnPause = ele[0].querySelector('.thumbnail-pause');
            btnPause.addEventListener('click', function(e) {
                e.preventDefault();
                ele[0].querySelector('.thumbnail-pause').style.display = "none";
                ele[0].querySelector('.thumbnail-loading').style.display = "block";
                var localIdArrs = [];
                localIdArrs.push(scope.picItem.localIds);
                MXCommon.stopVoice(localIdArrs);
                clearInterval(tes);
                scope.picItem.timeIndex = scope.originalTime + 1;
            }, false)
            //当作用于销毁时，清除引用
            scope.$on('$destroy', function() {
                ele.unbind('click');
                if (scopeListener) scopeListener();
            });
        }
    }
})