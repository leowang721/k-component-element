define('componentConfig', ['require'], function (require) {
    return {
        'mark-commandable': {
            html: [
                '<h1>\u54EA\u4E2A\u662F\u771F\u7684a\uFF0C\u70B9\u70B9\u770B</h1>',
                '<ul id="command-test">',
                '    <mark-commandable event-type="click"></mark-commandable>',
                '    <li>a</li>',
                '    <li data-command="real">a</li>',
                '    <li>a</li>',
                '    <li>a</li>',
                '</ul>'
            ].join('\n'),
            less: [
                '#command-test {',
                '    border: 2px solid green;',
                '    padding: 10px;',
                '    li {',
                '        cursor: pointer;',
                '        list-style: none;',
                '        padding: 3px 8px;',
                '        background-color: #efefef;',
                '        margin: 5px 0;',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                '$k.$(\'#command-test\').on(\'command:real\', function (e) {',
                '    alert(\'\u6211\u624D\u662F\u771F\u7684\')',
                '})'
            ].join('\n')
        },
        'mark-selectable': {
            html: [
                '<ul class="mark-selectable-test">',
                '    <mark-selectable selection="*"></mark-selectable>',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '</ul>',
                '<ul class="mark-selectable-test">',
                '    <mark-selectable selection="*" multi></mark-selectable>',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '</ul>'
            ].join('\n'),
            less: [
                '.mark-selectable-test {',
                '    border: 2px solid green;',
                '    padding: 10px;',
                '    li {',
                '        cursor: pointer;',
                '        list-style: none;',
                '        padding: 3px 8px;',
                '        background-color: #efefef;',
                '        margin: 5px 0;',
                '        &.selected {',
                '            background-color: green;',
                '            color: #ffffff;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: ['var $k = require(\'k-component/k\');'].join('\n')
        },
        'k-selection': {
            html: [
                '<k-selection id="hello">',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '    <li>d</li>',
                '</k-selection>',
                '<k-selection id="hello1" multi>',
                '    <li>a</li>',
                '    <li>b</li>',
                '    <li>c</li>',
                '    <li>d</li>',
                '</k-selection>',
                '<k-selection id="hello2" multi>',
                '    <k-list>',
                '        <li>${item}</li>',
                '    </k-list>',
                '</k-selection>'
            ].join('\n'),
            less: [
                '#hello, #hello1, #hello2 {',
                '    display: block;',
                '    margin: 10px 0;',
                '    padding: 0;',
                '    position: relative;',
                '    li {',
                '        cursor: pointer;',
                '        list-style: none;',
                '        padding: 2px 8px;',
                '        &:hover {',
                '            background-color: #efefef;',
                '        }',
                '        &.selected {',
                '            background-color: #cdef00;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                '$k(\'#hello\').on(\'select\', function (e) {',
                '    console.log(e.selection);',
                '});',
                '$k(\'#hello2 k-list\').ready(function () {',
                '    var list = [];',
                '    var len = 4;',
                '    for (var i = 0; i < len; i++) {',
                '        list.push(Math.random() * 10);',
                '    }',
                '    this.setList(list);',
                '});'
            ].join('\n')
        },
        'k-list': {
            html: [
                '<k-list id="list1">',
                '    <li>',
                '        <!-- for: ${item} as ${v}, ${k} -->',
                '        ${k} is ${v}',
                '        <!-- /for -->',
                '    </li>',
                '</k-list>'
            ].join('\n'),
            less: [
                '#list1 {',
                '    display: block;',
                '    margin: 10px 0;',
                '    padding: 0;',
                '    position: relative;',
                '    li {',
                '        list-style: none;',
                '        padding: 2px 8px;',
                '        &:hover {',
                '            background-color: #efefef;',
                '        }',
                '        &[selected] {',
                '            background-color: #cdef00;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                '$k(\'#list1\').ready(function () {',
                '    var list = [];',
                '    var len = 10;',
                '    for (var i = 0; i < len; i++) {',
                '        list.push({',
                '            name: \'name\' + Math.floor(Math.random() * 10),',
                '            age: Math.floor(Math.random() * 30),',
                '            aaa: [11, 13, 31][Math.floor(Math.random() * 3)],',
                '            children: [1,2,3]',
                '        });',
                '    }',
                '    this.setList(list);',
                '});'
            ].join('\n')
        },
        'k-item': {
            html: '<k-item>\u5360\u4E2A\u4F4D\u7F6E\u800C\u5DF2\uFF0C\u4EE5\u540E\u8981\u7528 ICON \u7684</k-item>',
            less: '',
            javascript: ['var $k = require(\'k-component/k\');'].join('\n')
        },
        'k-menu': {
            html: [
                '<k-menu id="menu1">',
                '    <mark-commandable></mark-commandable>',
                '    <k-list>',
                '        <k-item data-command="word" data-command-args="${item.word}">',
                '            ${item.text}',
                '        </k-item>',
                '    </k-list>',
                '</k-menu>'
            ].join('\n'),
            less: [
                '#menu1 {',
                '    border: 3px solid green;',
                '    padding: 5px 10px;',
                '    margin: 0;',
                '    position: relative;',
                '    display: block;',
                '    k-item {',
                '        display: block;',
                '        border: 2px solid green;',
                '        padding: 2px 8px;',
                '        margin: 5px 0;',
                '        cursor: pointer;',
                '        &:hover {',
                '            color: #ffffff;',
                '            background-color: lightgreen;',
                '        }',
                '        &.selected {',
                '            color: #ffffff;',
                '            background-color: green;',
                '        }',
                '    }',
                '}'
            ].join('\n'),
            javascript: [
                'var $k = require(\'k-component/k\');',
                'var $ = require(\'k-component/lib/zepto\');',
                '$k(\'#menu1\').ready(function () {',
                '    $(this.el).on(\'command:word\', function (e, args) {',
                '        alert(args);',
                '    });',
                '});',
                '$k(\'#menu1 k-list\').ready(function () {',
                '    var list = [];',
                '    var len = 10;',
                '    for (var i = 0; i < len; i++) {',
                '        list.push({',
                '            text: \'menu\' + Math.floor(Math.random() * 10),',
                '            word: \'\u64E6\u64E6 * \' + Math.floor(Math.random() * 10)',
                '        });',
                '    }',
                '    this.setList(list);',
                '});'
            ].join('\n')
        }
    };
});