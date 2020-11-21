declare const require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (
        paths: string[],
        callback: (require: <T>(path: string) => T) => void
    ) => void;
};


declare function position(el: HTMLElement, pos?: {
    start: number,
    end: number,
    atStart: number
}): {
    start: number,
    end: number,
    atStart: number
};