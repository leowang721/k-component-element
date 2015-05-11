define('fc-core/browser', ['require'], function (require) {
    var clientInfo = {};
    var UNKNOWN = 'other';
    var browserData = {};
    function parseUserAgent(rawUa) {
        var version = rawUa.match(/(IE|Firefox|Opera|Chrome|Safari)[ \/](\d+(\.\d+)?)/i);
        if (version && version[0]) {
            return version[0];
        }
        return UNKNOWN;
    }
    function isIe(rawUa) {
        return rawUa.indexOf('IE') !== -1;
    }
    function parseIeShell(rawUa) {
        if (isIe(rawUa)) {
            var shell = rawUa.slice(rawUa.lastIndexOf(';') + 2, rawUa.length - 1);
            return /Trident|Windows NT|\.NET/.test(shell) ? 'IE' : shell;
        }
        return 'null';
    }
    function parseOs(rawUa) {
        var result = rawUa.match(/(windows nt|macintosh|solaris|linux)/i);
        return result ? result[1] : UNKNOWN;
    }
    function parseClientResolution() {
        var format = function (w, h) {
            return w + ',' + h;
        };
        if (window.innerHeight) {
            return format(window.innerWidth, window.innerHeight);
        } else if (document.documentElement && document.documentElement.clientHeight) {
            return format(document.documentElement.clientWidth, document.documentElement.clientHeight);
        }
        return format(document.documentElement.clientWidth, document.documentElement.clientHeight);
    }
    function parseFlashVersion(navigator) {
        var f = 'ShockwaveFlash.ShockwaveFlash';
        var fla;
        if (navigator.plugins && navigator.mimeTypes.length) {
            fla = navigator.plugins['Shockwave Flash'];
            if (fla && fla.description) {
                return +fla.description.replace(/[^\d\.]/g, '').split('.')[0];
            }
        } else if (navigator.userAgent.toLowerCase().indexOf('ie') >= 0) {
            var A = ActiveXObject;
            fla = null;
            try {
                fla = new A(f + '.7');
            } catch (e) {
                try {
                    fla = new A(f + '.6');
                    fla.AllowScriptAccess = 'always';
                    return 6;
                } catch (ex) {
                }
                try {
                    fla = new A(f);
                } catch (ex) {
                }
            }
            if (fla) {
                try {
                    var toReturn = fla.GetVariable;
                    toReturn = toReturn('$version').split(' ')[1].split(',')[0];
                    return toReturn;
                } catch (e) {
                }
            }
        }
        return 0;
    }
    function initBrowserData(navigator, screen, history) {
        var rawUa = navigator.userAgent;
        var key = clientInfo.KEY;
        browserData[key.USER_AGENT] = parseUserAgent(rawUa);
        browserData[key.IE_SHELL] = parseIeShell(rawUa);
        browserData[key.OS] = parseOs(rawUa);
        browserData[key.PLATFORM] = navigator.platform;
        browserData[key.SCREEN_RESOLUTION] = screen.width + ',' + screen.height;
        browserData[key.CLIENT_RESOLUTION] = parseClientResolution();
        browserData[key.COLOR_DEPTH] = screen.colorDepth;
        browserData[key.FLASH] = parseFlashVersion(navigator);
        browserData[key.HISTORY_DEPTH] = history.length;
        browserData[key.PLUGIN_COUNT] = navigator.plugins.length;
        browserData[key.MIME_TYPE_COUNT] = navigator.mimeTypes.length;
        browserData[key.COOKIE_ENABLED] = navigator.cookieEnabled;
        browserData[key.LANGUAGE] = navigator.systemLanguage || navigator.language;
        browserData[key.BROWSER] = browserData[key.USER_AGENT].split(/[ /]/)[0];
        browserData[key.BROWSER_VERSION] = +browserData[key.USER_AGENT].split(/[ /]/)[1];
    }
    clientInfo.KEY = {
        USER_AGENT: 'nav',
        IE_SHELL: 'ies',
        OS: 'sys',
        PLATFORM: 'plt',
        SCREEN_RESOLUTION: 'swh',
        CLIENT_RESOLUTION: 'uwh',
        COLOR_DEPTH: 'scd',
        FLASH: 'flv',
        HISTORY_DEPTH: 'hil',
        PLUGIN_COUNT: 'pil',
        MIME_TYPE_COUNT: 'mil',
        COOKIE_ENABLED: 'coe',
        LANGUAGE: 'osl',
        BROWSER: 'bwr',
        BROWSER_VERSION: 'bwv'
    };
    clientInfo.getUserAgent = function () {
        return browserData[clientInfo.KEY.USER_AGENT];
    };
    clientInfo.isFlashSupported = function () {
        return browserData[clientInfo.KEY.FLASH] > 0;
    };
    clientInfo.getBrowserData = function () {
        return browserData;
    };
    clientInfo.getBrowserDataByKey = function (key) {
        return browserData[key];
    };
    clientInfo.getBrowser = function () {
        return browserData[clientInfo.KEY.BROWSER];
    };
    clientInfo.getBrowserVersion = function () {
        return browserData[clientInfo.KEY.BROWSER_VERSION];
    };
    clientInfo.resetForTest = initBrowserData;
    initBrowserData(window.navigator, window.screen, window.history);
    return clientInfo;
});