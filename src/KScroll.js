/**
 * @file KScroll.js
 *
 * @author Ming Liu(liuming07@baidu.com)
 */

define(function (require) {

    require('k-component/component!./k-scroll');
    require('css!./k-scroll.less');
    var $ = require('jquery');
    var _ = require('underscore');
    var util = require('/src/lib/util');

    /**
     * KScroll.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
            // 能否进行滚动，默认可以
            this.canScroll = true;
            // 默认不支持CSS3,通过后面的判断来修正这个属性
            this.isSupportCSS3 = false;
            this.a = 1;
            this.$main = $(this.el); 
            this.timer = null;
            this.elChildNum = $(this.el).children().length;
        },

        /**
         * 初始化行为，例如 model 的初始化、自身实例事件处理等
         */
        initBehavior: function () {
            var me = this;
            me.checkSupportCSS3();
        },

        /**
         * @overrides
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            // FF: DOMMouseScroll
            $(document).on('mousewheel DOMMouseScroll', function (e) {
                 e.preventDefault();
                 if (!me.canScroll) {
                    return;
                 }
                 me.canScroll = false;
                 me.mouseScrollHandler(e);
            });
            // 运动过程中
            me.$main.on('transitionend webkitTransitionEnd mozTransitionEnd
                msTransitionEnd oTransitionEnd', function () {
                clearTimeout(me.timer);
                me.timer = setTimeout(function () {
                    me.canScroll = true;
                }, 500);
            });
        },

        /**
         * 初始化对CSS3的支持特性检测
         */
        checkSupportCSS3: function () {
            var transform = ['transform', '-webkit-transform', '-ms-transform',
                '-moz-transform', '-o-transform'];
            var transition = ['transition', '-webkit-transition', '-ms-transition',
                '-moz-transition', '-o-transition'];
            var supportTransform = false;
            var supportTransition = false;

            var body = document.querySelector('body');
            for (var i = 0, l = transform.length; i < l; i++) {
                if (body.style.hasOwnProperty(transform[i])) {
                    supportTransform = true;
                }
                if (body.style.hasOwnProperty(transition[i])) {
                    supportTransition = true;
                }
                // 高级浏览器通常循环一次就可以了
                if (supportTransform && supportTransition) {
                    break;
                }
            }
            this.isSupportCSS3 = supportTransition && supportTransform;
        },

        mouseScrollHandler: function (e) {
            var me = this;
            // FF: detail
            var dirction = e.originalEvent.wheelDelta
                ? (e.originalEvent.wheelDelta > 0 ? 1 : -1)
                : (-e.originalEvent.detail > 0 ? 1 : -1);
            me.startScroll(dirction, e);
        },

        /**
         * 开始滚动运动
         * @param  {number} dirction 运动方向  1: 向上运动   -1：向下运动
         * @param {Event} e jquery事件对象
         */
        startScroll: function (dirction, e) {
            var me = this;
            var bodyHeight = $('body').height();
            var position = $(me.el).position();
            var top = Math.min(position.top + bodyHeight * dirction, 0);

            // 如果在边界上，不再运动
            if (top === 0 && position.top === 0
                || top === -me.elChildNum * bodyHeight
            ) {
                me.canScroll = true;
                return;
            }
            // CSS3&&animate
            if (me.isSupportCSS3) {
                me.$main.css({
                    transition: 'all 500ms ease',
                    transform: 'translate3d(0px,' + top + 'px , 0px)'
                });
            }
            else {
                me.$main.animate({top: top}, 500, 'swing', function () {
                    clearTimeout(me.timer);
                    me.timer = setTimeout(function () {
                        me.canScroll = true;
                    }, 500);
                });
            }
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var KScroll = require('eoo').create(require('k-component/Action'), overrides);

    return KScroll;
});
