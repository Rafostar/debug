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
