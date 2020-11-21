import * as _ from "lodash"

// var config = require('./config');

const urlRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

interface Config {
    instances: [];
    debug: boolean;
}

const config: Config = {
    instances: [],
    debug: true
}

export class Utils {

    static log() {
        if (!_.isUndefined(console) && config.debug) {
            console.log.apply(console, arguments);
        }
    }

    static isURI(string) {
        return (urlRegex.test(string));
    }

    static titleize(str) {
        if (str === null) {
            return '';
        }
        str = String(str).toLowerCase();
        return str.replace(/(?:^|\s|-)\S/g, function (c) { return c.toUpperCase(); });
    }

    static classify(str) {
        return this.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    }

    static capitalize(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }

    static flatten(obj) {
        var x = {};
        (Array.isArray(obj) ? obj : Object.keys(obj)).forEach(function (i) {
            x[i] = true;
        });
        return x;
    }

    static underscored(str) {
        return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
            .replace(/[-\s]+/g, '_').toLowerCase();
    }

    static reverse(str) {
        return str.split("").reverse().join("");
    }

    static toSlug(str) {
        return str
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    static leftTrim(str) {
        return str.replace(/^\s+/, '');
    }

    static encodedStr(rawStr) {
        return rawStr.replace(/[\u00A0-\u9999<>\&]/g, (i: string) => {
            return '&#' + i.charCodeAt(0) + ';';
        });
    }
}
