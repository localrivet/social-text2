export class Block {
    content: string = '';
    fragments: DocumentFragment[] = [];
    triggerEvent: KeyboardEvent;

    /**
     * 
     * @param blockID string
     * @param blockElement HTMLElement
     */
    constructor(public blockID: string, public blockElement: HTMLElement) { }

    /**
     * 
     * @param ev 
     * @returns void
     */
    trigger(ev: KeyboardEvent): void {
        this.triggerEvent = ev;
    }

    /**
     * 
     * @param content 
     * @returns void
     */
    update(content: string) {
        this.content = content;
        this.fragments = [];
        this._contentToFragment();
    }

    /**
     * 
     * @param content 
     * @returns void
     */
    publish(content: string): void {

        // keep the last char if it's punctuation
        let lastCharToReplace: string = '';
        if (/[\s.,;:!?]+/ig.test(this.lastChar())) {
            lastCharToReplace = this.lastChar().replace(/[\s.,;:!?]+/ig, (str, ...args) => {
                if (args[1]) {
                    return args[1];
                }
                return str;
            });
        }

        this._insertTextAtCaret(content + lastCharToReplace);
    }

    /**
     * @returns HTMLElement
     */
    onUpdate(): HTMLElement {
        return this.blockElement;
    }

    /**
     * @returns string
     */
    rawHTML(): string {
        return this.blockElement.innerHTML.replace(`&nbsp;`, ' ').trim();
    }

    /**
     * @returns string
     */
    rawText(): string {
        return this.blockElement.innerText.trim();
    }

    /**
     * 
     * @param html 
     * @returns string
     */
    decodeHtml(html: string): string {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    /**
    * @return string[]
    */
    allWords(): string[] {
        // quiet any errors from the nodeValue being null
        try {
            return this.fragments
                .slice(-1)
                .pop()
                .nodeValue
                .split(/\s/);
        } catch (e: any) {
            return [];
        }
    }

    /**
     * @return string
     */
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

    /**
     * @return strings
     */
    lastChar() {
        return this.blockElement.innerText.slice(-1);
    }

    /**
     * @return strings
     */
    getText() {
        return this.blockElement.innerText;
    }

    /**
     * 
     * @param attributes { [attribute: string]: string }
     * @param element HTMLElement
     * @returns void
     */
    applyAttributes(attributes: { [attribute: string]: string }, element?: HTMLElement): void {
        for (const attribute in attributes) {
            if (element) {
                element.setAttribute(attribute, attributes[attribute]);
            }
            else {
                this.blockElement.setAttribute(attribute, attributes[attribute]);
            }
        }
    }

    /**
     * 
     * @param styles { [style: string]: string }
     * @param element HTMLElement
     * @returns void 
     */
    applyStyes(styles: { [style: string]: string }, element?: HTMLElement): void {
        const styleArr = [];
        for (const style in styles) {
            styleArr.push(`${style}:${styles[style]}`);
        }

        if (element) {
            element.style.cssText = styleArr.join(';');
        } else {
            this.blockElement.style.cssText = styleArr.join(';');
        }
    }

    /**
     * 
     * @param classes string[]
     * @param element HTMLElement
     * @returns void
     */
    applyClasses(classes: string[], element?: HTMLElement): void {
        if (element) {
            element.classList.add(...classes);
        } else {
            this.blockElement.classList.add(...classes);
        }
    }

    /**
     * @returns void
     */
    private _contentToFragment(): void {
        // split the content into fragments
        let el = document.createElement("div");
        el.innerHTML = this.content;
        let frag = document.createDocumentFragment(), node;
        while ((node = el.firstChild)) {
            this.fragments.push(frag.appendChild(node));
        }
    }

    /**
     * 
     * @param html 
     * @returns void
     */
    private _insertTextAtCaret(html: string): void {
        if (window.getSelection) {

            const sel: Selection = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {

                let range: Range = sel.getRangeAt(0);
                range.setEnd(this.blockElement as Node, 0);
                range.deleteContents();

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
                    // enter was pressed
                    let nextFocusBlock: Node;
                    const parentChildren = this.blockElement.parentNode.children;
                    for (let i = 0; i < parentChildren.length; i++) {
                        const childBlockID = (parentChildren[i] as HTMLElement)?.dataset?.block;
                        if (childBlockID == this.blockID) {
                            nextFocusBlock = (parentChildren[i + 1] as Node)
                            break;
                        }
                        // console.log('*** CHILD NODE', (parentChildren[i] as HTMLElement)?.dataset?.block);
                    }

                    // console.log('*** NEXT FOCUS BLOCK', nextFocusBlock);

                    if (nextFocusBlock) {
                        this._clearSelection();
                        const focusNode = nextFocusBlock.firstChild;
                        const range = document.createRange();
                        range.setStart(focusNode, 0);
                        range.setEnd(focusNode, 0);
                        range.deleteContents();
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
        }
    }

    /**
     * @returns void
     */
    private _clearSelection(): void {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        }
    }
}