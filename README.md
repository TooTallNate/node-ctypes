node-ctypes
===========
### Node.js implementation of "ctypes" to interface with C libs
[![Build Status](https://secure.travis-ci.org/TooTallNate/node-ctypes.svg)](https://travis-ci.org/TooTallNate/node-ctypes)

Ctypes for Node.js.


Installation
------------

Install with `npm`:

``` bash
$ npm install ctypes
```


Tests
-----

The tests are written in "`jpm` test style", but are executable both via Node.js
and `node-ctypes` for implementation correctness, as well as directly in Firefox
using its native ctypes implementation.

#### Node.js (`npm`)

To run the tests in Node.js against `node-ctypes`, run:

``` bash
$ npm test
```

#### Firefox (`jpm`)

To run the tests in Firefox against its ctypes implementation, you'll need to
have `jpm` installed and configured, then run:

``` bash
$ jpm test
```


License
-------

(The MIT License)

Copyright (c) 2015 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
