// import { Delta } from 'quill';
// import { BlotTypes } from '../../../enums/blot-types.enum';
// import { DeltaFormat } from '../../interfaces/delta-format.interface';
// import { DeltaFormatsBase } from './delta-formats-base';
// const LINE_SEPARATOR = "\u2028";
// export class Note extends DeltaFormatsBase implements DeltaFormat {

//     getFormatDelta(): Delta {
//         console.log('*** Building Note');
//         // if (this.parentLeafType == BlotTypes.Block) {
//         this.delta
//             .retain(0)
//             .delete(this.text.length + 1)
//             .insert({ noteList: 'bullet' })
//         // }
//         return this.delta;
//     }
// }