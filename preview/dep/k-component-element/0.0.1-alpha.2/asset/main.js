define('k-component-element/main', ['require'], function (require) {
    var componentElement = { version: '0.0.1-alpha.2' };
    return componentElement;
});

define('k-component-element', ['k-component-element/main'], function ( main ) { return main; });