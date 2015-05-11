define('lodash/internal/root', [], function () {
    var objectTypes = {
            'function': true,
            'object': true
        };
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
    var freeSelf = objectTypes[typeof self] && self && self.Object && self;
    var freeWindow = objectTypes[typeof window] && window && window.Object && window;
    var root = freeGlobal || freeWindow !== (this && this.window) && freeWindow || freeSelf || this;
    return root;
});