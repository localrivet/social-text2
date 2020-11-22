import { BlockTag, blockTags } from '../interfaces/block.interface';

import { Api } from '../api';
import { Block } from './block';
import { DefaultBlockTags } from './../interfaces/block.interface';
import { SocialPlugin } from '../interfaces/social-plugin.interface';

export class EditorManager {
    private _blocks: { [id: string]: Block } = {};
    private _plugins: { [id: string]: SocialPlugin } = {};
    private _activeBlock: Block;

    constructor(public api: Api) {
        this._getAllContentEditable().forEach(editor => {
            this._initBlocks(editor);
            this._setEditorEvents(editor);
        });

        // this.api.activeBlock.subscribe(block => this._activeBlock = block);
    }

    setPlugins(plugins: { [id: string]: SocialPlugin }) {
        this._plugins = plugins;
    }

    private _getAllContentEditable(): NodeListOf<HTMLElement> {
        return document.querySelectorAll('[contenteditable]');
    }

    private _initBlocks(editor: HTMLElement): void {
        this._findBlocks(editor, blockTags).forEach((blockElement: HTMLElement) => {
            // does this block already have a blockID?
            let blockID: string = this._getBlockID(blockElement) || this._setBlockID(blockElement);
            this._blocks[blockID] = new Block(blockID, blockElement);
        });
    }

    private _processTriggers(ev: KeyboardEvent) {
        // console.log('*** HAS ACTIVE BLOCK', this._activeBlock);
        if (this._activeBlock) {
            for (const pluginName in this._plugins) {
                // console.log('*** CHECKING TRIGGER FOR: ', pluginName);
                if (this._plugins[pluginName]) {
                    const regex: RegExp = this._plugins[pluginName].trigger;
                    // console.log('*** FOUND TRIGGER:', regex);

                    const evalChar = this._activeBlock.blockElement.innerText.slice(-1);
                    // console.log('*** LAST_CHAR', evalChar, regex.test(evalChar));
                    if (regex.test(evalChar) || ev.key === 'Enter') {
                        // console.log('*** LAST_CHAR', evalChar, regex.test(evalChar));
                        this._activeBlock.trigger(ev);
                        this._plugins[pluginName].exec(this.api, this._plugins[pluginName].properties, ev);
                    }
                }
            }
        }
    }

    private _setEditorEvents(editor: HTMLElement) {
        editor.addEventListener('keyup', (ev: KeyboardEvent) => {

            // keyUp(editor).subscribe((ev: KeyboardEvent) => {

            // process the triggers first
            if (this._activeBlock) {
                // pass this by value
                this._processTriggers(ev);
            }

            // this needs to be done on a separate cycle
            if (ev.key === 'Enter' && !ev.shiftKey) {
                let node = this._getSelectionStart() as HTMLElement;
                const parentBlock = this._getParentBlock(node);
                if (parentBlock && parentBlock.tagName.toLowerCase() === DefaultBlockTags.UL) {
                    // console.log('*** HAS Parent tagName of: ', parentBlock.tagName);
                    return;
                }

                // if it's not a known block tag
                const nodeTagName = node.tagName.toLowerCase();
                if (blockTags.filter(value => value == nodeTagName).length === 0) {
                    // use the parent block instead
                    node = parentBlock;
                }

                // remove the data-block attribute because it copies the prior block's attribute
                const newBlockID = this._generateNewBlockID();
                node.dataset.block = newBlockID;
                this._blocks[newBlockID] = new Block(newBlockID, node);
                this._activeBlock = this._blocks[newBlockID];
                this.api.activeBlockSubject.next(this._blocks[newBlockID]);
                return;
            }
            else if (ev.key !== 'Enter' && !ev.shiftKey) {
                const node = this._getSelectionStart() as HTMLElement;

                let blockElement = node;
                let blockID = node.dataset.block;
                if (!blockID) {
                    blockElement = this._getParentBlock(node);
                    blockID = blockElement.dataset.block;
                }

                if (this._blocks[blockID]) {
                    this._blocks[blockID].update(blockElement.innerHTML);
                    if (!this._activeBlock || this._activeBlock.blockID != blockID) {
                        // console.log('block switched');
                        this._activeBlock = this._blocks[blockID];
                        this.api.activeBlockSubject.next(this._blocks[blockID]);
                    }
                }
            }
            // });

        });
    }

    private _getParentBlock(node: Node): HTMLElement {
        return (node as HTMLElement).closest("[data-block]") as HTMLElement;
    }

    private _getSelectionStart(): Node {
        const node = document.getSelection().anchorNode;
        return (node.nodeType == 3 ? node.parentNode : node);
    }

    private _getBlockID(blockElement: HTMLElement): string {
        return blockElement.dataset.block;
    }

    private _setBlockID(blockElement: HTMLElement): string {
        const blockID = this._generateNewBlockID();
        blockElement.setAttribute('data-block', blockID);
        return blockID;
    }

    private _generateNewBlockID(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private _findBlocks(element: HTMLElement, blockTags: BlockTag[]): NodeListOf<Element> {
        return element.querySelectorAll(blockTags.join(','));
    }


    // manageBlock(ev: KeyboardEvent, element: HTMLElement, blockJson: BlockJson) {
    //     blockJson.content = element.innerHTML;

    //     if (ev.key === "Enter" && !ev.shiftKey) { // enter pressed
    //         ev.preventDefault();

    //         console.log(element);
    //     } else {

    //     }


    //     // if (ev.key === "Enter" && !ev.shiftKey) { // enter pressed
    //     //     ev.preventDefault();

    //     //     console.log(element);

    //     // const scribe = {
    //     //     el: element
    //     // };




    //     // console.log('**** isAtEnd', isAtEnd(scribe));

    //     // if (isAtEnd(scribe)) {

    //     //     // Remove any bad characters after current selection.
    //     //     // selectToEnd(scribe).extractContents();
    //     //     // block.mediator.trigger("block:create", 'Text', null, block.el, { autoFocus: true });
    //     // } else {
    //     //     // createBlocksFromParagraphs(block, scribe);
    //     // }

    //     // If the block is left empty then we need to reset the placeholder content.
    //     // if (scribe.allowsBlockElements() && scribe.getTextContent() === '') {
    //     // scribe.setContent('<p><br></p>');
    //     // }
    // }
    // // else if (["Left", "ArrowLeft", "Up", "ArrowUp"].indexOf(ev.key) > -1) {
    // //     if (ev.shiftKey && isSelectedFromStart(scribe)) {
    // //         ev.preventDefault();
    // //         ev.stopPropagation();

    // //         document.activeElement && document.activeElement.blur();
    // //         block.mediator.trigger("selection:block", block);
    // //     } else if (isAtStart(scribe)) {
    // //         ev.preventDefault();
    // //         ev.stopPropagation();

    // //         block.mediator.trigger("block:focusPrevious", block.blockID);
    // //     }
    // // } else if (ev.keyCode === 8 && isAtStart(scribe)) {
    // //     ev.preventDefault();

    // //     isAtStartBoolean = true;
    // // } else if (["Right", "ArrowRight", "Down", "ArrowDown"].indexOf(ev.key) > -1) {
    // //     if (ev.shiftKey && isSelectedToEnd(scribe)) {
    // //         ev.preventDefault();
    // //         ev.stopPropagation();

    // //         document.activeElement && document.activeElement.blur();
    // //         block.mediator.trigger("selection:block", block);
    // //     } else if (isAtEnd(scribe)) {
    // //         ev.preventDefault();

    // //         block.mediator.trigger("block:focusNext", block.blockID);
    // //     }
    // // }
}