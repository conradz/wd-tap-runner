var http = require('http'),
    wdTap = require('wd-tap');

var testPage = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
        '<title>Tests</title>',
    '</head>',
    '<body>',
        '<pre id="output"></pre>',
        '<script>',
        '// Redirect console output',
        '(function() {',
            'var console, oldLog;',
            'var output = document.getElementById("output");',
            'function log(text) {',
                'if (oldLog) { oldLog.apply(console, arguments); }',
                'output.appendChild(document.createTextNode(text + "\\r\\n"));',
            '}',
            '',
            'if (window.console) { console = window.console; }',
            'else { window.console = console = {}; }',
            'oldLog = console.log;',
            'console.log = log;',
        '})();',
        '</script>',
        '<script src="/tests.js"></script>',
    '</body>',
    '</html>'
].join('\r\n');

function runner(src, browser, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    var port = 8000,
        server = http.createServer(app);
    if (typeof options.port !== 'undefined') {
        port = options.port;
    }

    startServer();

    function app(req, resp) {
        if (req.url === '/') {
            resp.setHeader('Content-Type', 'text/html; charset=utf-8');
            resp.end(testPage, 'utf8');
        } else if (req.url === '/tests.js') {
            resp.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            if (typeof src.pipe === 'function') {
                src.pipe(resp);
            } else {
                resp.end(src, 'utf8');
            }
        } else {
            resp.statusCode = 404;
            resp.setHeader('Content-Type', 'text/plain');
            resp.end('Not Found');
        }
    }

    function startServer() {
        server.listen(port, function(err) {
            if (err) { return callback(err); }
            port = server.address().port;

            runTests();
        });
    }

    function runTests() {
        var url = 'http://localhost:' + port + '/',
            testOptions = { timeout: options.timeout };
        wdTap(url, browser, testOptions, testsComplete);
    }

    function testsComplete(err, data) {
        stopServer(function() {
            callback(err, data);
        });
    }

    function stopServer(callback) {
        server.close(callback);
    }
}

module.exports = runner;