// import { Delta } from 'quill';
// import { BlotTypes } from '../../enums/blot-types.enum';
// import { DeltaFormat } from '../../interfaces/delta-format.interface';
// import { DeltaFormatsBase } from './delta-formats-base';

// export class EnumerationHeadingParagraph extends DeltaFormatsBase implements DeltaFormat {

//     getFormatDelta(): Delta {

//         console.log('*** called EnumerationHeadingParagraph');

//         // only create the list if the parent blot-type is a block
//         if (this.parentLeafType != BlotTypes.Heading) {
//             // console.log('*** can create list');
//             this.delta
//                 .retain(this.text.length)
//                 .delete(3)
//                 .insert({ list: 'bullet' });
//         }
//         return this.delta;
//     }
// }