// import { Delta } from 'quill';
// import { htmlToText } from '../../helpers/string.helper';
// import { FormatMarkupCommands, MatchResult, PartsOfSpeechService } from '../services/parts-of-speech.service';
// import { EnumerationHeadingParagraph } from './delta-formats/enumeration-heading-paragraph';
// import { Heading } from './delta-formats/heading';
// import { Note } from './delta-formats/note';
// import { NLP, NLPBase } from './nlp-base';

// export class NLPFormat extends NLPBase implements NLP {

//     getNLPMatches(): MatchResult[] {
//         // do an NLP look up
//         const partsOfSpeech = new PartsOfSpeechService();

//         // set the text to a sanitized html to text string.
//         partsOfSpeech.setText(htmlToText(this._text));

//         // loop on the Format Matches and apply the correct tags
//         const formatMatches = partsOfSpeech.getFormatMatches();

//         return formatMatches;
//     }

//     /**
//      * Process the delta formats on every matching format
//      */
//     process(): Delta {
//         // loop through each format and get the ops associated
//         // if no matches the returned delta is empty
//         (this.getNLPMatches() || []).forEach(formatMatch => {
//             // console.log('CURRENT COMMAND:', formatMatch.Command);

//             // check for the formats in the following order
//             // 1. Note
//             // 2. EnumerationHeadingParagraph
//             // 3. Heading

//             switch (formatMatch.Command) {
//                 case FormatMarkupCommands.Note:
//                     this._delta = (new Note(this._delta, this._text, this._parentLeafType))
//                         .getFormatDelta();
//                     break;

//                 case FormatMarkupCommands.EnumerationHeadingParagraph:
//                     this._delta = (new EnumerationHeadingParagraph(this._delta, this._text, this._parentLeafType))
//                         .getFormatDelta();
//                     break;

//                 case FormatMarkupCommands.Heading:
//                     this._delta = (new Heading(this._delta, this._text, this._parentLeafType))
//                         .getFormatDelta();
//                     break;
//             }
//         });

//         return this._delta;
//     }
// }