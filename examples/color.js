const { Debug } = imports.debug;
const { Ink } = imports.ink;

let myapp = new Debug.Debugger('myapp', {
    color: Ink.Color.PINK,
    high_precision: true
});
let { debug } = myapp;

debug('name and time are pink!');

myapp.color = Ink.colorFromRGB(0, 206, 209);
debug('color changed to "turquoise"');
