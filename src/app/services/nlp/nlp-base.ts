// import Quill, { Delta } from 'quill';
// import { BlotTypes } from '../enums/blot-types.enum';
// import { TransformRule } from '../interfaces/transforms.interface';
// import {SocialTextService} from '../../social-text/services/social-text.service';

// const DeltaClass = Quill.import('delta');

// export interface NLP {
//     // getNLPMatches():
//     process(): Delta;
// }


// export abstract class NLPBase {

//     protected _delta: Delta;
//     protected _parentLeafType: BlotTypes;
//     protected _transform: TransformRule;
//     protected _text: string;
//     protected _atIndex?: number;
//     protected socialTextService: SocialTextService;

//     /**
//      * 
//      * @param transform 
//      * @param text 
//      * @param atIndex 
//      */
//     constructor(socialTextService: SocialTextService, transform: TransformRule, text: string, atIndex?: number) {
//         this._delta = new DeltaClass();
//         this._transform = transform;
//         this._text = text;
//         this._atIndex = atIndex;
//         this.socialTextService = socialTextService;
//     }

//     /**
//      * Sets the parent blot type
//      * @returns {this}
//      * @param blotType 
//      */
//     setParentLeafType(blotType: BlotTypes): NLPBase {
//         this._parentLeafType = blotType;
//         return this;
//     };

//     /**
//      * Processes the NLP rules
//      */
//     process(): Delta {
//         throw new Error('must implement this method in extended class');
//     }
// }