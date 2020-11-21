import { Observable, Subject } from 'rxjs';

import { Block } from './editor/block';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

export class Api {
    debug: true;
    activeBlock: Subject<Block>;
    block: Block;
    constructor() {
        this.activeBlock = new Subject<Block>();

        this.activeBlock.subscribe(block => {
            this.block = block;
        })
    }

    keyUp(element: HTMLElement): Observable<Event> {
        return fromEvent(element, 'keyup');
    }

    keyDown(element: HTMLElement): Observable<Event> {
        return fromEvent(element, 'keydown');
    }

    onInput(element: HTMLElement): Observable<Event> {
        return fromEvent(element, 'input');
    }

    getActiveBlock(): Observable<Block> {
        return this.activeBlock;
    }
}