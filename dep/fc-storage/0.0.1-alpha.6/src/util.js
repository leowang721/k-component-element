/**
 * @file storage的公共工具集
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    var _ = require('underscore');

    /**
     * 基础toString方法
     * @param {*} target 要转为可判断类型字符串的目标变量
     * @return {string} 可判断类型的字符串，形如`[object Object]`
     */
    function toString(target) {
        return Object.prototype.toString.call(target);
    }

    /**
     * 拓展对象
     * 不用$.extend是因为$.extend在对象属性值为数组的时候，
     * 对数组做的是merge而不是替换
     *
     * @param {Object} source 源对象
     * @param {Object} destination 用于扩展的对象
     * @return {*} 扩展以后的对象
     */
    function extend(source, destination) {
        for (var key in destination) {
            if (destination.hasOwnProperty(key)) {
                source[key] = destination[key];
            }
        }
        return source;
    }

    /**
     * storage的工具集
     * @module util
     */
    var util = {

        /**
         * 扩展webstorage方法
         * @param {Object} storage 实例
         * @return {Object} 扩展后的工具集
         */
        getExtendedStorageMethods: function (storage) {
            var methods = {

                /**
                 * 获取数据
                 * @param {string} key 键
                 * @return {*} JSON parse后的数据
                 */
                getItem: function (key) {
                    var value = null;
                    try {
                        value = JSON.parse(storage.getItem(key));
                    }
                    catch (e) { }

                    return value;
                },

                /**
                 * 设置数据
                 * @fires Storage#change
                 * @param {string} key 键
                 * @param {*} value 值
                 * @return {Storage} 当前实例，供链式调用
                 */
                setItem: function (key, value) {
                    if (typeof key !== 'string' || !key) {
                        throw new Error('错误的storage.setItem使用，非法键值');
                    }
                    storage.setItem(key, JSON.stringify(value));

                    /**
                     * 值变更时触发
                     * @event Storage#change
                     */
                    this.fire('change');
                    return storage;
                },

                /**
                 * 更新数据
                 * @param {string} key 键
                 * @param {*} value 要更新的值
                 * @return {*} 返回新值
                 */
                updateItem: function (key, value) {
                    if (typeof key !== 'string' || !key) {
                        throw new Error('错误的storage.updateItem使用，'
                            + '非法键值');
                    }
                    var origValue = this.getItem(key);
                    if (toString(origValue) !== toString(value)) {
                        this.setItem(key, value);

                        /**
                         * 值变更时触发
                         * @event Storage#change
                         */
                        this.fire('change');
                        return value;
                    }

                    if ($.isPlainObject(value)) {
                        this.setItem(key, extend(origValue, value));
                    }
                    else {
                        this.setItem(key, value);
                    }

                    /**
                     * 值变更时触发
                     * @event Storage#change
                     */
                    this.fire('change');
                    return this.getItem(key);
                },

                /**
                 * 批量修改，这是个替换性质行为而不是更新
                 * @fires Storage#change
                 * @param {Object} source 要更新的值
                 * @param {Object=} opts 选项
                 * @return {Storage} 当前实例，供链式调用
                 */
                fill: function (source, opts) {
                    if (!_.isObject(source) || _.isArray(source)) {
                        throw new Error('错误的storage.memory.fill使用，'
                            + '非法值');
                    }

                    opts = opts || {};
                    var func = opts.update
                        ? storage.updateItem : storage.setItem;

                    for (var k in source) {
                        if (source.hasOwnProperty(k)) {
                            func.call(storage, k, source[k]);
                        }
                    }

                    /**
                     * 值变更时触发
                     * @event Storage#change
                     */
                    this.fire('change');
                    return storage;
                },

                /**
                 * 删除数据
                 * @fires Storage#change
                 * @param {string} key 键
                 */
                removeItem: function (key) {
                    storage.removeItem(key);

                    /**
                     * 值变更时触发
                     * @event Storage#change
                     */
                    this.fire('change');
                },

                /**
                 * @fires Storage#change
                 * 清空数据
                 */
                clear: function () {
                    storage.clear();

                    /**
                     * 值变更时触发
                     * @event Storage#change
                     */
                    this.fire('change');
                }
            };

            // short name for Model or etpl
            methods.get = methods.getItem;
            methods.set = methods.setItem;
            methods.update = methods.updateItem;
            methods.remove = methods.removeItem;

            return methods;
        }
    };

    return util;
});
