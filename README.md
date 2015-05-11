# k-component-element
component element based on k-component

this is a set of defined basic component elements that we can use directly.

## Demo Online
[Demo Online](http://leowang721.github.io/k-component-element/preview/index.html)

## require element

```javascript
require('k-component/component!k-component-element/some-element');
// or
require('k-component-element/SomeElement');
```
Then we can use custom element as HTMLElement.

[Try](http://leowang721.github.io/k-component-element/preview/index.html)

## about $k
```javascript
var a = $k(query|element);  // get a instance which can handle component's Action
a.ready(method);  // when component is ready, do method
a.on('eventName', method);  // when component is ready, bind event
```
## about $k.$
```javascript
$k.$(query|element);  // is zepto selector, but it can get elements in shadow root
```