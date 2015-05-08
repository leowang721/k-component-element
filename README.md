# k-component-element
component element based on k-component

this is a set of defined basic component elements that we can use directly.

## 引用方式

可直接使用 `require('k-component/component!k-component-element/some-element');` 的方式
也可以 `require('k-component-element/SomeElement')`

前者建议项目模式下使用
后者建议开发 element 时使用以便避免按需加载顺序问题

## 介绍
主旨是创建一系列自定义的 Element 来使用

## 使用

$k(query|element)，可用于获取 component
$k.$，可用于穿透 shadowDOM 的获取元素