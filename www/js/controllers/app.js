angular.module('starter')

//弹层提示(错误提示)
.controller('SildeMessageCtrl', ['$scope', '$injector', 'SildeMessageBinder', 'RootscopeApply',
    function($scope, $injector, SildeMessageBinder, RootscopeApply) {
        $scope.showSlideMessage = false;
        //$scope.ngPopInitClass = 'init';

        //绑定错误处理服务
        $injector.invoke(SildeMessageBinder.bind, this, {
            $scope: $scope
        });

        /**
         * 显示滑动提示
         * @param options[Object]: 初始化的参数
         *          options.msg[String]: 提示信息
         *          options.type[String]: 提示类型{'error': '错误提示'; 'message': '消息提示'}
         *          options.time[Number]: 持续时间
         */
        this.showMessage = function(options) {
            var t = options.time || 2000;

            $scope.showSlideMessage = true;
            $scope.slideMessageContent = options.msg;
            $scope.msgType = options.type;

            //三秒后
            setTimeout(function() {
                RootscopeApply($scope, function() {
                    $scope.showSlideMessage = false;
                });
            }, t);
        };
    }
])
