import { Api } from "../../api";
import { Block } from "../../editor/block";
import { PluginProperties } from '../../interfaces/social-plugin.interface';

export interface HashTagPluginProperties extends PluginProperties {
    format(hashTag: string): string;
}

export const HashTagPlugin = (api: Api, props?: HashTagPluginProperties) => {

    // setup
    const block = api.block;
    const lastWord = block.lastWord();
    const lastChar = block.lastChar();
    const rawHTML = block.rawHTML();

    // do we have any properties?
    if (lastWord && /(?:^|\s)#[^\s.,;:!?]+/i.test(lastWord)) {
        // replace the hash
        let link = lastWord.replace(/#([^\s.,;:!?]+)/ig, (str, ...args) => {
            const hashTag = block.decodeHtml((args[0] || '')).trim();
            console.log('*** FOUND HASHTAG', hashTag)
            if (hashTag) {
                if (!!props) {
                    return props.format(hashTag);
                } else {
                    return `<a href="https://twitter.com/hashtag/${hashTag}" contenteditable="false" target="_blank">#${hashTag}</a>`;
                }
            }
            return str;
        });

        const el = document.createElement('div');
        el.innerHTML = link;
        api.block.applyAttributes(props.attributes, el);
        api.block.applyStyes(props.styles, el);
        api.block.applyClasses(props.classes, el);

        link = el.innerHTML;
        el.remove();

        // send back to the editor
        block.publish(
            rawHTML.slice(0, rawHTML.lastIndexOf(lastWord)) + link
        );
    }
};