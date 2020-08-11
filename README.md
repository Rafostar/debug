# gjs-debug
[![License](https://img.shields.io/github/license/Rafostar/gjs-debug.svg)](https://github.com/Rafostar/gjs-debug/blob/master/COPYING)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
[![Donate](https://img.shields.io/badge/Donate-PayPal.Me-lightgrey.svg)](https://www.paypal.me/Rafostar)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Rafostar/gjs-debug.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FRafostar%2Fgjs-debug)

A tiny GJS debugging script modeled after Node.js debugging technique.

## Installation
Just copy `debug.js` to `/usr/share/gjs-1.0` folder.
Alternatively download it to any other folder and export that folder path with `GJS_PATH` environment variable.

## Guide
The `debug.js` script includes single class named `Debugger`.

When creating new object from it, pass the name in form of a string as first argument and optionally an object
containing initial configuration options as second arg.

On startup `DEBUG` environment variable is used to automatically enable debug functions with matching names.
The `*` character may be used as a wildcard.

For more information about available config options visit [wiki](https://github.com/Rafostar/gjs-debug/wiki).

## Examples
#### [simple.js](https://raw.githubusercontent.com/Rafostar/gjs-debug/master/examples/simple.js)
```shell
DEBUG=* gjs ./simple.js
```
```javascript
const { Debugger } = imports.debug;
let { debug } = new Debugger('myapp');

debug('debug is working!');
```
[<img src="https://raw.githubusercontent.com/Rafostar/gjs-debug/master/images/simple.png">](https://raw.githubusercontent.com/Rafostar/gjs-debug/master/images/simple.png)

#### [advanced.js](https://raw.githubusercontent.com/Rafostar/gjs-debug/master/examples/advanced.js)
```shell
DEBUG=* gjs ./advanced.js
```
```javascript
const { GLib, Soup } = imports.gi;
const Debug = imports.debug;

const { Debugger } = Debug;

let myApp = new Debugger('myapp', {
    name_color: Debug.TextColor.LIGHT_BLUE,
    message_color: Debug.TextColor.GREEN,
    time_color: Debug.TextColor.LIGHT_RED,
    time_font: Debug.TextFont.BLINK
});

let workerA = new Debugger('worker:a', {
    name_color: Debug.TextColor.LIGHT_MAGENTA,
    time_font: Debug.TextFont.UNDERLINE
});

let workerB = new Debugger('worker:b', {
    name_color: Debug.TextColor.YELLOW,
    time_font: Debug.TextFont.UNDERLINE
});

function onChunkDownload(message, chunk)
{
    workerB.debug(`downloaded data chunk length: ${chunk.length}`);
}

myApp.debug('executing code');
let loop = GLib.MainLoop.new(null, false);
workerA.debug('created GLib loop');

let session = new Soup.Session();
workerA.debug('created new soup session');

let message = Soup.Message.new(
    'GET', 'https://raw.githubusercontent.com/Rafostar/gjs-debug/master/README.md'
);
workerA.debug('created new soup message');
message.connect('got_chunk', onChunkDownload.bind(this));

workerB.debug('starting data download');
session.queue_message(message, () => {
    workerB.debug('data download complete');
    workerB.debug(`response code: ${message.status_code}`);

    loop.quit();
    workerA.debug('stopped loop');
});

workerA.debug('starting loop');
loop.run();

myApp.debug('code finished');
```
[<img src="https://raw.githubusercontent.com/Rafostar/gjs-debug/master/images/advanced.png">](https://raw.githubusercontent.com/Rafostar/gjs-debug/master/images/advanced.png)

## Donation
If you like my work please support it by buying me a cup of coffee :-)

[![PayPal](https://github.com/Rafostar/gnome-shell-extension-cast-to-tv/wiki/images/paypal.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
