# Social Text V2

Social Text is a framework to automatically update ```contenteditable``` ```HTMLElements``` as  you type based on predefined rules. Each rule is defined in a plugin. 


## Usage

```sh
# Clone
$ git clone git@github.com:localrivet/social-text2.git

# Install NPM Packages
$ npm i

# Startup Dev
$ npm run dev

# Build Production
$ npm build production
```

## Creating Plugins

All plugins are pure functions.
A pure function is a function which:
- Given the same input, will always return the same output.
- Produces no side effects.
- [learn more](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976)


#### Pro-Tip: 
Notice the ```format``` function in the ```LinkPluginProperties``` interface returns a ```Promise<string>```. Asynchronous callbacks are required to allow remote ```fetch``` calls.

### TypeScript Example
```ts

import { Api } from "../../api";
import { PluginProperties } from '../../interfaces/social-plugin.interface';

export interface LinkPluginProperties extends PluginProperties {
    transform?(url: string, hasSchema: boolean): string;
    format?(url: string, noSchemaUrl): Promise<string>;
}

export const LinkPlugin = (api: Api, props?: LinkPluginProperties) => {

    // setup
    const block = api.block;
    const lastWord = block.lastWord();
    const lastChar = block.lastChar();
    const rawHTML = block.rawHTML();

    // only do this if we have a props.format function
    if (lastWord && props && !!props.format) {
        const matches = /([A-Za-z]{3,9}:(?:\/\/)?){0,}(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/.exec(lastWord)
        if (matches && matches.length > 0) {

            console.log(matches);

            // if matches[3] is not empty it has http[s] otherwise it's missing
            const hasSchema = matches[1] ? true : false;
            const transformedUrl = !!props.transform ? props.transform(matches[0], hasSchema) : matches[0];
            const noSchemaUrl = transformedUrl.replace(/^http[s]{0,1}:\/\//, '');
            
            props.format(transformedUrl, noSchemaUrl).then(url => {
                // send back to the editor
                block.publish(
                    rawHTML.slice(0, rawHTML.lastIndexOf(lastWord)) + url
                );
            });
        }
    }
};

```


## Extending Plugins
### TypeScript Example
```ts
/** HashTag Plugin **/
extend<HashTagPluginProperties>('hashtag', {
    format: (hashTag: string) => {
        return `<a href="https://twitter.com/hashtag/${hashTag}" contenteditable="false" target="_blank">#${hashTag}</a>`;
    }
});

/** Link Plugin **/
extend<LinkPluginProperties>('link', {
    transform: (url: string, hasSchema: boolean) => {
        return hasSchema ? url : 'https://' + url;
    },
    format: (url: string, noSchemaUrl: string) => {
        return `<a href="${url}" contenteditable="false" target="_blank">${noSchemaUrl}</a>`;
    }
});

/** Header Plugin **/
extend<HeaderPluginProperties>('header', {
    tag: 'h1',
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
```

### JavaScript Example
```js
/** HashTag Plugin **/
extend('hashtag', {
    format: (hashTag) => {
        return `<a href="https://twitter.com/hashtag/${hashTag}" contenteditable="false" target="_blank">#${hashTag}</a>`;
    }
});

/** Link Plugin **/
extend('link', {
    transform: (url, hasSchema) => {
        return hasSchema ? url : 'https://' + url;
    },
    format: (url, noSchemaUrl) => {
        return `<a href="${url}" contenteditable="false" target="_blank">${noSchemaUrl}</a>`;
    }
});

/** Header Plugin **/
extend('header', {
    tag: 'h1',
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

```

## Using Remote Data

```ts
/** Setup your lookup function or class **/
const lookupUrl = async (url: string) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
    return await response.json();
}

/** Extend the plugin and use the format callback **/
extend<LinkPluginProperties>('link', {
    transform: (url: string, hasSchema: boolean) => {
        return hasSchema ? url : 'https://' + url;
    },
    format: async (url: string, noSchemaUrl: string) => {
        const response = await lookupUrl(noSchemaUrl) as any;
        return `<a href="${url}" contenteditable="false" target="_blank">${response['title']}</a>`;
    }
});

```