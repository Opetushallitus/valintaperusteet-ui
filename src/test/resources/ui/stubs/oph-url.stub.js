// test/resources/ui/stubs/oph-url.stub.js
(function (win) {
    var _props = {};
    // Optional raw registry; some legacy code may read it
    win.OPH_URLS = win.OPH_URLS || _props;

    function interpolate(base, params, encode) {
        // replace /path/{id}/... with params.id
        return base.replace(/\{([^}]+)}/g, function (_, k) {
            var v = params != null ? params[k] : undefined;
            if (v == null) return "{" + k + "}";
            return encode ? encodeURIComponent(String(v)) : String(v);
        });
    }

    function buildQuery(params, encode) {
        if (!params || typeof params !== "object") return "";
        var pairs = Object.keys(params).map(function (k) {
            var key = encode ? encodeURIComponent(k) : String(k);
            var val = encode ? encodeURIComponent(params[k]) : String(params[k]);
            return key + "=" + val;
        });
        return pairs.length ? "?" + pairs.join("&") : "";
    }

    function makeBuilder(encodeParams) {
        return {
            // typical usage: window.urls().url('some.key', params)
            url: function (key, params) {
                var base = _props[key] || ("/__stub__/" + key);
                // interpolate placeholders first
                base = interpolate(base, params, encodeParams);
                // if placeholders consumed all params, query is still harmless
                return base + buildQuery(params, encodeParams);
            },
            // some apps call noEncode — we support it and keep behavior identical for tests
            noEncode: function (key, params) {
                var base = _props[key] || ("/__stub__/" + key);
                base = interpolate(base, params, /*encode*/ false);
                return base + buildQuery(params, /*encode*/ false);
            }
        };
    }

    // window.urls must be a FUNCTION returning an object with .url(...) and .noEncode(...)
    function urls() {
        return makeBuilder(true);
    }

    // many “*_url_properties.js” call urls.addProperties({...})
    urls.addProperties = function (obj) {
        obj = obj || {};
        Object.keys(obj).forEach(function (k) {
            _props[k] = obj[k];
        });
        // keep OPH_URLS in sync for legacy code
        win.OPH_URLS = _props;
    };

    // expose aliases used across older codebases
    win.urls = urls;
    win.ophUrls = urls;
    if (!win.url) win.url = urls; // singular alias seen in some modules
})(window);
