// import { Delta, DeltaOperation } from 'quill';
// import { BlotTypes } from '../../enums/blot-types.enum';
// import { DeltaFormat } from '../../interfaces/delta-format.interface';
// import { DeltaFormatsBase } from './delta-formats-base';

// export class Heading extends DeltaFormatsBase implements DeltaFormat {

//     /**
//      * @todo use NLP to figure out which heading size we need
//      * 
//      * @returns Delta
//      */
//     getFormatDelta(): Delta {
//         // only create a header if the parent is a block
//         if (this.parentLeafType == BlotTypes.Block) {
//             this.delta
//                 .retain(0)
//                 .delete(this.text.trimRight().length)
//                 .insert(this.text.trimRight(), { heading: 'H1' });
//         }
//         return this.delta;
//     }
// }