;
(function () {
	if (!Object.assign) {
		Object.defineProperty(Object, "assign", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: function (target, firstSource) {
				"use strict";
				if (target === undefined || target === null) {
					throw new TypeError("Cannot convert first argument to object");
				}
				var to = Object(target);
				for (var i = 1; i < arguments.length; i++) {
					var nextSource = arguments[i];
					if (nextSource === undefined || nextSource === null) continue;
					var keysArray = Object.keys(Object(nextSource));
					for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
						var nextKey = keysArray[nextIndex];
						var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
						if (desc !== undefined && desc.enumerable) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
				return to;
			}
		});
	}
}());

;
(function () {
	if (!Array.prototype.map) {
		Array.prototype.map = function (callback, thisArg) {
			var T, A, k;
			if (this == null) {
				throw new TypeError(" this is null or not defined");
			}
			// 1. 将O赋值为调用map方法的数组.
			var O = Object(this);
			// 2.将len赋值为数组O的长度.
			var len = O.length >>> 0;
			// 3.如果callback不是函数,则抛出TypeError异常.
			if (Object.prototype.toString.call(callback) != "[object Function]") {
				throw new TypeError(callback + " is not a function");
			}
			// 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
			if (thisArg) {
				T = thisArg;
			}
			// 5. 创建新数组A,长度为原数组O长度len
			A = new Array(len);
			// 6. 将k赋值为0
			k = 0;
			// 7. 当 k < len 时,执行循环.
			while (k < len) {
				var kValue, mappedValue;
				//遍历O,k为原数组索引
				if (k in O) {
					//kValue为索引k对应的值.
					kValue = O[k];
					// 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
					mappedValue = callback.call(T, kValue, k, O);
					// 返回值添加到新数组A中.
					A[k] = mappedValue;
				}
				// k自增1
				k++;
			}
			// 8. 返回新数组A
			return A;
		};
	}
})();

;
(function () {
	if (!Array.prototype.filter)
		Array.prototype.filter = function (func, thisArg) {
			'use strict';
			if (!((typeof func === 'Function' || typeof func === 'function') && this))
				throw new TypeError();

			var len = this.length >>> 0,
				res = new Array(len), // preallocate array
				t = this,
				c = 0,
				i = -1;
			if (thisArg === undefined)
				while (++i !== len)
					// checks to see if the key was set
					if (i in this)
						if (func(t[i], i, t))
							res[c++] = t[i];
						else
							while (++i !== len)
								// checks to see if the key was set
								if (i in this)
									if (func.call(thisArg, t[i], i, t))
										res[c++] = t[i];

			res.length = c; // shrink down array to proper size
			return res;
		};
})();

;
(function () {
	if (!Array.prototype.reduce) {
		Object.defineProperty(Array.prototype, 'reduce', {
			value: function (callback /*, initialValue*/ ) {
				if (this === null) {
					throw new TypeError('Array.prototype.reduce ' +
						'called on null or undefined');
				}
				if (typeof callback !== 'function') {
					throw new TypeError(callback +
						' is not a function');
				}
				// 1. Let O be ? ToObject(this value).
				var o = Object(this);
				// 2. Let len be ? ToLength(? Get(O, "length")).
				var len = o.length >>> 0;
				// Steps 3, 4, 5, 6, 7      
				var k = 0;
				var value;
				if (arguments.length >= 2) {
					value = arguments[1];
				} else {
					while (k < len && !(k in o)) {
						k++;
					}
					// 3. If len is 0 and initialValue is not present,
					//    throw a TypeError exception.
					if (k >= len) {
						throw new TypeError('Reduce of empty array ' +
							'with no initial value');
					}
					value = o[k++];
				}
				// 8. Repeat, while k < len
				while (k < len) {
					// a. Let Pk be ! ToString(k).
					// b. Let kPresent be ? HasProperty(O, Pk).
					// c. If kPresent is true, then
					//    i.  Let kValue be ? Get(O, Pk).
					//    ii. Let accumulator be ? Call(
					//          callbackfn, undefined,
					//          « accumulator, kValue, k, O »).
					if (k in o) {
						value = callback(value, o[k], k, o);
					}
					// d. Increase k by 1.      
					k++;
				}
				// 9. Return accumulator.
				return value;
			}
		});
	}
})();
