// import { Delta } from 'quill';
// import { DeltaFormat } from '../../interfaces/delta-format.interface';
// import { MatchResult } from '../../services/parts-of-speech.service';
// import { DeltaFormatsBase } from '../delta-formats/delta-formats-base';

// export class Noun extends DeltaFormatsBase implements DeltaFormat {

//     getContentDelta(contentMatch: MatchResult, lookupResult?: any): Delta {
//         this.delta
//             .retain(0)                     // start position
//             .delete(contentMatch.Text.length)               // amount of text
//             .insert({ noun: {Text: contentMatch.Text, URL: lookupResult} });   // insert text and tag type
//         return this.delta;
//     }
// }
