/**
 * @file DemoPreview.js
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    var _ = require('underscore');
    var $ = require('k-component/lib/zepto');
    var $k = require('k-component/k');
    var Promise = require('fc-core/Promise');
    var localStorage = require('fc-storage/localStorage');

    require('k-component/component!k-component-element/k-selection');
    require('k-component/component!k-component-element/k-list');
    require('k-component/component!k-component-element/mark-commandable');
    require('css!./demo-preview.less');

    var componentConfig = require('./componentConfig');

    /**
     * DemoPreview.js
     * @class
     */
    var overrides = {

        /**
         * 初始化，可用于调整 DOM 结构
         */
        initialize: function () {
            this.type = $(this.el).attr('type') || 'html';
            this.path = $(this.el).attr('path');

            var codingMain = $('#demo-preview-coding-main', this.content)[0];
            this.editor = ace.edit(codingMain);
            this.editor.setTheme('ace/theme/monokai');
            this.editor.$blockScrolling = Infinity;
            this.editor.setReadOnly(true);

            this.adjustEditor();
        },

        /**
         * 数据准备
         *
         * @return {meta.Promise} 返回Promise状态用于后续处理
         */
        initBehavior: function () {
            if (this.path) {
                this.processPreivew();
            }
        },

        /**
         * 事件绑定处理，直接使用 DOM 行为即可
         */
        bindEvents: function () {
            var me = this;
            // 初始化编辑器
            $('#demo-preview-coding-main', this.content).on('keypress', function (e) {
                if (e.keyCode === 13 && e.ctrlKey) {
                    me.showPreview();
                    e.preventDefault();
                }
            });

            $('#demo-preview-coding-type', this.shadowRoot).on('select', function (e) {
                $(me.el).attr('type', $(this.selection.getSelected()).attr('data-value'));
            });
        },

        // 执行预览
        showPreview: function () {
            var me = this;
            var code = {};

            // save first
            me.currentSaver && me.currentSaver();

            _.each(['html', 'less', 'javascript'], function (eachType) {
                if (eachType === me.type) {
                    code[eachType] = me.editor.getValue();
                }
                else {
                    code[eachType] = me.getCode(eachType);
                }
            });

            var resultMain = $('#demo-preview-result-main', this.shadowRoot);

            resultMain.html(code.html);
            // 设置css
            var style = document.createElement('style');
            var less = require('less');
            less.render(code.less, function (e, css) {
                if (e && !css) {
                    alert('less parse error!!');
                }
                style.innerHTML = css.css;
                resultMain.append(style);
            });

            // javascript
            // var method = new Function(code.javascript);
            // method();
            var script = document.createElement('script');

            // 由于 script执行的太快了，延迟一点点
            setTimeout(function () {
                resultMain.append(script);
                script.innerHTML = code.javascript;
            }, 1);
        },

        /**
         * 属性监听配置
         * - key 为要监听的属性名
         * - value 为处理函数：{function(oldVal:string, newVal:string)}
         *
         * @type {Object}
         */
        attributes: {
            'path': function (newVal) {
                this.path = newVal;
                this.processPreivew();
            },
            'type': function (newVal) {
                this.type = newVal;
                this.adjustEditor();
                this.processPreivew();
            }
        },

        adjustEditor: function () {
            this.editor.getSession().setMode('ace/mode/' + this.type);
        },

        currentSaver: null,
        // 加载component
        processPreivew: function () {
            var me = this;
            var path = me.path;
            if (path) {
                me.editor.setReadOnly(true);
                Promise.require(['k-component/component!k-component-element/' + path]).then(function () {
                    me.editor.setReadOnly(false);

                    var code = me.getCode();
                    me.editor.setValue(code);

                    me.currentSaver = me.getAutoSaver();
                    if (me.repeatMark) {
                        clearInterval(me.repeatMark);
                    }
                    me.repeat(me.currentSaver);
                    me.showPreview();
                });
            }
        },

        getCode: function (type) {
            var me = this;
            type = type || me.type;
            var path = me.path;
            var code = localStorage.getItem(path + '-' + type);
            if (!code) {
                code = componentConfig[path][type];
            }

            return code;
        },

        getAutoSaver: function () {
            var me = this;
            return function () {
                localStorage.setItem(me.path + '-' + me.type, me.editor.getValue());
            };
        },

        repeatMark: null,
        repeat: function (method) {
            var me = this;
            me.repeatMark = setInterval(function () {
                method();
                var now = new Date();
                var timestr = [
                    now.getFullYear(),
                    now.getMonth() + 1,
                    now.getDate()
                ].join('-');
                timestr += ' ' + [
                    _.pad(now.getHours(), 0, 2),
                    _.pad(now.getMinutes(), 0, 2),
                    _.pad(now.getSeconds(), 0, 2)
                ].join(':');
                $('#demo-preview-autosave-info', me.shadowRoot).html('自动保存于 ' + timestr);
            }, 5000);
        },

        /**
         * 销毁处理
         */
        dispose: function () {
            this.$super(arguments);
        }
    };

    var DemoPreview = require('fc-core/oo').derive(require('k-component/Action'), overrides);

    return DemoPreview;
});
