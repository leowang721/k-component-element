define('k-component/main', ['require'], function (require) {
    var component = { version: '0.0.1-alpha.9' };
    return component;
});

define('k-component', ['k-component/main'], function ( main ) { return main; });