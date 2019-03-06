angular
    .module("starter")
    //获取未读通知接口数据
    .factory("StateUnread", function(
        $q,
        $http,
        SERVER,
        $rootScope,
        $ionicLoading,
        RootscopeApply,
        StateMydraft,
        SildeMessageBinder
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.init = function(server_url) {
            if (!SERVER.url) {
                SERVER.url = server_url;
            }
            var defer = $q.defer();
            //将panelType设置为1
            $rootScope.panelType = 1;
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/unRead"
            })
                .success(function(data, status, headers, config) {
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    //alert('data:::' + JSON.stringify(data))
                    scope.scopeWorker(data);
                })
                .error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    //alert('data:::' + JSON.stringify(data))
                    //alert(status);
                    if (status === 500 || status === 502) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    defer.reject(data);
                });
        };
        //删除未读列表的通知
        o.delUnreadNotice = function(id) {
            RootscopeApply(scope, function() {
                //删除某条指定的通知
                for (var i = 0; i < scope.unreads.length; i++) {
                    if (scope.unreads[i].id == id) {
                        scope.unreads.splice(i, 1);
                    }
                }
            });
        };
        o.put = function(item) {
            RootscopeApply(scope, function() {
                if (scope.unreads) {
                    scope.unreads.unshift(item);
                }
            });
        };
        // o.clear = function(){
        //   RootscopeApply(scope, function() {
        //     scope.unreads = [];
        //   });
        //   //alert(JSON.stringify(scope.mydrafts));
        //   //alert(scope.mydrafts);
        // }
        return o;
    })
    //获取我发送的通知接口数据
    .factory("StateMydraft", function(
        $q,
        $http,
        SERVER,
        $rootScope,
        $ionicLoading,
        RootscopeApply,
        SildeMessageBinder
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.init = function() {
            var defer = $q.defer();
            //将panelType设置为2
            //alert(scope.mydrafts);
            $rootScope.panelType = 2;
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/myDraft"
            })
                .success(function(data, status, headers, config) {
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    scope.scopeWorker(data);
                })
                .error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    if (status === 500 || status === 502) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    defer.reject(data);
                });
        };
        //将增加的通知追加到我发送的列表第一条
        o.addMydraftNotice = function(data) {
            RootscopeApply(scope, function() {
                scope.mydrafts.unshift(data);
            });
        };
        //删除我发送的列表的通知
        o.delMydraftNotice = function(id) {
            RootscopeApply(scope, function() {
                //删除某条指定的通知
                for (var i = 0; i < scope.mydrafts.length; i++) {
                    if (scope.mydrafts[i].id == id) {
                        scope.mydrafts.splice(i, 1);
                    }
                }
            });
        };
        return o;
    })
    //获取已读通知接口数据
    .factory("StateMarkread", function(
        $q,
        $http,
        SERVER,
        $rootScope,
        $ionicLoading,
        RootscopeApply,
        StateMydraft,
        SildeMessageBinder
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.init = function() {
            var defer = $q.defer();
            //将panelType设置为3
            $rootScope.panelType = 3;
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/markRead"
            })
                .success(function(data, status, headers, config) {
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    scope.scopeWorker(data);
                })
                .error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    if (status === 500 || status === 502) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    defer.reject(data);
                });
        };
        //删除已读列表的通知
        o.delMarkreadNotice = function(id) {
            RootscopeApply(scope, function() {
                //删除某条指定的通知
                for (var i = 0; i < scope.markreads.length; i++) {
                    if (scope.markreads[i].id == id) {
                        scope.markreads.splice(i, 1);
                    }
                }
            });
        };
        //将已读的通知增加到未读的列表中
        o.put = function(item) {
            RootscopeApply(scope, function() {
                if (scope.markreads) {
                    scope.markreads.unshift(item);
                }
            });
        };
        return o;
    })
    //获取我发送的通知详情列表
    .factory("DetailsNotice", function(
        $q,
        $http,
        $rootScope,
        $ionicLoading,
        SERVER,
        SetMarkread,
        SildeMessageBinder,
        GetAttachment
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        //获取id方法
        o.getId = function() {
            return noticeId;
        };
        o.getSenderId = function() {
            // alert(scope.senderId);
            return scope.senderId;
        };
        o.getRecevierId = function() {
            if (scope.readlists) {
                //var readlists = JSON.parse(scope.readlists);
                for (var i = 0; i < scope.readlists.length; i++) {
                    return (receiverId = scope.readlists[i].readerId);
                }
            }
            if (scope.unreadlists) {
                //var unreadlists = JSON.stringify(scope.unreadlists);
                for (var i = 0; i < scope.unreadlists.length; i++) {
                    return (unreceiverId = scope.unreadlists[i].readerId);
                }
            }
        };
        //初始化详细信息
        o.initDetails = function(id, panelType) {
            noticeId = id;
            var defer = $q.defer();
            if (!SERVER.url) return;
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/" + id + "/detail"
            })
                .success(function(data, status, headers, config) {
                    console.log("data::::", data);
                    if (data.code == 401) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    defer.resolve(data);
                    console.log("panelType:::", panelType);
                    if (
                        (data.currentUserRead === false && panelType === 1) ||
                        (data.currentUserRead === false && !panelType)
                    ) {
                        SildeMessageBinder.tip({
                            msg: "已发送回执",
                            type: "message"
                        });
                        SetMarkread.init(id);
                    }
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    scope.detailNotice(data);
                    var file_ids = [];
                    var file_names = [];
                    var file_sizes = [];
                    var file_content_type = [];
                    var durations = [];
                    var disk_urls = [];
                    var content_types = [];
                    if (data.attachs) {
                        for (var i = 0; i < data.attachs.length; i++) {
                            file_ids.push(data.attachs[i].file_id);
                            file_names.push(data.attachs[i].name);
                            file_content_type.push(
                                data.attachs[i].content_type
                            );
                            var size = data.attachs[i].size;
                            var fileSizeFilter = function(size) {
                                var newSize;

                                if (size < 1024) {
                                    return size + "Bytes";
                                } else if (size < 1024 * 1024) {
                                    newSize = size / 1024;
                                    return newSize.toFixed(1) + "KB";
                                } else if (size < 1024 * 1024 * 1024) {
                                    newSize = size / Math.pow(1024, 2);
                                    return newSize.toFixed(1) + "MB";
                                }
                            };
                            var file_size = fileSizeFilter(size);
                            file_sizes.push(file_size);
                            durations.push(data.attachs[i].duration);
                            disk_urls.push(data.attachs[i].disk_url);
                            content_types.push(data.attachs[i].content_type);
                        }
                        GetAttachment.initAttachment(
                            data.id,
                            file_ids,
                            file_names,
                            file_sizes,
                            file_content_type,
                            durations,
                            disk_urls,
                            content_types
                        );
                    }
                    // GetAttachment.initAttachment(id, file_id)
                })
                .error(function(data, status, headers, config) {
                    //alert('data:::' + data)
                    $ionicLoading.hide();
                    if (status === 500 || status === 502) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    defer.reject(data);
                });
            return defer.promise;
        };
        return o;
    })
    //删除通知（设置标志位）
    .factory("DeleteNotice", function(
        $q,
        $http,
        $state,
        $rootScope,
        SERVER,
        StateUnread,
        StateMydraft,
        StateMarkread,
        DetailsNotice,
        SildeMessageBinder
    ) {
        return function(id) {
            var defer = $q.defer();
            //如果缓存没有就从服务器中取出来
            $http({
                method: "PUT",
                url: SERVER.url + "/" + id + "/markDeleted"
            })
                .success(function(data, status, headers, config) {
                    if (data.code >= 400) {
                        SildeMessageBinder.tip({
                            msg: data.message || "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    } else {
                        //根据选项卡类型调用未读、已读的删除方法
                        if ($rootScope.panelType === 1) {
                            StateUnread.delUnreadNotice(id);
                        } else if ($rootScope.panelType === 3) {
                            StateMarkread.delMarkreadNotice(id);
                        } else if ($rootScope.panelType === 2) {
                            StateMydraft.delMydraftNotice(id);
                        }
                        $state.go("myNotice", {
                            id: id
                        });
                        //提示保存成功
                        SildeMessageBinder.tip({
                            msg: "删除成功",
                            type: "message"
                        });
                    }
                })
                .error(function(data, status, headers, config) {
                    SildeMessageBinder.tip({
                        msg:
                            JSON.stringify(data.message) ||
                            "服务器异常，请联系管理员！",
                        type: "error"
                    });
                    defer.reject(data);
                });
        };
        return o;
    })
    //删除通知（设置标志位）
    .factory("DeleteMydraftNotice", function(
        $q,
        $http,
        $state,
        $rootScope,
        SERVER,
        StateUnread,
        StateMydraft,
        StateMarkread,
        DetailsNotice,
        SildeMessageBinder
    ) {
        return function(id) {
            var defer = $q.defer();
            //如果缓存没有就从服务器中取出来
            $http({
                method: "PUT",
                url: SERVER.url + "/myDraft/" + id + "/markDeleted"
            })
                .success(function(data, status, headers, config) {
                    if (data.code >= 400) {
                        SildeMessageBinder.tip({
                            msg: data.message || "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    } else {
                        //根据选项卡类型调用我发送的删除方法
                        if ($rootScope.panelType === 2) {
                            StateMydraft.delMydraftNotice(id);
                        }
                        $state.go("myNotice", {
                            id: id
                        });
                        SildeMessageBinder.tip({
                            msg: "撤回成功",
                            type: "message"
                        });
                    }
                })
                .error(function(data, status, headers, config) {
                    SildeMessageBinder.tip({
                        msg:
                            JSON.stringify(data.message) ||
                            "服务器异常，请联系管理员！",
                        type: "error"
                    });
                    defer.reject(data);
                });
        };
        return o;
    })
    //发送提醒
    .factory("SendRemind", function($q, $http, SERVER, SildeMessageBinder) {
        return function(id) {
            var defer = $q.defer();
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/" + id + "/remind"
            })
                .success(function(data, status, headers, config) {
                    //提示提醒发送成功
                    SildeMessageBinder.tip({
                        msg: "提醒发送成功",
                        type: "message"
                    });
                })
                .error(function(data, status, headers, config) {
                    defer.reject(data);
                });
        };
        return o;
    })
    //发送通知
    .factory("SendNotice", function(
        $q,
        $http,
        $state,
        $rootScope,
        SERVER,
        SildeMessageBinder,
        RootscopeApply,
        StateUnread,
        StateMydraft,
        StateMarkread,
        DetailsNotice,
        SelectUsers,
        GetCurrentUser,
        AddSelectUsers,
        $ionicLoading
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.genData = function() {
            var data = {
                title: scope.title,
                content: $.trim(scope.content)
                    .replace(/\</g, "&lt;")
                    .replace(/\>/g, "&gt;")
                    .replace(/\n/g, "<br>"),
                //finishTime: scope.datepicker.replace(/\-/g, ''),//将获取到的时间格式进行转换，如将'2015-06-03'转换成'20150603'
                senderId: scope.senderId,
                senderName: scope.senderName,
                loginName: scope.loginName
            };
            //未填写通知标题
            if (typeof data.title === "undefined" || data.title === "") {
                SildeMessageBinder.tip({
                    msg: "请填写通知标题",
                    type: "error"
                });
                return false;
            }
            //未填写通知内容
            if (typeof data.content === "undefined" || data.content === "") {
                SildeMessageBinder.tip({
                    msg: "请填写通知内容",
                    type: "error"
                });
                return false;
            }
            //数组去重方法
            var delRepeat = function(array) {
                var n = []; //一个新的临时数组存储id
                var n1 = []; //另一个数组存储新的不重复对象
                for (
                    var i = 0;
                    i < array.length;
                    i++ //遍历当前数组
                ) {
                    if (array[i].type === "user") {
                        //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                        if (n.indexOf(array[i].id) == -1) {
                            //将当前项的idpush到临时数组里面
                            n.push(array[i].id);
                            //将当前项的对象放入新数组中
                            n1.push(array[i]);
                        }
                    }
                    if (array[i].type === "department") {
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
            //调用选人方法
            receivers = AddSelectUsers.getUser();
            //对接收人进行去重
            //scope.receivers = delRepeat(receivers);
            scope.receivers = receivers;
            var receivers = [];
            //对从通讯录获取到的数据进行循环，并根据它的类型是用户还是部门进行判断
            for (var i = 0; i < scope.receivers.length; i++) {
                //如果通过通讯录获取到的数据是用户，对它进行赋值
                if (scope.receivers[i].type === "user") {
                    receivers[i] = {
                        receiverId: scope.receivers[i].id,
                        receiverCode: scope.receivers[i].login_name,
                        receiverName: scope.receivers[i].name,
                        receiverType: 1
                    };
                    //如果通过通讯录获取到的数据是部门，对它进行赋值
                } else if (scope.receivers[i].type === "department") {
                    receivers[i] = {
                        receiverId: scope.receivers[i].dept_id,
                        receiverCode: scope.receivers[i].dept_code,
                        receiverName: scope.receivers[i].short_name,
                        receiverType: 2
                    };
                }
            }
            //将通过通讯录选人获取到的数据存到data中
            data.receivers = receivers;
            data.attachs = scope.attachs;
            //未选择接收人
            if (
                typeof data.receivers === "undefined" ||
                data.receivers.length === 0
            ) {
                SildeMessageBinder.tip({
                    msg: "请选择接收人",
                    type: "error"
                });
                return false;
            }
            // //未选择通知结束时间
            // if (typeof data.finishTime === 'undefined' || data.finishTime === '') {
            //   SildeMessageBinder.tip({
            //     msg: '请填写通知结束时间',
            //     type: 'error'
            //   });
            //   return false;
            // }
            // //通知截止日期早于今天
            // if (edate < sdate) {
            //   SildeMessageBinder.tip({
            //     msg: '截止日期不能早于今天',
            //     type: 'error'
            //   });
            //   return false;
            // }
            return data;
        };
        o.init = function(data) {
            RootscopeApply(scope, function() {
                scope.scopeWorker(data);
            });
        };
        //保存方法
        o.save = function() {
            var data = o.genData();
            if (data == false) {
                $ionicLoading.hide();
            }
            console.log("navigator.onLine:::", navigator.onLine);
            if (navigator.onLine === false) {
                //提示发送失败
                SildeMessageBinder.tip({
                    msg: "发送失败",
                    type: "error"
                });
            }
            //判断是在附件栏还是在我的应用中点击的发送按钮
            var delay = $q.defer();
            //如果验证失败，不继续
            if (data) {
                //如果缓存没有就从服务器中取出来
                $http({
                    method: "POST",
                    url: SERVER.url,
                    data: data
                })
                    .success(function(data, status, headers, config) {
                        delay.resolve(data);
                        //将我发送的通知追加到我发送的选项卡列表中
                        if ($rootScope.panelType === 2) {
                            RootscopeApply(scope, function() {
                                StateMydraft.addMydraftNotice(data);
                            });
                        }
                        // RootscopeApply(scope, function() {
                        //   for (var i = 0; i < data.receivers.length; i++) {
                        //     if (scope.receivers[i].type === 'user') {
                        //         if (data.senderId == data.receivers[i].receiverId) {
                        //             StateUnread.put(data);
                        //         }
                        //     }
                        //   }
                        // });
                        //提示发送成功
                        // SildeMessageBinder.tip({
                        //     msg: '发送成功',
                        //     type: 'message'
                        // });
                        //  if(!$rootScope.panelType){
                        //     MXWebui.closeWindow();
                        // }else{
                        //   //跳转到我的通知页面
                        //   $state.go('myNotice');
                        // }
                        //同时将选人页面清空
                        //AddSelectUsers.clear();
                    })
                    .error(function(data, status, headers, config) {
                        delay.reject(data);
                        if (status === 500 || status === 502) {
                            SildeMessageBinder.tip({
                                msg: "服务器异常，请联系管理员！",
                                type: "error"
                            });
                        }
                    });
            } else {
                delay.reject();
            }
            return delay.promise;
        };
        return o;
    })
    //获取通讯录选人
    .factory("SelectUsers", function() {
        return function(callback) {
            //调取通讯录选人方法
            MXContacts.selectUsers(
                function(result) {
                    callback(result);
                }, // callback
                true
            );
        };
    })
    //获取登录id，登录名以及用户名
    .factory("GetCurrentUser", function() {
        return function(callback) {
            //调取获取登陆人信息的方法
            MXCommon.getCurrentUser(function(result1) {
                callback(result1);
            });
        };
    })
    //将未读通知设置为已读
    .factory("SetMarkread", function($q, $http, SERVER, $rootScope) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.init = function(id) {
            var defer = $q.defer();
            //如果缓存没有就从服务器中取出来
            $http({
                method: "POST",
                url: SERVER.url + "/" + id + "/read"
            })
                .success(function(data, status, headers, config) {
                    defer.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    defer.reject(data);
                });
            return defer.promise;
        };
        return o;
    })
    //通讯录选人保存和获得方法
    .factory("AddSelectUsers", function(
        SelectUsers,
        $rootScope,
        RootscopeApply
    ) {
        var o = {};
        var that, scope;
        var receiverLists = [];
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        //获取通讯录的人
        o.getUser = function() {
            return receiverLists;
        };
        //保存通讯录的人
        o.saveUser = function(receivers) {
            receiverLists = receiverLists.concat(receivers);
            //数组去重方法
            var delRepeat = function(array) {
                var n = []; //一个新的临时数组存储id
                var n1 = []; //另一个数组存储新的不重复对象
                //遍历当前数组
                for (var i = 0; i < array.length; i++) {
                    if (array[i].type === "user") {
                        //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                        if (n.indexOf("user_" + array[i].id) == -1) {
                            //将当前项的id push到临时数组里面
                            n.push("user_" + array[i].id);
                            //将当前项的对象放入新数组中
                            n1.push(array[i]);
                        }
                    }
                    if (array[i].type === "department") {
                        //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                        if (n.indexOf("dept_" + array[i].dept_id) == -1) {
                            //将当前项的id push到临时数组里面
                            n.push("dept_" + array[i].dept_id);
                            //将当前项的对象放入新数组中
                            n1.push(array[i]);
                        }
                    }
                }
                //alert(JSON.stringify(n1));
                return n1;
            };
            receiverLists = delRepeat(receiverLists);
        };
        //删除联系人(删除个人)
        o.delUser = function(id) {
            for (var i = 0; i < receiverLists.length; i++) {
                if (receiverLists[i].type === "user") {
                    if (id == receiverLists[i].id) {
                        receiverLists.splice(i, 1);
                    }
                    RootscopeApply(scope, function() {
                        scope.receivers = receiverLists;
                    });
                }
            }
        };
        //删除联系人(删除部门)
        o.delUser1 = function(dept_id) {
            for (var i = 0; i < receiverLists.length; i++) {
                if (receiverLists[i].type === "department") {
                    if (dept_id == receiverLists[i].dept_id) {
                        receiverLists.splice(i, 1);
                    }
                    RootscopeApply(scope, function() {
                        scope.receivers = receiverLists;
                    });
                }
            }
        };
        //将联系人的数组清空
        o.clear = function() {
            RootscopeApply(scope, function() {
                scope.clear();
                scope.receivers = [];
                receiverLists = [];
            });
        };
        return o;
    })
    //添加的照片保存和获得方法
    .factory("AddPictures", function(SelectUsers, $rootScope, RootscopeApply) {
        var o = {};
        var that, scope;
        var pictureLists = [];
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        //获取添加的照片
        o.getPicture = function() {
            return pictureLists;
        };
        //保存添加的照片
        o.setPicture = function(pictures) {
            pictureLists = pictureLists.concat(pictures);
            //数组去重方法
            var delRepeat = function(array) {
                var n = []; //一个新的临时数组存储id
                var n1 = []; //另一个数组存储新的不重复对象
                //遍历当前数组
                for (var i = 0; i < array.length; i++) {
                    //如果当前数组的第i个id已经保存进了临时数组，那么跳过，
                    if (array[i].url) {
                        if (n.indexOf("picture_" + array[i].url) == -1) {
                            //将当前项的id push到临时数组里面
                            n.push("picture_" + array[i].url);
                            //将当前项的对象放入新数组中
                            n1.push(array[i]);
                        }
                    } else {
                        n1.push(array[i]);
                    }
                }
                //alert(JSON.stringify(n1))
                return n1;
            };
            pictureLists = delRepeat(pictureLists);
        };
        //保存添加的照片
        // o.setVoice = function(pictures) {
        //   alert('pictures*********' + JSON.stringify(pictures))
        //   pictureLists = pictureLists.concat(pictures);
        // }
        //删除添加的照片
        o.delPicture = function(pic_id) {
            for (var i = 0; i < pictureLists.length; i++) {
                if (pic_id == pictureLists[i]) {
                    pictureLists.splice(i, 1);
                }
                RootscopeApply(scope, function() {
                    scope.picItems = pictureLists;
                });
            }
        };
        //将添加的照片的数组清空
        o.clear = function() {
            //scope.picClear();
            scope.picItems = [];
            pictureLists = scope.picItems;
        };
        return o;
    })
    //调用原生应用
    .factory("GetNative", function(
        $q,
        $http,
        $rootScope,
        SERVER,
        GetAttachment
    ) {
        return function() {
            var delay = $q.defer();
            getSSOToken("app_notification");

            function tokenCallBack(result) {
                //alert(result)
                //将获取到的token数据放到header中的Authorization字段中
                $http.defaults.headers.common["MX-Authorization"] = result;
                var token = result;
                window.token = token;
                getServerUrl();
            }

            function urlCallBack(result) {
                //将获取到的url放到header中的SERVER字段中
                SERVER.host = result;
                SERVER.url = SERVER.host + "/h5/app_notification";
                $rootScope.$broadcast("mydraft", SERVER);
                delay.resolve(result);
            }
            //通过ocuID获取ssoToken方法
            function getSSOToken(ocuID) {
                MXCommon.getSSOToken(ocuID, tokenCallBack);
            }
            //获取服务器地址方法
            function getServerUrl() {
                MXCommon.getServerUrl(urlCallBack);
            }
            return delay.promise;
        };
    })
    //获取附件
    .factory("GetAttachment", function(
        $q,
        $http,
        $rootScope,
        $ionicLoading,
        SERVER,
        SetMarkread,
        SildeMessageBinder,
        $location,
        $filter
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        //初始化附件信息
        o.initAttachment = function(
            id,
            file_ids,
            file_names,
            file_sizes,
            file_content_type,
            durations,
            disk_urls,
            content_types
        ) {
            var attachmentUrls = [];
            var fileAttachment = [];
            for (var i = 0; i < file_ids.length; i++) {
                var file_id = file_ids[i];
                var file_name = file_names[i];
                var file_size = file_sizes[i];
                var duration = durations[i];
                //   console.log('content_types',content_types)
                var thumbnailUrl = $filter("GetThumbnailUrl")(content_types[i]);

                if (file_content_type[i] != null) {
                    var content_type = file_content_type[i].slice(0, 5);
                }
                //   alert('防止重复添加附件')
                //防止重复添加附件进来
                if ($location.path() == "/noticeView") {
                    //   alert('已经进入$location.path()判断')
                    if (file_content_type[i] == "audio/amr") {
                        // alert('已经进入file_content_type[i] 判断')
                        $("#detail-attachments").append(
                            '<li><img class="detail-thumbnail" data-index="' +
                                i +
                                '" src=' +
                                SERVER.url +
                                "/attachment/" +
                                id +
                                "/thumbnail/" +
                                file_id +
                                "?MX-Authorization=" +
                                token +
                                ' class="attachment-img"' +
                                "url=" +
                                SERVER.url +
                                "/attachment/" +
                                id +
                                "/origin/" +
                                file_id +
                                "?MX-Authorization=" +
                                token +
                                " type=" +
                                content_type +
                                '><span class="detail-voice-wave"></span><span class="detail-voice-time" data-duration= ' +
                                duration +
                                ">" +
                                duration +
                                '"</span><button data-index="' +
                                i +
                                '" class="btn-play" >播放</button><audio data-fileId = ' +
                                file_id +
                                "></audio></li>" +
                                '<div class="attachs_line"></div>'
                        );
                        var liIndex = i + 1;
                        var eleAudio = $(
                            "#detail-attachments li:nth-child(" + liIndex + ")"
                        ).find("audio")[0];
                        eleAudio.src =
                            SERVER.url +
                            "/attachment/" +
                            id +
                            "/mp3/" +
                            file_id +
                            "?MX-Authorization=" +
                            token;
                    } else {
                        if (disk_urls[i]) {
                            alert('已经进入disk_urls[i] 判断')
                            alert('thumbnailUrl=>' + thumbnailUrl);
                            alert('SERVER.host=>' + SERVER.host);

                            var disk_url = disk_urls[i];
                            if (disk_url.indexOf("http") == -1) {
                                disk_url = SERVER.host + disk_url;
                            }
                            
                            $("#detail-attachments").append(
                                '<li><img data-index="' +
                                    i +
                                    '" src=' +
                                    SERVER.host +
                                    thumbnailUrl +
                                    ' class="attachment-img"' +
                                    "url=" +
                                    disk_url +
                                    " type=" +
                                    content_type +
                                    '><span class="file_name"  title="' +
                                    file_name +
                                    '" ng-show="showDetailAttachment">' +
                                    file_name +
                                    '</span><span class="file_size" ng-show="showDetailAttachment">' +
                                    file_size +
                                    '</span><button data-index="' +
                                    i +
                                    '" class="btn-download" url=' +
                                    disk_url +
                                    ">下载</button></li>"+
                                    '<div class="attachs_line"></div>'
                            );
                        } else {
                            alert('没有进入disk_urls[i]  判断')
                            alert('thumbnailUrl=>' + thumbnailUrl);
                            alert('SERVER.host=>' + SERVER.host)
                            var imageIconUrl = ''
                            if(SERVER.host && thumbnailUrl){
                                imageIconUrl = SERVER.host + thumbnailUrl
                            }

                            $("#detail-attachments").append(
                                '<li><img data-index="' +
                                    i +
                                    '" src=' + imageIconUrl + '?' + imageIconUrl + ':' +
                                    SERVER.url +
                                    "/attachment/" +
                                    id +
                                    "/thumbnail/" +
                                    file_id +
                                    "?MX-Authorization=" +
                                    token +
                                    ' class="attachment-img"' +
                                    "url=" +
                                    SERVER.url +
                                    "/attachment/" +
                                    id +
                                    "/origin/" +
                                    file_id +
                                    "?MX-Authorization=" +
                                    token +
                                    " type=" +
                                    content_type +
                                    '><span class="file_name"  title="' +
                                    file_name +
                                    '" ng-show="showDetailAttachment">' +
                                    file_name +
                                    '</span><span class="file_size" ng-show="showDetailAttachment">' +
                                    file_size +
                                    '</span><button data-index="' +
                                    i +
                                    '" class="btn-download" url=' +
                                    SERVER.url +
                                    "/attachment/" +
                                    id +
                                    "/origin/" +
                                    file_id +
                                    "?MX-Authorization=" +
                                    token +
                                    ">下载</button></li>"+
                                    '<div class="attachs_line"></div>'
                            );
                        }
                        if (content_type == "image") {
                            if (disk_urls[i]) {
                                attachmentUrls.push(SERVER.host + disk_urls[i]);
                            } else {
                                attachmentUrls.push(
                                    SERVER.url +
                                        "/attachment/" +
                                        id +
                                        "/origin/" +
                                        file_id +
                                        "?MX-Authorization=" +
                                        token
                                );
                            }
                        }
                    }
                }
            }
            $(".btn-download").bind("click", function(e) {
                var dwUrl = $(this).attr("url");
                setTimeout(function() {
                    var eq = $(e.currentTarget).data("index");
                    MXCommon.download(dwUrl);
                }, 100);
            });
            //点击详情的图片进行预览
            $("#detail-attachments img").bind("click", function(e) {
                e.preventDefault();
                // content_type = content_type.slice(0, 5);
                var dwUrl = $(this).attr("url");
                var contentType = $(this).attr("type");
                setTimeout(function() {
                    var eq = $(e.currentTarget).data("index");
                    console.log("contentType::", contentType);
                    if (contentType == "audio") return;
                    if (contentType != "image") {
                        MXCommon.download(dwUrl);
                    } else {
                        var arr = [];
                        for (var i = 0; i < eq; i++) {
                            if (
                                $(
                                    "#detail-attachments li:eq(" + i + ") img"
                                ).attr("type") == "image"
                            ) {
                                arr.push("1");
                            }
                        }
                        MXCommon.browseImages(attachmentUrls, arr.length);
                    }
                }, 200);
            });
            //点击播放按钮进行播放
            $(".btn-play").bind("click", function(e) {
                var eleAudio = $(this)
                    .parent()
                    .find("audio")[0];
                var fileId = $(this)
                    .parent()
                    .find("audio")
                    .data("fileid");
                var duration = $(this)
                    .parent()
                    .find(".detail-voice-time")
                    .data("duration");
                var originDuration = angular.copy(duration);
                var pause = function() {
                    //暂停
                    eleAudio.pause();
                    //重新加载音频
                    eleAudio.load();
                    clearInterval(tes);
                    $(e.currentTarget)
                        .parent()
                        .find(".detail-voice-time")
                        .text(duration + '"');
                    $(e.currentTarget).text("播放");
                    // console.log('eleAudio.parent():::', $(this).parent().find('audio'));
                    // eleAudio.parent().find('.btn-play').text('播放')
                    //$(this).text('播放')
                };
                //先停止其它语音的播放
                $rootScope.$broadcast("stop_audio_play", fileId);

                if (eleAudio.paused) {
                    eleAudio.play();
                    tes = setInterval(function() {
                        duration = duration - 1;
                        $(e.currentTarget)
                            .parent()
                            .find(".detail-voice-time")
                            .text(duration + '"');
                        if (duration == 0) {
                            clearInterval(tes);
                            pause();
                            duration = originDuration;
                            $(e.currentTarget)
                                .parent()
                                .find(".detail-voice-time")
                                .text(duration + '"');
                        }
                        if (duration < 0) {
                            duration = 0;
                            clearInterval(tes);
                            pause();
                        }
                    }, 1000);
                    //如果是要暂停播放，则需要把按钮文字改为播放
                    $(this).text("停止");
                } else {
                    pause();
                    //暂停
                    // eleAudio.pause();
                    // //重新加载音频
                    // eleAudio.load();
                    // $(this).text('播放')
                }
                //监听停止播放事件，当点击其他音频时停止播放当前音频
                var scopeListener = $rootScope.$on("stop_audio_play", function(
                    e,
                    id
                ) {
                    if (!eleAudio.paused && fileId !== id) {
                        pause();
                        // eleAudio.pause();
                        // //重新加载音频
                        // eleAudio.load();
                        // console.log('$(this):::', $(this))
                        // $(this).parent().find('.btn-play').text('播放')
                        //pause();
                        // var localIdArrs = [];
                        // localIdArrs.push(id);
                        // MXCommon.stopVoice(localIdArrs);
                        // clearInterval(tes);
                        // ele[0].querySelector('.thumbnail-pause').style.display = "none";
                        // ele[0].querySelector('.thumbnail-loading').style.display = "block";
                    }
                });
            });
            //当作用于销毁时，清除引用
            $rootScope.$on("$destroy", function() {
                //$(this).unbind('click');
                if (scopeListener) scopeListener();
            });
        };
        return o;
    })
    //调用原生应用
    .factory("GetLoginName", function(
        $q,
        $http,
        $rootScope,
        SERVER,
        GetAttachment
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.getLoginName = function(id) {
            var delay = $q.defer();
            MXCommon.api({
                type: "GET",
                url: "/api/v1/users/" + id,
                dataType: "text",
                //contentType: "application/x-www-form-urlencoded",
                async: true,
                complete: function() {},
                success: function(data, status, xhr) {
                    var login_name = JSON.parse(data).login_name;
                    delay.resolve(login_name);
                },
                error: function(data, status, xhr) {
                    delay.reject(data);
                }
            });
            return delay.promise;
        };
        return o;
    })

    //获取全部未读/已读人员(分页)
    .factory("GetAllUsers", function(
        $q,
        $http,
        $rootScope,
        SERVER,
        $ionicLoading
    ) {
        var o = {};
        var that, scope;
        o.bind = function($scope) {
            scope = $scope;
            that = this;
        };
        o.getAllReaded = function(id, page) {
            var delay = $q.defer();
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/" + id + "/detail/markRead?page=" + page
            })
                .success(function(data, status, headers, config) {
                    console.log("data--------------", data);
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    delay.resolve(data);
                    if (page == 1) {
                        scope.allReadedScope(data);
                    }
                })
                .error(function(data, status, headers, config) {
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    if (status === 500 || status === 502) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    delay.reject(data);
                });
            return delay.promise;
        };
        o.getAllUnReaded = function(id, page) {
            var delay = $q.defer();
            console.log("page::::", page);
            console.log(
                "url::::",
                SERVER.url + "/" + id + "/detail/unRead?page=" + page
            );
            //如果缓存没有就从服务器中取出来
            $http({
                method: "GET",
                url: SERVER.url + "/" + id + "/detail/unRead?page=" + page
            })
                .success(function(data, status, headers, config) {
                    console.log("data::::::::::", data);
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    delay.resolve(data);
                    if (page == 1) {
                        scope.allUnReadedScope(data);
                    }
                })
                .error(function(data, status, headers, config) {
                    //如果从服务器获取到了请求数据就将加载中取消
                    $ionicLoading.hide();
                    if (status === 500 || status === 502) {
                        SildeMessageBinder.tip({
                            msg:
                                JSON.stringify(data.message) ||
                                "服务器异常，请联系管理员！",
                            type: "error"
                        });
                    }
                    delay.reject(data);
                });
            return delay.promise;
        };
        return o;
    })
    .factory("OperatieConfirm", function(
        $ionicPopup,
        DeleteNotice,
        DeleteMydraftNotice,
        $ionicActionSheet,
        Utils
    ) {
        var service = {
            showDeleteConfirm: showDeleteConfirm,
            showRevokeConfirm: showRevokeConfirm,
            onHold: onHold
        };
        return service;

        function showDeleteConfirm(id) {
            var confirmPopup = $ionicPopup.confirm({
                title: "删除",
                template: "确定要删除该条通知吗?"
            });

            confirmPopup.then(function(res) {
                if (res) {
                    DeleteNotice(id);
                }
            });
        }
        function showRevokeConfirm(id) {
            var confirmPopup = $ionicPopup.confirm({
                title: "撤回",
                template: "确定要撤回该条通知么?"
            });

            confirmPopup.then(function(res) {
                if (res) {
                    DeleteMydraftNotice(id);
                }
            });
        }
        /**
         *
         * @param {id, operation} params
         * id: string
         * operation: ['delete', 'revoke']
         */
        function onHold(id, operation) {
            var nameMaps = {
                delete: {
                    name: "删除",
                    handler: showDeleteConfirm
                },
                revoke: {
                    name: "撤回",
                    handler: showRevokeConfirm
                }
            };
            if (Utils.isPc()) {
                return;
            }
            var buttons = operation.map(function(key) {
                return {
                    text:
                        '<p class="ionic-operation">' +
                        nameMaps[key].name +
                        "</p>"
                };
            });
            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                destructiveText: "取消",
                buttonClicked: function(index) {
                    nameMaps[operation[index]].handler(id);
                    return true;
                },
                destructiveButtonClicked: function() {
                    hideSheet();
                }
            });
        }
    });
