// import {Delta} from 'quill';
// import {NLP, NLPBase} from './nlp-base';
// import {ContentMarkupCommands, MatchResult, PartsOfSpeechService} from '../services/parts-of-speech.service';
// import {htmlToText} from '../../helpers/string.helper';
// import {Noun} from './delta-content/noun';
// import {Comparator} from './delta-content/comparator';
// import {PastTense} from './delta-content/past-tense';

// export class NLPContent extends NLPBase implements NLP {

//     //    callbackServices: CallbackServices;

//     getNLPMarkupMatches(): MatchResult[] {
//         // do an NLP look up
//         const partsOfSpeech = new PartsOfSpeechService();

//         // set the text to a sanitized html to text string.
//         partsOfSpeech.setText(htmlToText(this._text));

//         // loop on the Markup Matches and apply the correct tags
//         const markupMatches = partsOfSpeech.getMarkupMatches();

//         return markupMatches;
//     }

//     /**
//      * Process the delta formats on every matching format
//      */
//     process(): Delta {
//         // loop through each format and get the ops associated
//         // if no matches the returned delta is empty
//         (this.getNLPMarkupMatches() || []).forEach(contentMatch => {

//             switch (contentMatch.Command) {
//                 case ContentMarkupCommands.Nouns:
//                     this._delta = (new Noun(this._delta, this._text, this._parentLeafType))
//                         .getContentDelta(contentMatch);
//                     break;

//                 case ContentMarkupCommands.Comparators:
//                     this._delta = (new Comparator(this._delta, this._text, this._parentLeafType))
//                         .getContentDelta(contentMatch);
//                     break;

//                 case ContentMarkupCommands.PastTense:
//                     this._delta = (new PastTense(this._delta, this._text, this._parentLeafType))
//                         .getContentDelta(contentMatch);
//                     break;

//                 default:
//                     console.error(`Missing type: ` + contentMatch.Command);
//                     break;
//             }
//         });

//         return this._delta;
//     }
// }
