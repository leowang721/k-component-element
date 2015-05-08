# k-component-element
component element based on k-component

this is a set of defined basic component elements that we can use directly.

必须显示声明依赖，例如：
```javascript
require('k-component/component!k-component-element/k-selection');
require('k-component/component!./demo-preview');
require('css!./demo-preview.less');
```

这里的 k-selection 即使在其他文件中有过依赖，也要显示声明依赖，这是为了防止出现执行时出现未注册的问题导致的执行失败。

例如$k('#abc') 可能为 undefined 的问题。