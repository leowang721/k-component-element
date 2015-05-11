(function (window, document, Object) {
    var factory = function () {
        var REGISTER_ELEMENT = 'registerElement';
        if (REGISTER_ELEMENT in document)
            return;
        var EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 100000 >> 0), EXTENDS = 'extends', DOM_ATTR_MODIFIED = 'DOMAttrModified', DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified', PREFIX_TAG = '<', PREFIX_IS = '=', validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/, invalidNames = [
                'ANNOTATION-XML',
                'COLOR-PROFILE',
                'FONT-FACE',
                'FONT-FACE-SRC',
                'FONT-FACE-URI',
                'FONT-FACE-FORMAT',
                'FONT-FACE-NAME',
                'MISSING-GLYPH'
            ], types = [], protos = [], query = '', documentElement = document.documentElement, indexOf = types.indexOf || function (v) {
                for (var i = this.length; i-- && this[i] !== v;) {
                }
                return i;
            }, OP = Object.prototype, hOP = OP.hasOwnProperty, iPO = OP.isPrototypeOf, defineProperty = Object.defineProperty, gOPD = Object.getOwnPropertyDescriptor, gOPN = Object.getOwnPropertyNames, gPO = Object.getPrototypeOf, sPO = Object.setPrototypeOf, hasProto = !!Object.__proto__, create = Object.create || function Bridge(proto) {
                return proto ? (Bridge.prototype = proto, new Bridge()) : this;
            }, setPrototype = sPO || (hasProto ? function (o, p) {
                o.__proto__ = p;
                return o;
            } : gOPN && gOPD ? function () {
                function setProperties(o, p) {
                    for (var key, names = gOPN(p), i = 0, length = names.length; i < length; i++) {
                        key = names[i];
                        if (!hOP.call(o, key)) {
                            defineProperty(o, key, gOPD(p, key));
                        }
                    }
                }
                return function (o, p) {
                    do {
                        setProperties(o, p);
                    } while (p = gPO(p));
                    return o;
                };
            }() : function (o, p) {
                for (var key in p) {
                    o[key] = p[key];
                }
                return o;
            }), MutationObserver = window.MutationObserver || window.WebKitMutationObserver, HTMLElementPrototype = (window.HTMLElement || window.Element || window.Node).prototype, cloneNode = HTMLElementPrototype.cloneNode, setAttribute = HTMLElementPrototype.setAttribute, createElement = document.createElement, attributesObserver = MutationObserver && {
                attributes: true,
                characterData: true,
                attributeOldValue: true
            }, DOMAttrModified = MutationObserver || function (e) {
                doesNotSupportDOMAttrModified = false;
                documentElement.removeEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
            }, setListener = false, doesNotSupportDOMAttrModified = true, onSubtreeModified, callDOMAttrModified, getAttributesMirror, observer, patchIfNotAlready, patch;
        ;
        if (sPO || hasProto) {
            patchIfNotAlready = function (node, proto) {
                if (!iPO.call(proto, node)) {
                    setupNode(node, proto);
                }
            };
            patch = setupNode;
        } else {
            patchIfNotAlready = function (node, proto) {
                if (!node[EXPANDO_UID]) {
                    node[EXPANDO_UID] = Object(true);
                    setupNode(node, proto);
                }
            };
            patch = patchIfNotAlready;
        }
        if (!MutationObserver) {
            documentElement.addEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
            documentElement.setAttribute(EXPANDO_UID, 1);
            documentElement.removeAttribute(EXPANDO_UID);
            if (doesNotSupportDOMAttrModified) {
                onSubtreeModified = function (e) {
                    var node = this, oldAttributes, newAttributes, key;
                    ;
                    if (node === e.target) {
                        oldAttributes = node[EXPANDO_UID];
                        node[EXPANDO_UID] = newAttributes = getAttributesMirror(node);
                        for (key in newAttributes) {
                            if (!(key in oldAttributes)) {
                                return callDOMAttrModified(0, node, key, oldAttributes[key], newAttributes[key], 'ADDITION');
                            } else if (newAttributes[key] !== oldAttributes[key]) {
                                return callDOMAttrModified(1, node, key, oldAttributes[key], newAttributes[key], 'MODIFICATION');
                            }
                        }
                        for (key in oldAttributes) {
                            if (!(key in newAttributes)) {
                                return callDOMAttrModified(2, node, key, oldAttributes[key], newAttributes[key], 'REMOVAL');
                            }
                        }
                    }
                };
                callDOMAttrModified = function (attrChange, currentTarget, attrName, prevValue, newValue, action) {
                    var e = {
                            attrChange: attrChange,
                            currentTarget: currentTarget,
                            attrName: attrName,
                            prevValue: prevValue,
                            newValue: newValue
                        };
                    e[action] = attrChange;
                    onDOMAttrModified(e);
                };
                getAttributesMirror = function (node) {
                    for (var attr, name, result = {}, attributes = node.attributes, i = 0, length = attributes.length; i < length; i++) {
                        attr = attributes[i];
                        name = attr.name;
                        if (name !== 'setAttribute') {
                            result[name] = attr.value;
                        }
                    }
                    return result;
                };
            }
        }
        function loopAndVerify(list, action) {
            for (var i = 0, length = list.length; i < length; i++) {
                verifyAndSetupAndAction(list[i], action);
            }
        }
        function loopAndSetup(list) {
            for (var i = 0, length = list.length, node; i < length; i++) {
                node = list[i];
                patch(node, protos[getTypeIndex(node)]);
            }
        }
        function executeAction(action) {
            return function (node) {
                if (iPO.call(HTMLElementPrototype, node)) {
                    verifyAndSetupAndAction(node, action);
                    loopAndVerify(node.querySelectorAll(query), action);
                }
            };
        }
        function getTypeIndex(target) {
            var is = target.getAttribute('is'), nodeName = target.nodeName, i = indexOf.call(types, is ? PREFIX_IS + is.toUpperCase() : PREFIX_TAG + nodeName);
            ;
            return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
        }
        function isInQSA(name, type) {
            return -1 < query.indexOf(name + '[is="' + type + '"]');
        }
        function onDOMAttrModified(e) {
            var node = e.currentTarget, attrChange = e.attrChange, prevValue = e.prevValue, newValue = e.newValue;
            ;
            if (node.attributeChangedCallback && e.attrName !== 'style') {
                node.attributeChangedCallback(e.attrName, attrChange === e.ADDITION ? null : prevValue, attrChange === e.REMOVAL ? null : newValue);
            }
        }
        function onDOMNode(action) {
            var executor = executeAction(action);
            return function (e) {
                executor(e.target);
            };
        }
        function patchedSetAttribute(name, value) {
            var self = this;
            setAttribute.call(self, name, value);
            onSubtreeModified.call(self, { target: self });
        }
        function setupNode(node, proto) {
            setPrototype(node, proto);
            if (observer) {
                observer.observe(node, attributesObserver);
            } else {
                if (doesNotSupportDOMAttrModified) {
                    node.setAttribute = patchedSetAttribute;
                    node[EXPANDO_UID] = getAttributesMirror(node);
                    node.addEventListener(DOM_SUBTREE_MODIFIED, onSubtreeModified);
                }
                node.addEventListener(DOM_ATTR_MODIFIED, onDOMAttrModified);
            }
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
        document[REGISTER_ELEMENT] = function registerElement(type, options) {
            upperType = type.toUpperCase();
            if (!setListener) {
                setListener = true;
                if (MutationObserver) {
                    observer = function (attached, detached) {
                        function checkEmAll(list, callback) {
                            for (var i = 0, length = list.length; i < length; callback(list[i++])) {
                            }
                        }
                        return new MutationObserver(function (records) {
                            for (var current, node, i = 0, length = records.length; i < length; i++) {
                                current = records[i];
                                if (current.type === 'childList') {
                                    checkEmAll(current.addedNodes, attached);
                                    checkEmAll(current.removedNodes, detached);
                                } else {
                                    node = current.target;
                                    if (node.attributeChangedCallback && current.attributeName !== 'style') {
                                        node.attributeChangedCallback(current.attributeName, current.oldValue, node.getAttribute(current.attributeName));
                                    }
                                }
                            }
                        });
                    }(executeAction('attached'), executeAction('detached'));
                    observer.observe(document, {
                        childList: true,
                        subtree: true
                    });
                } else {
                    document.addEventListener('DOMNodeInserted', onDOMNode('attached'));
                    document.addEventListener('DOMNodeRemoved', onDOMNode('detached'));
                }
                document.addEventListener('readystatechange', function (e) {
                    loopAndVerify(document.querySelectorAll(query), 'attached');
                });
                document.createElement = function (localName, typeExtension) {
                    var node = createElement.apply(document, arguments), i = indexOf.call(types, (typeExtension ? PREFIX_IS : PREFIX_TAG) + (typeExtension || localName).toUpperCase()), setup = -1 < i;
                    ;
                    if (typeExtension) {
                        node.setAttribute('is', typeExtension = typeExtension.toLowerCase());
                        if (setup) {
                            setup = isInQSA(localName.toUpperCase(), typeExtension);
                        }
                    }
                    if (setup)
                        patch(node, protos[i]);
                    return node;
                };
                HTMLElementPrototype.cloneNode = function (deep) {
                    var node = cloneNode.call(this, !!deep), i = getTypeIndex(node);
                    ;
                    if (-1 < i)
                        patch(node, protos[i]);
                    if (deep)
                        loopAndSetup(node.querySelectorAll(query));
                    return node;
                };
            }
            if (-2 < indexOf.call(types, PREFIX_IS + upperType) + indexOf.call(types, PREFIX_TAG + upperType)) {
                throw new Error('A ' + type + ' type is already registered');
            }
            if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
                throw new Error('The type ' + type + ' is invalid');
            }
            var constructor = function () {
                    return document.createElement(nodeName, extending && upperType);
                }, opt = options || OP, extending = hOP.call(opt, EXTENDS), nodeName = extending ? options[EXTENDS].toUpperCase() : upperType, i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1, upperType;
            ;
            query = query.concat(query.length ? ',' : '', extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName);
            constructor.prototype = protos[i] = hOP.call(opt, 'prototype') ? opt.prototype : create(HTMLElementPrototype);
            loopAndVerify(document.querySelectorAll(query), 'attached');
            return constructor;
        };
    };
    if (typeof define === 'function' && define.amd) {
        define('custom-element-shim/document-register-element', [], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        factory();
    }
}(window, document, Object));

define('custom-element-shim', ['custom-element-shim/document-register-element'], function ( main ) { return main; });