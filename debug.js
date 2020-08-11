const { GLib } = imports.gi;

const DEBUG_ENV = GLib.getenv('DEBUG');
const TERM_ESC = '\x1b[';
const TERM_RESET = '0m';

var TextColor = {
    BLACK: '30m',
    BRIGHT_BLACK: '30;1m',
    RED: '31m',
    BRIGHT_RED: '31;1m',
    GREEN: '32m',
    BRIGHT_GREEN: '32;1m',
    YELLOW: '33m',
    BRIGHT_YELLOW: '33;1m',
    BLUE: '34m',
    BRIGHT_BLUE: '34;1m',
    PURPLE: '35m',
    BRIGHT_PURPLE: '35;1m',
    CYAN: '36m',
    BRIGHT_CYAN: '36;1m',
    WHITE: '37m',
    BRIGHT_WHITE: '37;1m',
};

var TextFont = {
    REGULAR: 0,
    BOLD: 1,
    UNDERLINE: 2,
};

var Debugger = class
{
    constructor(name, opts)
    {
        opts = (opts && typeof opts === 'object') ? opts : {};

        this.debug_name = (name && typeof name === 'string') ? name : 'GJS';

        this.enabled    = opts.enabled    || this._enabledAtStart;
        this.name_font  = opts.name_font  || TextFont.BOLD;
        this.name_color = opts.name_color || this._getDefaultColor(this.debug_name);
        this.text_font  = opts.text_font  || TextFont.REGULAR;
        this.text_color = opts.text_color || null;
        this.time_font  = opts.time_font  || TextFont.REGULAR;
        this.time_color = opts.time_color || this.name_color;

        this._lastDebug = Date.now();
    }

    get debug()
    {
        return text => this._debug(text);
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

    _debug(debug_text)
    {
        if(!debug_text || !this.enabled) return;

        let debug_time = Date.now() - this._lastDebug;

        if(debug_time < 1000)
            debug_time += 'ms';
        else
            debug_time = Math.floor(debug_time / 1000) + 's';

        let str = '';
        for(let param of ['name', 'text', 'time']) {
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
                case 'time':
                    str += '+' + debug_time;
                    break;
                default:
                    str += ' ' + debug_text + ' ';
                    break;
            }
        }

        str += TERM_ESC + TERM_RESET;
        printerr(str);

        this._lastDebug = Date.now();
    }

    _getDefaultColor(text)
    {
        let colorsArr = Object.keys(TextColor);
        let textLength = text.length;
        let total = 0;

        while(textLength--)
            total += Number(text.charCodeAt(textLength).toString(10));

        /* Return color excluding black and white (for visibility) */
        return TextColor[colorsArr[total % (colorsArr.length - 4) + 2]];
    }
}
