# debug
[![License](https://img.shields.io/github/license/Rafostar/debug.svg)](https://github.com/Rafostar/debug/blob/master/COPYING)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
[![Donate](https://img.shields.io/badge/Donate-PayPal.Me-lightgrey.svg)](https://www.paypal.me/Rafostar)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Rafostar/debug.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FRafostar%2Fdebug)

A tiny GJS debugging script modeled after Node.js debugging technique.

## Installation
Clone repo into `/usr/share/gjs-1.0/debug` folder.
```shell
git clone https://github.com/Rafostar/debug.git /usr/share/gjs-1.0/debug
```
Alternatively download it to `debug` folder in any other location and export that location path with `GJS_PATH` environment variable.

For colored text [Ink](https://github.com/Rafostar/gjs-ink) module is required.

## Guide
The `Debug.js` script includes single class named `Debugger`.

When creating new object from it, pass the name in form of a string as first argument and optionally an object
containing initial configuration options as second arg.

On startup `DEBUG` environment variable is used to automatically enable debug functions with matching names.
The `*` character may be used as a wildcard.

For more information about available config options visit [wiki](https://github.com/Rafostar/debug/wiki).

## Examples
#### [basic.js](https://raw.githubusercontent.com/Rafostar/debug/master/examples/basic.js)
```shell
DEBUG=* gjs ./examples/basic.js
```
```javascript
const { Debug } = imports.debug;
let { debug } = new Debug.Debugger('myapp');

debug('debug is working!');
```
[<img src="https://raw.githubusercontent.com/Rafostar/debug/media/images/basic.png">](https://raw.githubusercontent.com/Rafostar/debug/media/images/basic.png)

#### [color.js](https://raw.githubusercontent.com/Rafostar/debug/master/examples/color.js)
```shell
DEBUG=* gjs ./examples/color.js
```
```javascript
const { Debug } = imports.debug;
const { Ink } = imports.ink;

let myapp = new Debug.Debugger('myapp', {
    color: Ink.Color.PINK
});
let { debug } = myapp;

debug('name and time are pink!');

myapp.color = Ink.colorFromRGB(0, 206, 209);
debug('color changed to "turquoise"');
```
[<img src="https://raw.githubusercontent.com/Rafostar/debug/media/images/color.png">](https://raw.githubusercontent.com/Rafostar/debug/media/images/color.png)

#### [advanced.js](https://raw.githubusercontent.com/Rafostar/debug/master/examples/advanced.js)
```shell
DEBUG=* gjs ./examples/advanced.js
```
```javascript
const { GLib, Soup } = imports.gi;
const { Debug } = imports.debug;
const { Ink } = imports.ink;

let myApp = new Debug.Debugger('myapp', {
    name_printer: new Ink.Printer({
        font: Ink.Font.BOLD,
        color: Ink.Color.LIGHT_BLUE
    }),
    message_printer: new Ink.Printer({
        color: Ink.Color.GREEN
    }),
    time_printer: new Ink.Printer({
        font: Ink.Font.BLINK,
        color: Ink.Color.LIGHT_RED
    }),
    enabled: true
});

let workerA = new Debug.Debugger('worker:a', {
    name_printer: new Ink.Printer({
        font: Ink.Font.BOLD,
        color: Ink.Color.LIGHT_MAGENTA
    }),
    time_printer: new Ink.Printer({
        font: Ink.Font.UNDERLINE,
        color: Ink.Color.LIGHT_MAGENTA
    })
});

let workerB = new Debug.Debugger('worker:b', {
    name_printer: new Ink.Printer({
        font: Ink.Font.BOLD,
        color: Ink.Color.YELLOW
    }),
    time_printer: new Ink.Printer({
        font: Ink.Font.UNDERLINE,
        color: Ink.Color.YELLOW
    })
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
    'GET', 'https://raw.githubusercontent.com/Rafostar/debug/master/README.md'
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
[<img src="https://raw.githubusercontent.com/Rafostar/debug/media/images/advanced.png">](https://raw.githubusercontent.com/Rafostar/debug/media/images/advanced.png)

## Donation
If you like my work please support it by buying me a cup of coffee :-)

[![PayPal](https://github.com/Rafostar/gnome-shell-extension-cast-to-tv/wiki/images/paypal.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TFVDFD88KQ322)
