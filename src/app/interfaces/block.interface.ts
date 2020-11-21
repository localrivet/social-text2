export enum DefaultBlockTags {
    P = 'p',
    DIV = 'div',
    UL = 'ul',
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
}

export type BlockTag = string;

export interface BlockJson {
    type?: BlockTag,
    content?: string;
}

export const blockTags: BlockTag[] = [
    DefaultBlockTags.P,
    DefaultBlockTags.DIV,
    DefaultBlockTags.UL,
    DefaultBlockTags.H1,
    DefaultBlockTags.H2,
    DefaultBlockTags.H3,
    DefaultBlockTags.H4,
    DefaultBlockTags.H5,
    DefaultBlockTags.H6,
];

