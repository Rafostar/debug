const { Debug } = imports.debug;
const { Ink } = imports.ink;

let myapp = new Debug.Debugger('myapp', {
    color: Ink.Color.PINK
});
let { debug } = myapp;

debug('debug name and time are pink!');

myapp.color = Ink.colorFromRGB(0, 128, 128);
debug('debug color changed to "teal"');
