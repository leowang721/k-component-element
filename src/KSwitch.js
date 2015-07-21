/**
 * @file KSwitch.js
 * @author Ming Liu(liuming07@baidu.com)
 */

define(function (require) {

    require('k-component/component!./k-switch');
    require('css!./k-switch.less');

    var $ = require('jquery');
    var util = require('/src/lib/util');

    /**
     * KHorizontalSwitch.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
            // 能否进行滚动，默认可以
            var me = this;
            me.canScroll = true;
            me.$main = $(me.el);
            me.timer = null;
            me.elChildNum = $(me.el).children().length;
            me.align = me.$main.attr('align') || 'vertical';
            me.timeInterval = +me.$main.attr('time') || 500;
        },

        /**
         * 初始化行为，例如 model 的初始化、自身实例事件处理等
         */
        initBehavior: function () {
            var me = this;

            // 如果是水平，需要设置下样式
            if (me.align === 'horizontal') {
                me.setStyle();
            }
            // 嗅探浏览器，进行一些兼容性处理，避免在业务内部，每次都去判断
            me.sniffBrowser();
        },

        /**
         * 水平切换需要操作下样式
         */
        setStyle: function () {
            var me = this;
            me.$main.children().addClass('float-left').width(me.$main.parent().width());
            me.$main.width(me.$main.parent().width() * me.elChildNum);
        },

        /**
         * 浏览器行为嗅探
         */
        sniffBrowser: function () {
            var me = this;
            // 将两个运动分开写，只需要在这里判断一次即可，如果写在一个函数中，每次都要去嗅探，当然
            // 也可以采用函数的惰性加载
            me.animate = (util.isSupportCSS3('transition') && util.isSupportCSS3('transform'))
                ? me.css3Animate : me.jqueryAnimate;
        },

        /**
         * @overrides
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            // FF: DOMMouseScroll
            me.$main.on('mousewheel DOMMouseScroll', function (e) {
                e.preventDefault();
                if (!me.canScroll) {
                    return false;
                }
                me.canScroll = false;
                me.startScroll(util.getMouseScrollVal(e), e);
            });
            // 运动过程中
            me.$main
                .on('transitionend webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd', function () {
                    clearTimeout(me.timer);
                    me.timer = setTimeout(function () {
                        me.canScroll = true;
                    }, 500);
                });
        },

        /**
         * 开始滚动运动
         * @param  {number} dirction 运动方向  1: 向左运动   -1：向右运动
         * @return {?boolean}
         */
        startScroll: function (dirction) {
            var me = this;
            var properties = me.getPositionProperites(dirction);

            if (properties.type === 'left') {
                // 在边界区域
                if (me.isAtLeftOrRight(properties)) {
                    me.canScroll = true;
                    return false;
                }
                me.animate(properties.left, 0);
            }
            else {
                // 在边界区域
                if (me.isAtTopOrBottom(properties)) {
                    me.canScroll = true;
                    return false;
                }
                me.animate(0, properties.top);
            }
        },

        /**
         * 获取位置相关信息
         * @param {number} dirction 方向标示
         * @return {Object} 相关位置信息包装对象
         */
        getPositionProperites: function (dirction) {
            var me = this;
            var position = $(me.el).position();
            var width = me.$main.width() / me.elChildNum;
            var height = me.$main.height();

            return {
                type: me.align === 'vertical' ? 'top' : 'left',
                width: width,
                height: height,
                left: Math.min(position.left + width * dirction, 0),
                top: Math.min(position.top + height * dirction, 0)
            };
        },

        /**
         * 是否在最左或者最右
         * @param  {Object}  properties 相关位置信息包装对象
         * @return {boolean}
         */
        isAtLeftOrRight: function (properties) {
            var me = this;
            var position = $(me.el).position();
            return properties.left === 0 && position.left === 0
                || properties.left === -me.elChildNum * properties.width;
        },

        /**
         * 是否在最顶或者最底
         * @param  {Object}  properties 相关位置信息包装对象
         * @return {boolean}
         */
        isAtTopOrBottom: function (properties) {
            var me = this;
            var position = $(me.el).position();
            return properties.top === 0 && position.top === 0
                || properties.top === -me.elChildNum * properties.height;
        },

        /**
         * css3滚动函数
         * @param  {number} x 目标left值
         * @param  {number} y 目标top值
         */
        css3Animate: function (x, y) {
            var me = this;
            me.$main.css({
                'transition': 'all ' + me.timeInterval + 'ms ease',
                'transform': 'translate3d(' + x + 'px,' + y + 'px, 0px)'
            });
        },

        /**
         * jquery的animate
         * @param  {number} x 目标left值
         * @param  {number} y 目标top值
         */
        jqueryAnimate: function (x, y) {
            var me = this;
            me.$main.animate({left: x, top: y}, me.timeInterval, function () {
                clearTimeout(me.timer);
                me.timer = setTimeout(function () {
                    me.canScroll = true;
                }, 500);
            });
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            var me = this;
            me.timer = 0;
            me.$super(arguments);
        }
    };

    var KHorizontalSwitch = require('eoo').create(require('k-component/Action'), overrides);

    return KHorizontalSwitch;
});
