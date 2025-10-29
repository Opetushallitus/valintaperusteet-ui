window.url = window.url || function (path, params) {
    if (!params) return path;
    const q = Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
    return q ? path + '?' + q : path;

};