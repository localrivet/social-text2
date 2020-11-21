/**
 * @todo change this from an enum and make it dynamic
 *       we want this dynamic so we can add new types through and API
 */

export enum BlotTypes {
    Block = 'Block',
    Blockquote = 'Blockquote',
    Bold = 'Bold',
    Break = 'Break',
    Code = 'Code',
    Container = 'Container',
    Embed = 'Embed',
    Header = 'Header',
    Image = 'Image',
    Inline = 'Inline',
    Italic = 'Italic',
    Link = 'Link',
    List = 'List',
    ListItem = 'ListItem',
    Script = 'Script',
    Scroll = 'Scroll',
    Strike = 'Strike',
    Text = 'Text',
    Underline = 'Underline',
    Video = 'Video',

    // custom blot types
    Nouns = 'Nouns',
    Comparator = 'Comparator',
    PastTense = 'PastTense',
    Quoted = 'Quoted',
    Word = 'Word',
    Heading = 'Heading',
    Hashtag = 'Hashtag',
    Mention = 'Mention',
    Note = 'Note',
}
