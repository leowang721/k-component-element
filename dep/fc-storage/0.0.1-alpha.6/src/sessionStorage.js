/**
 * @file storage的sessionStorage模式
 * 只支持IE8+，不再提供userData模拟
 * 扩展原因：默认的存储只支持字符串，在这里直接支持JSON
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');
    var fc = require('fc-core');
    var util = require('./util');

    /**
     * 存储器实例
     * @type {?Object} sessionStorage
     */
    var storage = window.sessionStorage;

    // 如果不支持，会转为memory，并且标记supported状态为false
    if (!storage) {
        var fallback = require('./memory').createInstance();
        fallback.supported = false;
        return fallback;
    }

    /**
     * 是否是IE8，IE8下配置一下强制写入数据
     * 这里使用了特性判断，判断IE8及之前版本
     * @type {boolean}
     */
    var isIE8 = typeof window.document.createElement !== 'function';

    /**
     * 存储控制器
     */
    var storageCtrl = {
        /**
         * 支持状态，到这里肯定是true
         * @type {boolean}
         */
        supported: true,
        isIE8: isIE8
    };

    // 扩展工具集
    _.extend(storageCtrl, util.getExtendedStorageMethods(storage));

    fc.EventTarget.enable(storageCtrl);

    return storageCtrl;
});
