import { Block } from './editor/block';
export class Api {
    block: Block;
    activeBlockSubject: Subject<Block>;

    constructor() {
        this.activeBlockSubject = new Subject<Block>();

        this.activeBlockSubject.subscribe((block: Block) => {
            this.block = block;
        });
    }
}

// subject class for the api block
class Subject<T> {
    private observers = [];

    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    next(value: T) {
        this.observers.forEach(fn => fn(value));
    }
}
