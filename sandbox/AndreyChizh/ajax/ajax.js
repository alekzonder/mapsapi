/**
 * Leaflet AJAX Plugin
 * Version 1.0.1
 *
 * Copyright (c) 2013, 2GIS, Andrey Chizh
 */
L.ajax = function(params) {
    var query = '',
        head,
        script,
        callbackId,
        callbackName,
        resUrl;

    var url = params.url,
        data = params.data || {},
        beforeSend = params.beforeSend || function() {},
        success = params.success || function() {},
        error = params.error || function() {},
        complete = params.complete || function() {};

    head = document.getElementsByTagName('head')[0];

    callbackId = 'dg_' + ('' + Math.random()).slice(2);
    callbackName = 'L.ajax.callback.' + callbackId;

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
        }
    }

    if (url.indexOf('?') === -1) {
        resUrl = url + '?' + query + 'callback=' + callbackName;
    } else {
        resUrl = url + '&' + query + 'callback=' + callbackName;
    }

    try {
        L.ajax.callback[callbackId] = function(data) {
            success(data);
            head.removeChild(script);
            delete L.ajax.callback[callbackId];
        };
    } catch (e) {
        error({ url: resUrl, event: e });
    }

    beforeSend();
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = resUrl;
    head.appendChild(script);
    complete();

    script.onerror = function(e) {
        error({ url: resUrl, event: e });
    };

    return callbackId;

    var test = function(cid) {
        console.log(cid)
    }

};

L.ajax.callback = {};