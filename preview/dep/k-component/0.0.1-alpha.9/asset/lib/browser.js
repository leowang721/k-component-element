define('k-component/lib/browser', ['require'], function (require) {
    var w = window;
    var ver = w.opera ? opera.version().replace(/\d$/, '') - 0 : parseFloat((/(?:IE |fox\/|ome\/ion\/)(\d+\.\d)/.exec(navigator.userAgent) || [
            ,
            0
        ])[1]);
    var browser = {
            ie: !!w.VBArray && Math.max(document.documentMode || 0, ver),
            firefox: !!w.netscape && ver,
            opera: !!w.opera && ver,
            chrome: !!w.chrome && ver,
            safari: /apple/i.test(navigator.vendor) && ver
        };
    return browser;
});