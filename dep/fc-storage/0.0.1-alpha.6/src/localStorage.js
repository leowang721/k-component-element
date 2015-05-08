/**
 * @file storage的localStorage模式
 * 只支持IE8+，不再提供userData模拟
 * 扩展原因：默认的存储只支持字符串，在这里直接支持JSON
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');
    var util = require('./util');

    /**
     * 获取浏览器的原生localStorage
     * @return {?Object} localStorage|globalStorage
     */
    function getStorage() {
        if (typeof window.localStorage === 'object') {
            return window.localStorage;
        }
        else if (typeof window.globalStorage === 'object') {
            return window.globalStorage[window.location.host];
        }

        return null;
    }

    /**
     * 存储器实例
     * @type {?Object} localStorage|globalStorage
     */
    var storage = getStorage();

    // 如果不支持，会转为memory，并且标记supported状态为false
    if (!storage) {
        var fallback = require('./memory').createInstance();
        fallback.supported = false;
        return fallback;
    }

    /**
     * 存储控制器
     */
    var storageCtrl = {
        /**
         * 支持状态，到这里肯定是true
         * @type {boolean}
         */
        supported: true
    };

    // 扩展工具集
    _.extend(storageCtrl, util.getExtendedStorageMethods(storage));
    require('fc-core/EventTarget').enable(storageCtrl);

    return storageCtrl;
});
