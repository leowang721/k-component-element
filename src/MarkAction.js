/**
 * @file 标记类标签的行为父类，标记类标签将会通过引入而导致其父级元素（如果是shadowRoot 则穿透至其host）有一定特殊的行为
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    /**
     * 标记后面的兄弟元素为selectable的
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {

            this.el.attr('hidden', '');

            // 查询 host
            var parent = this.el.parent()[0];

            // 如果 parent 是 content，则向上一层
            if (parent.tagName && parent.tagName.toLowerCase() === 'content') {
                parent = parent.parentNode;
            }

            // 如果parent是shadowRoot，则穿透到其 host 上
            var hasGoneThrough = false;
            if (parent.host) {
                parent = parent.host;
                hasGoneThrough = true;
            }
            else if (parent.tagName.toLowerCase() === 'fake-shadow-root') {
                parent = parent.parentNode;
            }

            /**
             * @property {HTMLElement} host 宿主元素
             */
            this.host = this.$(parent);

            /**
             * @property {Zepto} $host 用于绑定事件的宿主 Zepto 对象
             */
            if (hasGoneThrough) {  // support shadow root
                this.$host = this.$(parent.shadowRoot);
            }
            else {
                this.$host = this.host;
            }
        }
    };

    var MarkSelectable = require('eoo').create(require('k-component/Action'), overrides);

    return MarkSelectable;
});
