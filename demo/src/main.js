/**
 * @file 主入口
 *
 * @author Leo Wang(leowang721@gmail.com)
 */

define(function (require) {
    require('fc-core');
    var _ = require('underscore');
    var $ = require('k-component/lib/zepto');
    var $k = require('k-component/k');

    require('k-component/component!k-component-element/k-selection');
    require('k-component/component!./demo-preview');

    // 初始化 menu
    var componentConfig = require('./componentConfig');
    var html = [];
    _.each(_.keys(componentConfig), function (name) {
        html.push('<li path="' + name + '">' + name + '</li>');
    });
    var menu = document.getElementById('main-menu');

    $k(menu).ready(function() {
        this.content.innerHTML = html.join('');
        $(this.el).on('select', function (e) {
            var path = $(this.selection.getSelected()).attr('path');
            $('demo-preview', $('#main')).attr('path', path);
        });
        this.select(this.content.children[0]);
    });
});
