import { PatternMatcher } from "nlcst-pattern-match";
import { EnglishParser } from "nlcst-parse-english";
const englishParser = new EnglishParser();
const patternMatcher = new PatternMatcher({
    parser: englishParser
});

export interface Rule {
    Expression: RegExp;
    Extract: RegExp;
    Compare: RegExp;
    Command: String;
    Source: String;
}

export interface MatchResult {
    Start: number;
    End: number;
    WordStart: number;
    WordEnd: number;
    Command?: FormatMarkupCommands | ContentMarkupCommands;
    Text?: string;
}

export enum FormatMarkupCommands {
    Note = 'Note',
    EnumerationHeadingParagraph = 'EnumerationHeadingParagraph',
    Heading = 'Heading'
}

export enum ContentMarkupCommands {
    UserReferenceUnknown = 'UserReferenceUnknown',
    UserReference = 'UserReference',
    Comparators = 'Comparators',
    Nouns = 'Nouns',
    PastTense = 'PastTense',
    Quoted = 'Quoted',
    Word = 'Word'
}

export class PartsOfSpeechService {

    /**
     * Formatting markup rules.
     */
    private FormatMarkupRules: any = [
        {
            Extract: /(note:)$/i,                               // Paragraph that should be converted into a note.
            Compare: /(note:)$/i,
            Command: FormatMarkupCommands.Note,
            Source: 'Text'
        },
        {
            Extract: /((NNS|NN)[CC (NNS|NN)]*)/,                // Paragraph that should be followed by enumerated list
            Compare: /((NNS|NN)[CC (NNS|NN)]*).*:$/,
            Command: FormatMarkupCommands.EnumerationHeadingParagraph
        },
        {
            // Extract: /^[\w\W]{1,50}$/,                          // Heading contains up to 50 chars, and doesn't end with '.', ':', '?'
            // Compare: /^([\w\W]{1,50})/,
            Extract: /^\s*\S+(?:\s+\S+){1,}\s*[^?.!:]$/i,
            Compare: /(^\s*\S+(?:\s+\S+){1,}\s*[^?.!:]$)/i,
            Command: FormatMarkupCommands.Heading,
            Source: 'Text'
        }
    ];

    /**
     * Content markup rules
     */
    private ContentMarkupRules: any = [
        {
            Expression: /@([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/i,   // User reference with email, ie, "@alma.tuck@dharbor.com"
            Command: ContentMarkupCommands.UserReferenceUnknown,
            Source: 'Text'
        },
        {
            Expression: /@([a-zA-Z0-9_\-\.]+)/i,                // User reference without email, ie, "@alma.tuck"
            Command: ContentMarkupCommands.UserReference,
            Source: 'Text'
        },
        {
            Expression: /((JJR|\bRB|\s))+/g,               // Sequence of comparators, ie, "greater or not equal to"
//            Expression: /((JJR|CC|\bRB|IN|JJ|\s))+/g,       // Sequence of comparators, ie, "greater or not equal to"
            Command: ContentMarkupCommands.Comparators
        },
//        {
//            Expression: /(NNP|\s)*/g,                        // Nouns
//            Command: ContentMarkupCommands.Nouns
//        },
        {
            Expression: /(VBD|\s)*/g,                        // Past Tense
            Command: ContentMarkupCommands.PastTense
        }
    ];

    // Data members of class
    private originalText: string;                     // Original text to match against
    private delimitedText: string
    private posJSON: any;                             // Parts of Speech structure
    private posMetaData: string;                      // Generated POS representation of text
    private posMetaDataDebug: string;                 // Generated POS representation of text with words inline for debugging
    private reverseLookupStructure: number[][];       // Structure to map from POS for words to original words
    private spaceOffsets: number;                     // Offset by number of spaces at beginning of string

    /**
     * PartsOfSpeech constuctor.
     */
    constructor() {
    }

    /**
     * Initialize class data members, including posMetaData, posMetaDataDebug, and reverseLookupStructure.
     */
    public setText(text: string): void {

        if (!text.trim()) {
            return;
        }
        
        // This algorithm doesn't work correctly if the text is preceeded by a space. Determine offset and trim.
        this.originalText = text;                                           // Original text to be parsed
        this.delimitedText = text;                                          // Delimited text to be parsed
        text = text.replace(/\./g, ' ');
        text = text.replace(/\?/g, ' ');
        this.spaceOffsets = 0;
        while (text.length > 0 && text.charAt(0) === ' ') {
            this.spaceOffsets++;
            text = text.substring(1);
            this.delimitedText = this.delimitedText.substring(1);
        }

        // Process text into POS JSON object
        text = text.trim();
        this.posJSON = undefined;
        if (text) {
            const patternStr = 'patternMatcher.tag\`' + text.trim() + '\`';     // Pattern string for constructing JSON Parts of Speech objec
            this.posJSON = eval(patternStr);                                    // Construct JSON Parts of Speech object
        }

        // Set default data member values
        this.posMetaData = '';
        this.posMetaDataDebug = '';
        this.reverseLookupStructure = [];

        // Iterate through posData and build posMetaData string containing POS representation of text ("NN NNS", etc)
        //     and build reverse lookup structure to map regex matches on POS string to original English text
        let wordIndex = 0;
        for (let i = 0, reverseLookupIndex = 0; this.posJSON && i < this.posJSON.length; i++) {

            // Evaluate each sequential POS in posJSON
            let pos = this.posJSON[i];
            switch (pos.type) {
                // Normal text. Note that "Massachussets" converts to "NNS"
                case 'WordNode':
                    let startPOS = this.posMetaData.length;
                    this.posMetaData += pos.data.pos;
                    this.posMetaDataDebug += pos.data.pos;

                    // Create reverse lookup structure to get text from POS
                    this.reverseLookupStructure[reverseLookupIndex++] = [startPOS, pos.position.start.offset, this.posMetaData.length, pos.position.end.offset, wordIndex++];

                    // Add text
                    this.posMetaDataDebug += '(';
                    for (let j = 0; j < pos.children.length; j++) {
                        this.posMetaDataDebug += pos.children[j].value;
                    }
                    this.posMetaDataDebug += ')';
                    break;

                // White space node
                case 'WhiteSpaceNode':
                    this.posMetaData += pos.value;
                    this.posMetaDataDebug += pos.value;
                    break;

                // Punctuation node
                case 'PunctuationNode':
                    this.posMetaData += pos.value;
                    this.posMetaDataDebug += pos.value;
                    break;

                // Symbol node
                case 'SymbolNode':
                    this.posMetaData += pos.value;
                    this.posMetaDataDebug += pos.value;
                    break;

                // Any other unidentified node
                default:
                    console.log('type = ' + pos.type);
                    this.posMetaData += '?';
                    this.posMetaDataDebug += '?';
                    break;
            }
        }
    }

    /**
     * Get all format matches to input string, based on FormatMarkupRules.
     * 
     * @returns:
     *   [
     *      {
     *          Command: 'EnumerationHeadingParagraph',
     *          Text: 'steps',
     *          Start: 9,
     *          End: 14,
     *          WordStart: 3,                           // Note that the first word is offset 0
     *          WordEnd: 3                              // Note that the last word will be the same as the first word if there is 1 word
     *      }
     *   ]
     */
    public getFormatMatches(): MatchResult[] {
        let results: MatchResult[] = [];

        // Iterate through all Format rules, and return element in result array if there is a match and no collision
        for (let i = 0; i < this.FormatMarkupRules.length; i++) {

            // Match format rule against source text
            let match = this.getFormatMatch(this.FormatMarkupRules[i]);

            // Act on match
            if (match) {
                // Resolve collisions with previous searches which have higher priority by their order
                let collision = this.overlapsPreviousRule(match.Start, match.End, results);

                // If no collision, return result
                if (!collision) {
                    // Create array if not yet created
                    if (!results) {
                        results = [];
                    }

                    // Add "Command" to result
                    match.Command = this.FormatMarkupRules[i].Command;
                    results.push(match);
                }
            }
        }

        // Return matches, else undefined
        return results;
    }

    /**
     * Get format match to input string, based on specific FormatMarkupRules.
     * 
     * @param formatRule - Format rule from FormatMarkupRules table
     * 
     * @returns:
     *     {
     *         Command: 'EnumerationHeadingParagraph',
     *         Text: 'steps',
     *         Start: 9,
     *         End: 14,
     *         WordStart: 3,                           // Note that the first word is offset 0
     *         WordEnd: 3                              // Note that the last word will be the same as the first word if there is 1 word
     *     }
     */
    public getFormatMatch(formatRule: Rule): MatchResult {

        let result: MatchResult;

        // Check if Compare regex exists and matches text
        let matchRegEx;
        let useText = formatRule.Source && formatRule.Source === 'Text';
        let source = useText ? this.delimitedText : this.posMetaData;

        // Assure that we have text to check
        if (source && source.trim()) {

            if (formatRule.Compare) {
                matchRegEx = source.match(formatRule.Compare);
            }

            // If match and there is a Compare regex, process result
            if (matchRegEx || !formatRule.Compare) {

                // Determne if extraction regex gives result
                let tag = source.match(formatRule.Extract);
                if (tag) {
                    // Get start and end from trimmed result
                    let start = tag.index;
                    tag[0] = tag[0].trim();
                    let end = start + tag[0].length;

                    // Translate POS string offsets to source string offsets
                    result = this.translatePOSToText(start, end, useText);
                    result.Text = this.delimitedText.substring(result.Start, result.End);
                }
            }
        }

        // Return single match
        return result;
    }

    /**
     * Get all attribute matches to input string, based on ContentMarkupRules.
     * 
     * @returns:
     *   [
     *      {
     *          Command: 'EnumerationHeadingParagraph',
     *          Text: 'steps',
     *          Start: 43,
     *          End: 73,
     *          WordStart: 3,                           // Note that the first word is offset 0
     *          WordEnd: 3                              // Note that the last word will be the same as the first word if there is 1 word
     *      }
     *   ]
     */
    public getMarkupMatches(): MatchResult[] {

        let results: MatchResult[];

        // Iterate through all Content rules, and return element in result array if there is a match and no collision
        for (let index = 0; index < this.ContentMarkupRules.length; index++) {

            // Get markup match
            let markup = this.getMarkupMatch(this.ContentMarkupRules[index]);
            if (markup) {
                for (let i = 0; i < markup.length; i++) {
                    // Add Command to result
                    markup[i].Command = this.ContentMarkupRules[index].Command;

                    // Resolve collisions with previous searches which have higher priority by their order
                    let collision = this.overlapsPreviousRule(markup[i].Start, markup[i].End, results);

                    // If no collision, return result
                    if (!collision) {
                        if (!results) {
                            results = [];
                        }

                        // Add result to results array
                        results.push(markup[i]);
                    }
                }
            }
        }

        // Return results
        return results;
    }

    /**
     * Get format match to input string, based on specific ContentMarkupRules.
     * 
     * @param formatRule - content markup rule from ContentMarkupRules table
     * 
     * @returns:
     *     {
     *         Command: 'EnumerationHeadingParagraph',
     *         Text: 'steps',
     *         Start: 43,
     *         End: 73,
     *         WordStart: 3,                           // Note that the first word is offset 0
     *         WordEnd: 3                              // Note that the last word will be the same as the first word if there is 1 word
     *     }
     */
    public getMarkupMatch(markupRules: Rule): MatchResult[] {

        let results = undefined;

        // Determine source for regex match; original text or POS string
        let useText = markupRules.Source && markupRules.Source === 'Text';
        let source = useText ? this.delimitedText : this.posMetaData;

        // Assure that we have text to check
        if (source && source.trim()) {
                
            // Match Expression regex to text
            let tag = source.match(markupRules.Expression);
            if (tag) {
                // Check each return in case this was a /g (global) search
                let start = tag.index ? tag.index : 0;
                for (let i = 0; i < tag.length; i++) {
                    // Get start and end from trimmed result
                    if (tag[i].trim().length !== 0) {
                        tag[i] = tag[i].trim();
                        start = source.indexOf(tag[i], start);
//                        while (start !== 0 && source.charAt(start - 1) !== ' ') {   // Assure that match is with full word
//                            start = source.indexOf(tag[i], start + tag[i].length);
//                        }
                        if (start !== -1) {
                            let end = start + tag[i].length;

                            // Translate offsets to actual text if source text is POS
                            let position = this.translatePOSToText(start, end, useText);

                            // Build result
                            if (!results) {
                                results = [];
                            }

                            position.Text = this.originalText.substring(position.Start, position.End);
                            results.push(position);
                            start = end;
                        }
                    }
                }
            }
        }

        // Return results
        return results;
    }

    /**
     * Translate Start and End return values from POS string to original text offsets. This only happens if text is compared to POS string.
     * 
     * @param   start - offset to start of target text
     * @param   end - offset to end of target text
     * 
     * @return
     *      {
     *          Start: 10,
     *          End: 14
     *      }
     */
    private translatePOSToText(start: number, end: number, convertOffsets: boolean): MatchResult {

        // Translate start index of POS text to index in text string
        let wordStart = 0;
        let wordEnd = 0;
        let i = 0;
        for (; i < this.reverseLookupStructure.length; i++) {
            if (start === this.reverseLookupStructure[i][!convertOffsets ? 0 : 1]) {
                start = this.reverseLookupStructure[i][1];
                wordStart = this.reverseLookupStructure[i][4];
                break;
            }
        }

        // Continue from index and translate end index of POS text in text string
        for (; i < this.reverseLookupStructure.length; i++) {
            if (end === this.reverseLookupStructure[i][!convertOffsets ? 2 : 3]) {
                end = this.reverseLookupStructure[i][3];
                wordEnd = this.reverseLookupStructure[i][4];
                break;
            }

            // If there isn't an end match, take the length of the string
            if (i === this.reverseLookupStructure.length - 1) {
                end = this.originalText.length;
                wordEnd = this.reverseLookupStructure[this.reverseLookupStructure.length - 1][4];
            }
        }

        // Return result
        return { Start: start + this.spaceOffsets, End: end + this.spaceOffsets, WordStart: wordStart, WordEnd: wordEnd };
    }

    /**
     * Determine if markup finding collides with previous result.
     * 
     * @param   start - offset to start of target text
     * @param   end - offset to end of target text
     * 
     * @result  true if rule overlaps with previous rule
     */
    private overlapsPreviousRule(start: number, end: number, rules: MatchResult[]): boolean {

        let collision = false;

        // Determine if start is in previous finding, end is in previous finding, or start an end surround previous finding
        for (let j = 0; rules && j < rules.length && !collision; j++) {
            if ((start >= rules[j].Start && start <= rules[j].End) ||
                (end >= rules[j].Start && end <= rules[j].End) ||
                (start <= rules[j].Start && end >= rules[j].End)) {
                collision = true;
            }
        }

        // Return result
        return collision;
    }

    /**
     * Convert array of format matches to string.
     */
    public getFormatMatchesToString(formatMatches: MatchResult[]): string {
        let result = '';
        for (let i = 0; formatMatches && i < formatMatches.length; i++) {
            result += 'Command: ' + formatMatches[i].Command + '\n';
            result += 'Text: ' + formatMatches[i].Text + '\n';
            result += 'Char Offsets: (' + formatMatches[i].Start + ', ' + formatMatches[i].End + ')\n';
            result += 'Word Offsets: (' + formatMatches[i].WordStart + ', ' + formatMatches[i].WordEnd + ')\n';
        }

        return result;
    }

    /**
     * Convert array of content matches to string.
     */
    public getMarkupMatchesToString(markupMatches: MatchResult[]): string {
        let result = '';
        for (let i = 0; markupMatches && i < markupMatches.length; i++) {
            result += 'Command: ' + markupMatches[i].Command + '\n';
            result += 'Text: ' + markupMatches[i].Text + '\n';
            result += 'Char Offsets: (' + markupMatches[i].Start + ', ' + markupMatches[i].End + ')\n';
            result += 'Word Offsets: (' + markupMatches[i].WordStart + ', ' + markupMatches[i].WordEnd + ')\n';
        }

        return result;
    }
}