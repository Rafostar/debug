const { GLib } = imports.gi;

const DEBUG_ENV = GLib.getenv('DEBUG');
const TERM_ESC = '\x1b[';
const TERM_RESET = '0m';

var TextColor = {
    WHITE: '97m',
    BLACK: '30m',
    RED: '31m',
    GREEN: '32m',
    YELLOW: '33m',
    BLUE: '34m',
    MAGENTA: '35m',
    CYAN: '36m',
    LIGHT_GRAY: '37m',
    DARK_GRAY: '90m',
    LIGHT_RED: '91m',
    LIGHT_GREEN: '92m',
    LIGHT_YELLOW: '93m',
    LIGHT_BLUE: '94m',
    LIGHT_MAGENTA: '95m',
    LIGHT_CYAN: '96m',
    BROWN: '38;5;94m',
    LIGHT_BROWN: '38;5;130m',
    PINK: '38;5;205m',
    LIGHT_PINK: '38;5;211m',
};

var TextFont = {
    REGULAR: 0,
    BOLD: 1,
    DIM: 2,
    ITALIC: 3,
    UNDERLINE: 4,
    BLINK: 5,
    REVERSE: 7,
    HIDDEN: 8,
    STRIKEOUT: 9,
};

var Debugger = class
{
    constructor(name, opts)
    {
        opts = (opts && typeof opts === 'object') ? opts : {};

        this.debug_name = (name && typeof name === 'string') ? name : 'GJS';

        this.enabled       = opts.enabled       || this._enabledAtStart;
        this.name_font     = opts.name_font     || TextFont.BOLD;
        this.name_color    = opts.name_color    || this._getColorFromText(this.debug_name);
        this.message_font  = opts.message_font  || TextFont.REGULAR;
        this.message_color = opts.message_color || null;
        this.time_font     = opts.time_font     || TextFont.REGULAR;
        this.time_color    = opts.time_color    || this.name_color;

        this._lastDebug = Date.now();
    }

    get debug()
    {
        return message => this._debug(message);
    }

    get _enabledAtStart()
    {
        if(!DEBUG_ENV)
		return false;

        let envArr = DEBUG_ENV.split(',');

        return envArr.some(el => {
            if(el === this.debug_name || el === '*')
                return true;

            let searchType;
            let offset = 0;

            if(el.startsWith('*')) {
                searchType = 'ends';
            } else if(el.endsWith('*')) {
                searchType = 'starts';
                offset = 1;
            }

            if(!searchType)
                return false;

            return this.debug_name[searchType + 'With'](
                el.substring(1 - offset, el.length - offset)
            );
        });
    }

    _getColorFromText(text)
    {
        let colorsArr = Object.keys(TextColor);
        let textLength = text.length;
        let total = 0;

        while(textLength--)
            total += Number(text.charCodeAt(textLength).toString(10));

        /* Return color excluding black and white (for visibility) */
        return TextColor[colorsArr[total % (colorsArr.length - 2) + 2]];
    }

    _debug(debug_message)
    {
        if(!this.enabled)
            return;

        switch(typeof debug_message) {
            case 'string':
                break;
            case 'object':
                if(debug_message !== null && debug_message.constructor !== RegExp) {
                    debug_message = JSON.stringify(debug_message, null, 2);
                    break;
                }
            default:
                debug_message = String(debug_message);
                break;
        }

        if(!debug_message.length)
            debug_message = ' ';
        else
            debug_message = ' ' + debug_message + ' ';

        let debug_time = Date.now() - this._lastDebug;

        if(debug_time < 1000)
            debug_time += 'ms';
        else
            debug_time = Math.floor(debug_time / 1000) + 's';

        let str = '';
        for(let param of ['name', 'message', 'time']) {
            str += TERM_ESC;
            str += (
                this[param + '_font'] >= 0
                && this[param + '_color']
            )
                ? this[param + '_font'] + ';' + this[param + '_color']
                : TERM_RESET;

            switch(param) {
                case 'name':
                    str += this.debug_name;
                    break;
                case 'message':
                    str += debug_message;
                    break;
                case 'time':
                    str += '+' + debug_time;
                    break;
            }
        }

        str += TERM_ESC + TERM_RESET;
        printerr(str);

        this._lastDebug = Date.now();
    }
}
