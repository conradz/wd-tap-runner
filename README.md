# wd-tap-runner

Easily run TAP-producing JS unit tests in the browser, automated by WebDriver
with Node.js.

## Example

The browser you are testing must have access to `localhost`, either running
locally or through a tunnel.

```js
var runner = require('wd-tap-runner'),
    wd = require('wd'),
    browserify = require('browserify');

var myCode = browserify().add('./test.js').bundle(),
    browser = wd.remote();

browser.init(function() {
    runner(src, browser, { port: 8000 }, function(err, results) {
        // results is parsed using tap-parser
        browser.quit();
    });
});
```

## Reference

### `runner(src, browser, [options], callback)`

Runs the tests in the browser. The browser must have access to `localhost`,
either run the browser locally or open a tunnel to the remote browser.

`src` may be a stream or string of JS code that contains the tests that will
be run. `browser` is the WebDriver browser (created by
[wd](https://npmjs.org/package/wd)) that the tests will be run in. `options`
may contain a `port` property which specifies what port the HTTP server will
use (default is 8000). `callback` will be called with either an error or the
TAP test results, parsed using
[tap-parser](https://npmjs.org/package/tap-parser). Note that the error will
be null even if some tests failed; the results indicate what tests passed or
failed.
