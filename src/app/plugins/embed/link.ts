import { Api } from "../../api";
import { PluginProperties } from '../../interfaces/social-plugin.interface';

export interface LinkPluginProperties extends PluginProperties {
    transform?(url: string, hasSchema: boolean): string;
    format?(url: string, noSchemaUrl): string;
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
            const url = props.format(transformedUrl, noSchemaUrl);

            // send back to the editor
            block.publish(
                rawHTML.slice(0, rawHTML.lastIndexOf(lastWord)) + url 
            );
        }
    }
};