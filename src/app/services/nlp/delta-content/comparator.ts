// import { Delta } from 'quill';
// import { DeltaFormat } from '../../interfaces/delta-format.interface';
// import { MatchResult } from '../../services/parts-of-speech.service';
// import { DeltaFormatsBase } from '../delta-formats/delta-formats-base';

// export class Comparator extends DeltaFormatsBase implements DeltaFormat {

//     getContentDelta(contentMatch: MatchResult): Delta {
//         this.delta
//             .retain(contentMatch.Start)                     // start position
//             .delete(contentMatch.Text.length)               // amount of text
//             .insert(contentMatch.Text, { comparator: 'SPAN' });   // insert text and tag type
//         return this.delta;
//     }
// }