angular.module('starter')
//添加通知的controller
.controller('AddNoticeCtrl', function() {
  if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) || (navigator.userAgent.indexOf('PC Client') > -1)) {
    $('.two').hide();
  }
});