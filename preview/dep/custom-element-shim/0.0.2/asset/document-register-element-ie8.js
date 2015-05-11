;
(function (window, document, Object) {
    'use strict';
    var factory = function () {
        if (REGISTER_ELEMENT in document)
            return;
        var EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 100000 >> 0), EXTENDS = 'extends', avoidKeys = new RegExp('^(?:' + EXPANDO_UID + '|__proto__|setAttribute)$'), validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/, invalidNames = [
                'ANNOTATION-XML',
                'COLOR-PROFILE',
                'FONT-FACE',
                'FONT-FACE-SRC',
                'FONT-FACE-URI',
                'FONT-FACE-FORMAT',
                'FONT-FACE-NAME',
                'MISSING-GLYPH'
            ], types = [], protos = [], query = '', documentElement = document.documentElement, indexOf = function (v) {
                for (var i = this.length; i-- && this[i] !== v;) {
                }
                return i;
            }, OP = Object.prototype, hOP = OP.hasOwnProperty, iPO = OP.isPrototypeOf, defineProperty = Object.defineProperty, gOPD = Object.getOwnPropertyDescriptor, setPrototype = function (o, p) {
                do {
                    for (var key in p) {
                        if (!(key in o) && !avoidKeys.test(key) && hOP.call(p, key)) {
                            defineProperty(o, key, gOPD(p, key));
                        }
                    }
                } while (p = p.__proto__);
                return o;
            }, patchIfNotAlready = function (node, proto) {
                if (!node[EXPANDO_UID]) {
                    node[EXPANDO_UID] = Object(true);
                    setupNode(node, proto);
                }
            }, HTMLElementPrototype = Element.prototype, cloneNode = HTMLElementPrototype.cloneNode, setAttribute = HTMLElementPrototype.setAttribute, createElement = document.createElement, setListener = false;
        ;
        if (!window.HTMLElement) {
            window.HTMLElement = Element;
        }
        document[REGISTER_ELEMENT] = function registerElement(type, options) {
            upperType = type.toUpperCase();
            if (!setListener) {
                document.createElement = function (localName, typeExtension) {
                    var i, node = createElement.apply(document, arguments);
                    if (typeExtension) {
                        node.setAttribute('is', localName = typeExtension.toLowerCase());
                    }
                    i = indexOf.call(types, localName.toUpperCase());
                    if (-1 < i)
                        setupNode(node, protos[i]);
                    return setupBehavior(node);
                };
                HTMLElementPrototype.cloneNode = function (deep) {
                    var node = cloneNode.call(this, !!deep), i = getTypeIndex(node);
                    ;
                    if (-1 < i)
                        setupNode(node, protos[i]);
                    if (deep)
                        loopAndSetup(node.querySelectorAll(query));
                    return setupBehavior(node);
                };
                setupBehavior(documentElement);
            }
            var constructor = function () {
                    return setupBehavior(document.createElement(nodeName, extending && upperType));
                }, opt = options || OP, extending = hOP.call(opt, EXTENDS), nodeName = extending ? options[EXTENDS] : upperType, i = types.push(upperType) - 1, upperType;
            ;
            query = query.concat(query.length ? ',' : '', extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName);
            constructor.prototype = protos[i] = hOP.call(opt, 'prototype') ? opt.prototype : { __proto__: HTMLElementPrototype };
            onreadystatechange();
            return constructor;
        };
        function getAttributesMirror(node) {
            for (var attr, name, result = {}, attributes = node.attributes, i = 0, length = attributes.length; i < length; i++) {
                attr = attributes[i];
                name = attr.name;
                if (name !== 'setAttribute') {
                    result[name] = attr.value;
                }
            }
            return result;
        }
        function getTypeIndex(target) {
            var is = target.getAttribute('is');
            return indexOf.call(types, is ? is.toUpperCase() : target.nodeName);
        }
        function loopAndSetup(list) {
            for (var i = 0, length = list.length, node; i < length; i++) {
                node = list[i];
                setupNode(node, protos[getTypeIndex(node)]);
            }
        }
        function loopAndVerify(list, action) {
            for (var i = 0, length = list.length; i < length; i++) {
            }
        }
        function onreadystatechange() {
            if (query.length) {
                loopAndVerify(document.querySelectorAll(query), 'attached');
            }
        }
        function onSubtreeModified(e) {
        }
        function patchedSetAttribute(name, value) {
            var self = this;
            setAttribute.call(self, name, value);
            onSubtreeModified.call(self, { target: self });
        }
        function onpropertychange(e) {
            e || (e = event);
            console.log([
                e.propertyName,
                (e.fromElement || e.srcElement).nodeName
            ]);
        }
        function setupBehavior(node) {
            node.addBehavior(node.nodeName + '.htc');
            node.attachEvent('onreadystatechange', onreadystatechange);
            node.attachEvent('onpropertychange', onpropertychange);
            return node;
        }
        function setupNode(node, proto) {
            setPrototype(node, proto);
            node.setAttribute = patchedSetAttribute;
            node[EXPANDO_UID] = getAttributesMirror(node);
            if (node.createdCallback) {
                node.created = true;
                node.createdCallback();
                node.created = false;
            }
        }
        function verifyAndSetupAndAction(node, action) {
            var fn, i = getTypeIndex(node), attached = 'attached', detached = 'detached';
            ;
            if (-1 < i) {
                patchIfNotAlready(node, protos[i]);
                i = 0;
                if (action === attached && !node[attached]) {
                    node[detached] = false;
                    node[attached] = true;
                    i = 1;
                } else if (action === detached && !node[detached]) {
                    node[attached] = false;
                    node[detached] = true;
                    i = 1;
                }
                if (i && (fn = node[action + 'Callback']))
                    fn.call(node);
            }
        }
    };
    if (typeof define === 'function' && define.amd) {
        define('custom-element-shim/document-register-element-ie8', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(window, document, Object));