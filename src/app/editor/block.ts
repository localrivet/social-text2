import { PluginCallback, PluginProperties } from "../interfaces/social-plugin.interface";

import { Api } from "../api";
import { BlockJson } from "../interfaces/block.interface";

type exec<PluginCallback> = (api: Api, props: PluginProperties) => {};

export class Block {
    blockJson: BlockJson = {};
    config = {
        childList: true,
        attributes: true,
        characterData: true
    };
    content: string = '';
    fragments: DocumentFragment[] = [];
    triggerEvent: KeyboardEvent;

    constructor(public blockID: string, public blockElement: HTMLElement) { }

    trigger(ev: KeyboardEvent) {
        this.triggerEvent = ev;
    }

    update(content: string) {
        this.content = content;
        this.fragments = [];
        this._contentToFragment();
    }

    publish(content: string) {
        this._insertTextAtCaret(content);
    }

    onUpdate() {
        return this.blockElement;
    }

    rawHTML() {
        return this.blockElement.innerHTML.replace(`&nbsp;`, ' ').trim();
    }

    decodeHtml(html: string) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    lastWord(): string {
        // quiet any errors from the nodeValue being null
        try {
            return this.fragments
                .slice(-1)
                .pop()
                .nodeValue
                .split(/\s/)
                .pop();
        } catch (e: any) {
            return '';
        }
    }

    lastChar() {
        return this.blockElement.innerText.slice(-1);
    }

    getText() {
        return this.blockElement.innerText;
    }

    private _contentToFragment() {
        // split the content into fragments
        let el = document.createElement("div");
        el.innerHTML = this.content;
        let frag = document.createDocumentFragment(), node;
        while ((node = el.firstChild)) {
            this.fragments.push(frag.appendChild(node));
        }
    }

    private _insertTextAtCaret(html: string) {
        if (window.getSelection) {
            // IE9 and non-IE
            let sel: Selection = window.getSelection();
            let range: Range;
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.setEnd(this.blockElement as Node, 0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                let el = document.createElement('div');
                el.innerHTML = html;
                let frag = document.createDocumentFragment();
                let node: ChildNode;
                let lastNode: ChildNode;

                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }

                // clear the innerHTML before adding the new fragment
                this.blockElement.innerHTML = '';

                range.insertNode(frag);

                // Preserve the selection
                if (this.triggerEvent.key !== 'Enter') {
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else {
                        console.log('NO LAST NODE');
                    }
                } else {
                    console.log('ENTER PRESSED');
                    let nextFocusBlock: Node;
                    const parentChildren = this.blockElement.parentNode.children;
                    for (let i = 0; i < parentChildren.length; i++) {
                        const childBlockID = (parentChildren[i] as HTMLElement)?.dataset?.block;
                        if (childBlockID == this.blockID) {
                            nextFocusBlock = (parentChildren[i + 1] as Node)
                            break;
                        }
                        console.log('*** CHILD NODE', (parentChildren[i] as HTMLElement)?.dataset?.block);
                    }

                    console.log('*** NEXT FOCUS BLOCK', nextFocusBlock);


                    if (nextFocusBlock) {
                        this._clearSelection();
                        const focusNode = nextFocusBlock.firstChild;
                        const range = document.createRange();
                        range.setStart(focusNode, 0);
                        range.setEnd(focusNode, 0);
                        range.deleteContents();
                        console.log(range);
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
        }
    }

    private _clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        }
    }
}

 // const lang = {
        //     js: {
        //       equa: /(\b=\b)/g,
        //       quot: /(`|'|"|&#39;|&#34;)/g,
        //       comm: /((\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*))/g,
        //       logi: /(%=|%|\-|\+|\*|&amp;{1,2}|\|{1,2}|&lt;=|&gt;=|&lt;|&gt;|!={1,2}|={2,3})/g,
        //       numb: /(\d+(\.\d+)?(e\d+)?)/g,
        //       func: /(?<=^|\s*)(async|console|alert|Math|Object|Array|String|class(?!\s*\=)|function|(?<=\.)\D\w*)(?=\b)/g,
        //       decl: /(?<=^|\s*)(var|let|const)/g, // Declarations
        //       pare: /(\(|\))/g,
        //       squa: /(\[|\])/g,
        //       curl: /(\{|\})/g,
        //     },
        //     // Props order matters! Here I rely on "tags:"
        //     // being already applied in the previous iteration
        //     html: {
        //       tags: /(?<=&lt;(?:\/)?)(\w+)(?=\s|\&gt;)/g,
        //       angl: /(&lt;\/?|&gt;)/g,
        //       attr: /((?<=<i class=html_tags>\w+<\/i>)[^<]+)/g,
        //     }
        //   };

        //   const highLite = (el:HTMLElement) => {
        //       console.log(el.innerHTML);
        //     // const dataLang = 'js'; // Detect "js", "html", "py", "bash", ...
        //     // const langObj = lang[dataLang]; // Extract object from lang regexes dictionary
        //     // let html = el.innerHTML;
        //     // Object.keys(langObj).forEach(function(key) {
        //     //   html = html.replace(langObj[key], `<i class=${dataLang}_${key}>$1</i>`);
        //     // });
        //     // el.previousElementSibling.innerHTML = html; // Finally, show highlights!
        //   };



        // // // editor.contentEditable = 'true';
        // // editor.spellcheck = false;
        // // // editor.autocorrect = "off";
        // // editor.autocapitalize = "off";
        // // editor.addEventListener("input", highLite.bind(null, editor));
        // // editor.addEventListener("input", highLite.bind(null, editor));
        // // highLite(editor); // Init!


/**
 * setBlockEvents() {

        const observer = new MutationObserver((mutationsList) => {
            console.log(mutationsList);
            // // Use traditional 'for loops' for IE 11
            // for (const mutation of mutationsList) {
            //     if (mutation.type === 'childList') {
            //         console.log('A child node has been added or removed.');
            //     }
            //     else if (mutation.type === 'attributes') {
            //         console.log('The ' + mutation.attributeName + ' attribute was modified.');
            //     } else if (mutation.type === 'characterData') {
            //         console.log(mutationsList);
            //     }
            // }
        });

        const targetNode = document.querySelector(`[data-block="${this.id}"]`);
        observer.observe(targetNode, this.config);

        console.log(targetNode);

        // const keyEvent = fromEvent(this.blockElement, 'keydown');
        // this.blockElement.addEventListener('keydown', (event) => {
        //     console.log('key pressed');
        // });

        // keyEvent.subscribe(() => {
        //     console.log('key pressed');
        // });

        // console.log('setting events', this.blockElement);
        fromEvent(this.blockElement, 'keydown').subscribe((event: KeyboardEvent) => {

            // this.manageBlock(event, element, blockJson);

            this.blockJson = {
                type: this.blockElement.tagName,
                content: this.blockElement.innerHTML
            };

            console.log(this.blockJson);
        });
    }
 */