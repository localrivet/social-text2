import { App } from './app/app';
import { HashTagPluginProperties } from './app/plugins/embed/hashtag';
import { HeaderPluginProperties } from './app/plugins/inline/header';
import { HeaderTagSize } from './app/enums/header-tag-size.enum';
import { LinkPluginProperties } from './app/plugins/embed/link';
import { PluginCallback } from './app/interfaces/social-plugin.interface';

const app = new App();

export const register = (pluginName: string, trigger: RegExp, callback: PluginCallback) => {
    app.register(pluginName, {
        trigger,
        exec: callback
    });
}

export const extend = <T>(pluginName: string, props?: T) => {
    app.extend(pluginName, props);
}

extend<HashTagPluginProperties>('hashtag', {
    format: (hashTag: string) => {
        return `<a href="https://twitter.com/hashtag/${hashTag}" contenteditable="false" target="_blank">#${hashTag}</a>`;
    }
});

extend<LinkPluginProperties>('link', {
    transform: (url: string, hasSchema: boolean) => {
        return hasSchema ? url : 'https://' + url;
    },
    format: (url: string, noSchemaUrl: string) => {
        return `<a href="${url}" contenteditable="false" target="_blank">${noSchemaUrl}</a>`;
    }
});

extend<HeaderPluginProperties>('header', {
    tag: HeaderTagSize.H1,
    minWords: 4,
    styles: {
        'color': 'blue',
        'border-bottom': '3px solid red'
    },
    classes: [
        'header-style',
        'bolder-please'
    ]
});