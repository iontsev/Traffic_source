/*  Traffic Source  */;
(function (environ, options) {
    'use strict';

    var environ = environ;
    var options = options;
    var subject = options.subject;
    var limiter = options.limiter;
    var pattern = options.pattern;
    var message = options.message;

    function packing(data, meta, code) {
        var text = '';
        var span = '';
        var spin = code ? 1 : -1;

        data = data || '';
        meta = meta || '';

        for (var step = 0, size = ((data.length - data.length % meta.length) / meta.length) + 1; step < size; step = step + 1) {
            span = span + meta;
        };

        for (var step = 0, size = data.length; step < size; step = step + 1) {
            text = text + String.fromCharCode(data.charCodeAt(step) + spin * span.charCodeAt(step));
        };

        return text;
    };

    function marking(mark, sign, time, path, host, save) {
        var meta = [document.cookie.trim()];
        var data = decodeURIComponent(document.cookie);
        var temp = [];
        var date = new Date();

        if (mark) {
            mark = mark.trim();
            mark = encodeURIComponent(mark);
            meta = meta[0].split(mark + '=', 2);

            if (meta[1]) {
                meta = meta[1].split(';', 1);
                data = decodeURIComponent(meta[0]);
            } else {
                data = '';
            };

        };

        if (sign) {
            sign = sign.trim();
            sign = encodeURIComponent(sign);
            temp.push(mark + '=' + sign);

            if (time) {
                time = date.getTime() + (time * 24 * 60 * 60 * 1000);
                date.setTime(time);
                temp.push('expires=' + date.toGMTString());
            };

            if (path) temp.push('path=' + path);
            if (host) temp.push('domain=' + host);
            if (save) temp.push('secure');

            document.cookie = temp.join('; ') + ';';
            data = decodeURIComponent(mark);
        };

        return data;
    };

    function waiting(work, time, step) {
        var result = false;

        try {

            if (work() === true) {
                result = true;
            } else {
                step = (step > 0) ? step : 0;

                if (step > 1) setTimeout(function () {waiting(work, time, step - 1)}, time);

            };

        } catch (error) {
            result = false;
        };

        return result;
    };

    (function (environ) {
        var window = environ;
        var document = window.document;
        var navigator = window.navigator;

        waiting(
            function () {
                var result = false;

                if (typeof window.location !== undefined) {

                    if (navigator.cookieEnabled === true) {
                        var traffic = {};
                        var request = {};
                        var general = '';
                        var special = '';
                        var storage = packing(marking(subject), pattern, true);
                        var address = {
                            'source': document.referrer,
                            'target': window.location.href
                        };

                        if (address.target.split('?').length > 1) {
                            request = address.target
                                .toLowerCase()
                                .split('?', 2)[1]
                                .split('#', 1)[0]
                                .split('&')
                                .reduce(
                                    function (data, meta) {
                                        var meta = meta.split('=');
                                        var name = decodeURIComponent(meta[0]);
                                        var item = decodeURIComponent(meta[1]);

                                        if ((limiter.general.join() + limiter.special.join()).split(name).length > 1) data[name] = item;

                                        return data;
                                    },
                                    {}
                                );
                            general = limiter.general
                                .reduce(
                                    function (data, meta) {
                                        var meta = request[meta] || '';

                                        if (meta.length > 0) {

                                            if (data.length > 0) data = data + '||';

                                            data = data + meta;
                                        };

                                        return data;
                                    },
                                    ''
                                );
                            special = limiter.special
                                .reduce(
                                    function (data, meta) {
                                        var meta = request[meta] || '';

                                        if (meta.length > 0) {

                                            if (data.length > 0) data = data + '||';

                                            data = data + meta;
                                        };

                                        return data;
                                    },
                                    ''
                                );

                        };

                        traffic.header = general;
                        traffic.source = address.source.toLowerCase();
                        traffic.target = address.target.toLowerCase();

                        if (traffic.header === '') {

                            if (storage === '') {
                                traffic.header = (special === '') ? '...' : special;
                            } else {
                                traffic = storage
                                    .split('|||')
                                    .reduce(
                                        function (data, meta) {
                                            var meta = meta.split('>>>');
                                            var name = meta[0];
                                            var item = meta[1];

                                            if (name in traffic) data[name] = item;

                                            return data;
                                        },
                                        {}
                                    );
                            };

                        };

                        traffic.memory = 'header>>>' + traffic.header + '|||source>>>' + traffic.source + '|||target>>>' + address.target;
                        marking(subject, packing(traffic.memory, pattern, false), 1, '/');
                        message(subject, traffic);
                        result = true;
                    };

                };

                return result;
            },
            11,
            11
        );
    })(environ);
})(
    window,
    {
        'subject': '_>>>',
        'limiter': {
            'general': ['src'],
            'special': ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
        },
        'pattern': '// Replace traffic source!',
        'message': function (subject, variant) {
            var result = true;

            window.dataLayerOnline = window.dataLayerOnline || [];
            window.dataLayerOnline.push({
                'event': 'place_type_event',
                'place_type_title': variant.header,
                'place_type_value': variant.source
            });

            return result;
        }
    }
);
