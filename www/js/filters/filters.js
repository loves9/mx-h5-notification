angular.module('starter')

	/*
	 * 计算文件大小并返回字符串
	 * @param size[Number]: 文件大小
	 */
	.filter('fileSizeFilter', function() {
		return function(size) {
			var newSize;

			if (size < 1024) {
				return size + 'Bytes';
			} else if (size < 1024 * 1024) {
				newSize = size / 1024;
				return newSize.toFixed(1) + 'KB';
			} else if (size < 1024 * 1024 * 1024) {
				newSize = size / Math.pow(1024,2);
				return newSize.toFixed(1) + 'MB';
			}else if(size < 1024 * 1024 * 1024 * 1024){
				newSize = size / Math.pow(1024,3);
				return newSize.toFixed(1) + 'G';
			}
		}
	})
	.filter('loginNameFilter', function() {
		return function(str) {
			str = str.indexOf('\\') > -1
				? str
				: str.replace(/\\/, '\\\\');
			str = str.indexOf('?') > -1
				? str + '&t=' + Date.now()
				: str + '?t=' + Date.now();
			return encodeURI(str);
		}
	})
	.filter('GetThumbnailUrl', function() {
		return function(contentType) {
			var thumbnail = "/images/files/file_90x90.png";
			if (contentType) {
				if (contentType.indexOf("image/")>-1 || contentType === 'image') {
					thumbnail = "/images/files/image_90x90.png";
				} else if ("application/msword" === contentType
						|| "application/vnd.openxmlformats-officedocument.wordprocessingml.document" === contentType || 'word' === contentType) {
					thumbnail = "/images/files/word_90x90.png";
				} else if ("application/vnd.ms-excel" === contentType
						|| "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" === contentType || 'excel' === contentType) {
					thumbnail = "/images/files/excel_90x90.png";
				} else if ("application/vnd.ms-powerpoint" === contentType
						|| "application/vnd.openxmlformats-officedocument.presentationml.presentation" === contentType || 'ppt' ===contentType) {
					thumbnail = "/images/files/ppt_90x90.png?";
				} else if ("application/pdf" === contentType || 'pdf' === contentType) {
					thumbnail = "/images/files/pdf_90x90.png?";
				} else if ("video/quicktime" === contentType || "application/vnd.rn-realmedia" === contentType
						|| "video/x-msvideo" === contentType || "video/x-dv" === contentType || "application/x-dvi" === contentType
						|| "video/mp4" === contentType || "video/mpeg" === contentType || "application/mp4" === contentType
						|| "video/vnd.objectvideo" === contentType || 'video' === contentType) {
					thumbnail = "/images/files/video_90x90.png";
				} else if (contentType.indexOf("audio/")>-1) {
					thumbnail = "/images/files/video_90x90.png";
				} else if ("application/zip" === contentType || "application/x-zip-compressed" === contentType || 'zip' === contentType) {
					thumbnail = "/images/files/zip_90x90.png";
				} else if ("text/plain" === contentType || 'txt' === contentType) {
					thumbnail = "/images/files/txt_90x90.png";
				}
			}
			return thumbnail;
		}
	})