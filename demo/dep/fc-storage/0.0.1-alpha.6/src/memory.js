/**
 * @file storage的内存模式
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');
    var eoo = require('eoo');
    var EventTarget = require('mini-event/EventTarget');

    /**
     * 基础getTypeString方法
     * @param {*} target 目标变量
     * @return {string} 对应的type string
     */
    function getTypeString(target) {
        return Object.prototype.toString.call(target);
    }

    /**
     * AjaxSession类的构造函数 & 方法 & 属性等声明
     * @class MemoryStorage
     * @extends mini-event.EventTarget
     */
    var proto = {};

    /**
     * 构造函数
     * @constructor
     */
    proto.constructor = function() {

        var data = {};

        /**
         * 支持状态，memory模式肯定是true，浏览器都支持
         * 除非当作其他存储模式的替身，例如localStorage，需要手动标记为false
         * @type {boolean}
         */
        this.supported = true;

        // 构造函数中定义下列四个方法，是为了能够调用私有变量data
        /**
         * 获取数据
         * @param {string} key 键
         * @return {*} 数据
         */
        this.get = this.getItem = function (key) {
            return data[key];
        };

        /**
         * 设置数据
         * @fires MemoryStorage#change
         * @param {string} key 键
         * @param {*} value 值
         * @return {MemoryStorage} 当前实例，供链式调用
         */
        this.set = this.setItem = function (key, value) {
            if (typeof key !== 'string' || !key) {
                throw new Error('错误的storage.memory.setItem使用，非法键值');
            }
            data[key] = value;

            /**
             * 值变更时触发
             * @event MemoryStorage#change
             */
            this.fire('change');
            return this;
        };

        /**
         * 更新数据
         * @fires MemoryStorage#change
         * @param {string} key 键
         * @param {*} value 要更新的值
         * @return {*} 返回新值
         */
        this.update = this.updateItem = function (key, value) {
            if (typeof key !== 'string' || !key) {
                throw new Error('错误的storage.memory.updateItem使用，'
                    + '非法键值');
            }
            var origValue = this.getItem(key);
            if (getTypeString(origValue) !== getTypeString(value)) {
                this.setItem(key, value);

                /**
                 * 值变更时触发
                 * @event MemoryStorage#change
                 */
                this.fire('change');
                return value;
            }

            if (_.isArray(value) || _.isObject(value)) {
                this.setItem(key, _.deepExtend(origValue, value));
            }
            else {
                this.setItem(key, value);
            }

            /**
             * 值变更时触发
             * @event MemoryStorage#change
             */
            this.fire('change');
            return value;
        };

        /**
         * 批量修改，这是个替换性质行为而不是更新
         * @fires MemoryStorage#change
         * @param {Object} source 要更新的值
         * @param {Object=} opts 选项
         * @return {MemoryStorage} 当前实例，供链式调用
         */
        this.fill = function (source, opts) {
            if (!_.isObject(source) || _.isArray(source)) {
                throw new Error('错误的storage.memory.fill使用，'
                    + '非法值');
            }

            opts = opts || {};
            if (opts.update) {
                _.deepExtend(data, source);
            }
            else {
                _.extend(data, source);
            }

            /**
             * 值变更时触发
             * @event MemoryStorage#change
             */
            this.fire('change');
            return this;
        };

        /**
         * 删除数据
         * @fires MemoryStorage#change
         * @param {string} key 键
         * @return {MemoryStorage} 当前实例，供链式调用
         */
        this.remove = this.removeItem = function (key) {
            delete data[key];

            /**
             * 值变更时触发
             * @event MemoryStorage#change
             */
            this.fire('change');
            return this;
        };

        /**
         * 清空数据
         * @fires MemoryStorage#change
         * @return {MemoryStorage} 当前实例，供链式调用
         */
        this.clear = function () {
            data = {};

            /**
             * 值变更时触发
             * @event MemoryStorage#change
             */
            this.fire('change');
            return this;
        };

        /**
         * dump出一个Object
         * @return {Object} 结果
         */
        this.dump = function () {
            return _.deepClone(data);
        };
    };

    var MemoryStorage = eoo.create(EventTarget, proto);

    /**
     * 默认memory存储实例
     */
    var storage = new MemoryStorage();

    /**
     * 扩展默认memory存储实例，增加一个方法：创建一个新的memory存储实例
     * 它可以用于自定义的位置，例如独立的模块中
     * @return {Object} 一个新的MemoryStorage的实例
     */
    storage.createInstance = function () {
        return new MemoryStorage();
    };

    return storage;
});
