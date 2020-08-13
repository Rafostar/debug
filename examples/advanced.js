const { GLib, Soup } = imports.gi;
const { Debug } = imports.debug;
const { Ink } = imports.ink;

let myApp = new Debug.Debugger('myapp', {
    name_printer: new Ink.Printer({
        font: Ink.TextFont.BOLD,
        color: Ink.TextColor.LIGHT_BLUE
    }),
    message_printer: new Ink.Printer({
        color: Ink.TextColor.GREEN
    }),
    time_printer: new Ink.Printer({
        font: Ink.TextFont.BLINK,
        color: Ink.TextColor.LIGHT_RED
    }),
    enabled: true
});

let workerA = new Debug.Debugger('worker:a', {
    name_printer: new Ink.Printer({
        font: Ink.TextFont.BOLD,
        color: Ink.TextColor.LIGHT_MAGENTA
    }),
    time_printer: new Ink.Printer({
        font: Ink.TextFont.UNDERLINE,
        color: Ink.TextColor.LIGHT_MAGENTA
    })
});

let workerB = new Debug.Debugger('worker:b', {
    name_printer: new Ink.Printer({
        font: Ink.TextFont.BOLD,
        color: Ink.TextColor.YELLOW
    }),
    time_printer: new Ink.Printer({
        font: Ink.TextFont.UNDERLINE,
        color: Ink.TextColor.YELLOW
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
