import { Api } from "../../api";
import { HeaderTagSize } from "../../enums/header-tag-size.enum";
import { PluginProperties } from '../../interfaces/social-plugin.interface';

export interface HeaderPluginProperties extends PluginProperties {
  tag?: HeaderTagSize;
  minLength?: number;
  minWords?: number;
  format?(header: string): Promise<string>;
}

export const HeaderPlugin = (api: Api, props?: HeaderPluginProperties) => {

  // setup
  const block = api.block;

  console.log({
    minLength: block.rawText().length >= (props && props.minLength || 5),
    minWords: block.allWords().length >= (props && props.minWords || 3)
  });
  if (props) {

    if (block.rawText().length >= (props && props.minLength || 5) && block.allWords().length >= (props && props.minWords || 3)) {

      const hasPunctuation = '.?!,;:()[]'.split('').some(char => block.rawText().indexOf(char) !== -1);
      if (hasPunctuation === false) {

        const el = document.createElement('h1');
        if (props && !!props.format) {
          props.format(block.rawHTML()).then(html => {
            el.innerHTML = html;
            updateHeaderBlock(el, api, props);
          });
        } else {
          el.innerHTML = block.rawHTML();
          updateHeaderBlock(el, api, props);
        }
      }
    }
  }
};

/**
 * 
 * @param el 
 * @param api 
 * @param props 
 * @returns void
 */
const updateHeaderBlock = (el: HTMLElement, api: Api, props?: HeaderPluginProperties): void => {

  // replace the blockID
  el.dataset.block = api.block.blockElement.dataset.block;

  // replace the parent node with this one
  api.block.blockElement.parentNode.replaceChild(el, api.block.blockElement);

  // remove the element
  api.block.blockElement.remove();

  // make sure the api knows the change occurred
  api.block.blockElement = el;

  if (props) {
    api.block.applyAttributes(props.attributes);
    api.block.applyStyes(props.styles);
    api.block.applyClasses(props.classes);
  }
}