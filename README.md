# k-component-element

英文太烂了！

此项目是基于[k-component](https://github.com/leowang721/k-component)建立一系列自定义元素：
- mark-commandable 以父元素为载体(host)，支持命令模式，任意子元素如果有属性 data-command，则可触发 host 上的对应事件
- mark-selectable 以父元素为 host，标记后续兄弟元素为可选择模式

- k-selection 一个可用于选择模式的列表标签
- k-list 一个基于数据的列表标签，不可直接用于选择，除非继承扩展或者嵌入 k-selection，支持命令模式
- k-item 一个基础的标签，未来要支持 icon
- k-menu 基础菜单标签，以 k-item 和 k-submenu 为支持子级元素（可嵌其他元素，无行为）
- k-submenu 子级菜单标签，可嵌入 k-menu 中使用，支持展开收起


## Demo Online
[Demo Online](http://leowang721.github.io/k-component-element/preview/index.html)
可以在这里直接在线修改和实验效果

## 加载自定义元素

有两种加载方式：

1. 使用k-component 提供的 AMD 插件直接加载.component.html

```javascript
require('k-component/component!k-component-element/some-element');
```

2) 直接AMD加载对应的 Action 文件
```javascript
require('k-component-element/SomeElement');
```

加载方式的区别：

1. 可起到自动的按需加载的效果，使页面加载碎片化，但是可能会触犯加载顺序问题
2. 不会触犯加载顺序问题，能够控制顺序以及进行自动合并

加载建议：
- 如果是基础元素、公共元素的开发，建议使用第二种以便进行合并、打包和预加载
- 如果是业务元素、业务模块元素，建议使用第一种进行按需加载

## 关于 k-component
查看[k-component](https://github.com/leowang721/k-component)
