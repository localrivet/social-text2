// import Quill, {Delta, DeltaOperation, RangeStatic, QuillOptionsStatic} from 'quill'

// import {OnContentChangedEvent, QuillModule} from '../interfaces/quill.interface';

// //import { PartsOfSpeechService } from './parts-of-speech.service';
// import {TransformRule, Transforms} from '../interfaces/transforms.interface';
// import {ElementRef} from '@angular/core';
// import {BlotTypes} from '../enums/blot-types.enum';
// import {InsertTypes} from '../enums/insert-types.enum';
// import {NLPFormat} from '../nlp/nlp-format';
// import {NLPContent} from '../nlp/nlp-content';
// import {CallbackServices} from './callback-services';

// const Module = Quill.import('core/module');
// const DeltaClass = Quill.import('delta');
// //const Parchment = Quill.import('parchment');
// // Binds autoformat transforms to typing and pasting

// interface MatchOpsReturn {
//     ops: Delta,
//     rightIndex: number
// };

// export class SocialTextService extends Module<QuillModule>{
//     quill: Quill;
//     currentHelper: Object;

//     //    partsOfSpeech = new PartsOfSpeechService();
//     quillEditor: ElementRef<HTMLElement>;

//     public static transforms: Transforms = {};
//     public static DEFAULTS: Transforms = {};
//     public static nlpMarkupMatches: any;

//     callbackServices: CallbackServices;                        // Callback functions to client
//     clickCallback: Function[] = [];                                   // Callback when a click occurs

//     //        constructor(quill: Quill, options: QuillOptionsStatic    ) {
//     //            super(quill, <Object>options); 
//     //        }

//     /**
//      * returns the parentLeafType which is the hosting node/tag type of the cursor position
//      * @return {BlotTypes}
//      * @private
//      */
//     private get parentLeafType(): BlotTypes {
//         const range = this.quill.getSelection();
//         const leaf = this.quill.getLeaf(range.index);
//         // console.log('*** leaf:', leaf[0].parent.constructor.name);
//         if (leaf && leaf.length && leaf[0].parent && leaf[0].parent.constructor.name) {
//             return BlotTypes[leaf[0].parent.constructor.name];
//         }
//         return undefined;
//     };

//     /**
//      * The quill editor instance
//      * 
//      * @param quill 
//      */
//     setQuill(quill: Quill) {
//         this.quill = quill;

//         // Construct callback service
//         if (!this.callbackServices) {
//             this.callbackServices = new CallbackServices();
//         }
//     }
    
//     getCallBackServices(): CallbackServices {
//         return this.callbackServices;
//     }

//     /**
//      * 
//      * @param name string
//      * @param rule TransformRule
//      * 
//      * Adds a transform rule to the DEFAULTS object
//      * These transforms are automatically checked on each content change event
//      * Matching triggers execute the rule
//      */
//     static addTransform(name: string, rule: TransformRule) {
//         this.DEFAULTS[name] = this.transforms[name] = rule;
//     }

//     /**
//      * Returns the last delta operation
//      * The lastOp.insert is always a single character
//      * 
//      * @param ops DeltaOperation[]
//      */
//     getLastOperation(ops: DeltaOperation[]): DeltaOperation {
//         // Check last insert
//         let lastOpIndex = ops.length - 1;
//         let lastOp = ops[lastOpIndex]

//         // get the last operation
//         while (!lastOp.insert && lastOpIndex > 0) {
//             lastOpIndex--;
//             lastOp = ops[lastOpIndex];
//         }
//         return lastOp;
//     }

//     /**
//      * returns the ending index of the current selection
//      * 
//      * @returns {number}
//      * @param lastOp 
//      */
//     getEndSelectionIndex(lastOp: DeltaOperation): number {
//         const sel = this.quill.getSelection();
//         let endSelIndex = this.quill.getLength() - sel.index;

//         // // let's look at this last character that was inserted
//         switch (lastOp.insert) {
//             // this indicates that we just created a list.
//             // we need to increase the endSelIndex by one which below subtracts this number from the current index
//             // this enables the cursor to be put at the bullet point or number 
//             case ':':
//                 endSelIndex -= 1;
//                 break;
//         }
//         return endSelIndex;
//     }

//     /**
//      * @returns {void}
//      * @param delta Delta
//      * @param oldDelta Delta
//      * @param source Sources
//      */
//     manageTextChange(event: OnContentChangedEvent): void {
//         const ops = event.delta.ops
//         if (event.source !== 'user' || !ops || ops.length < 1) {
//             return;
//         }

//         // get the lastOp and ensure it has an insert not of the type string
//         const lastOp = this.getLastOperation(event.delta.ops);
//         if (!lastOp.insert || typeof lastOp.insert !== 'string') return;

//         // Get selection
//         const sel = this.quill.getSelection();
//         if (!sel) return;

//         // we need the full text for this leaf
//         let checkIndex = sel.index;
//         let [leaf] = this.quill.getLeaf(checkIndex)

//         if (!leaf || !leaf.text) {
//             return
//         }

//         let leafIndex = leaf.offset(leaf.scroll);
//         let leafSelIndex = checkIndex - leafIndex;
//         let transformed = false;

//         // Check transforms
//         for (const name in SocialTextService.transforms) {
//             // console.log('*** NAME:', name);
//             const transform = SocialTextService.transforms[name];

//             // Check transform trigger
//             if (lastOp.insert.match(transform.trigger || /./)) {
//                 let ops = (new DeltaClass()).retain(leafIndex);

//                 let transformOps: Delta;

//                 if (!transform.isNLP) {
//                     transformOps = this.makeDelta(transform, leaf.text, leafSelIndex);
//                 } else {
//                     // we check for formatting as well as text rules here
//                     transformOps = this.makeNLPDelta(transform, leaf.text, leafSelIndex);
//                 }

//                 // only allow a single transform for now
//                 if (transformOps && transformOps.ops && transformOps.ops.length > 0) {
//                     transformed = true;
//                     ops = ops.concat(transformOps);
//                     this.quill.updateContents(ops, 'api')
//                 }
//             }
//         }

//         // Restore cursor position
//         if (transformed) {
//             setTimeout(() => {
//                 const range: RangeStatic = {
//                     index: this.quill.getLength() - this.getEndSelectionIndex(lastOp),
//                     length: 0
//                 };
//                 this.quill.setSelection(range, 'api')
//             }, 0);
//         }
//     }


//     /**
//      * 
//      * @returns {Delta}
//      * @param transform TransformRule
//      * @param text string
//      * @param atIndex number
//      */
//     makeDelta(transform: TransformRule, text: string, atIndex?: number): Delta {
//         if (!transform.find.global) {
//             transform.find = new RegExp(transform.find, transform.find.flags + 'g');
//         }
//         transform.find.lastIndex = 0;

//         let findResult: RegExpExecArray = null;
//         let checkAtIndex = atIndex !== undefined && atIndex !== null;

//         // instantiate the Delta
//         let ops = new DeltaClass() as Delta;

//         if (checkAtIndex) {
//             // find match at index
//             findResult = transform.find.exec(text);

//             while (findResult && findResult.length && findResult.index < atIndex) {

//                 // Check if a lookup value is required, and if it exists
//                 let lookupValue = this.callbackServices.executeCallback(transform.insert, findResult[0]);
//                 if (!transform.usesLookupService || lookupValue && transform.usesLookupService) {

//                     if (findResult.index < atIndex && (findResult.index + findResult[0].length + 1) >= atIndex) {
//                         ops = ops.concat(this.matchOps(transform, findResult).ops);
//                         break;
//                     } else {
//                         findResult = transform.find.exec(text);
//                     }
//                 } else {
//                     break;
//                 }
//             }
//         } else {
//             // find all matches 
//             while ((findResult = transform.find.exec(text)) !== null) {
//                 let transformedMatch = this.matchOps(transform, findResult);
//                 ops = ops.concat(transformedMatch.ops);
//                 text = text.substr(transformedMatch.rightIndex);
//                 transform.find.lastIndex = 0;
//             }
//         }

//         return ops;
//     }

//     /**
//      * Creates deltas/ops for NLP content rules and formats 
//      * 
//      * @param  {TransformRule} transform
//      * @param  {string} text
//      * @param  {number} atIndex?
//      * @returns {Delta}
//      */
//     makeNLPDelta(transform: TransformRule, text: string, atIndex?: number): Delta {
//         let NLP: NLPFormat | NLPContent;

//         // small factory
//         switch (transform.insert) {
//             case InsertTypes.NLPFormat:
//                 NLP = (new NLPFormat(this, transform, text, atIndex));
//                 break;
//             case InsertTypes.NLPContent:
//                 NLP = (new NLPContent(this, transform, text, atIndex));
//                 break;
//         }

//         // console.log('*** this.parentLeafType', this.parentLeafType);

//         return NLP
//             .setParentLeafType(this.parentLeafType)
//             .process();
//     }

//     /**
//      * @param  {TransformRule} transform
//      * @param  {RegExpExecArray} result
//      * @returns MatchOpsReturn
//      */
//     matchOps(transform: TransformRule, result: RegExpExecArray): MatchOpsReturn {
//         result = this.applyExtract(transform, result);
//         // console.log('applyExtract result', result);

//         let resultIndex = result.index;
//         let transformedMatch = this.transformMatch(transform, result[0]);

//         let insert = transformedMatch;

//         if (transform.insert) {
//             insert = {};
//             insert[transform.insert] = transformedMatch;
//         }

//         let format = this.getFormat(transform, transformedMatch);

//         let ops = new DeltaClass() as Delta;

//         // console.log(transform.insert);
//         // only process an insert if we are actually inserting.
//         // if (transform.insert) {
//         switch (transform.insert) {
//             default:
//                 ops
//                     .retain(resultIndex)
//                     .delete(result[0].length)
//                     .insert(insert, format);
//         }

//         // console.log('*** ops', ops);

//         let rightIndex = resultIndex + result[0].length
//         // }

//         return <MatchOpsReturn> {
//             ops,
//             rightIndex
//         };
//     }


//     /**
//      * @param  {TransformRule} transform
//      * @param  {RegExpExecArray} match
//      * @returns RegExpExecArray
//      */
//     applyExtract(transform: TransformRule, match: RegExpExecArray): RegExpExecArray {
//         // Extract
//         if (transform.extract) {
//             let extract = new RegExp(transform.extract);
//             let extractMatch: RegExpExecArray = extract.exec(match[0]);

//             if (!extractMatch || !extractMatch.length) {
//                 return match;
//             }

//             extractMatch.index += match.index;
//             return extractMatch;
//         }

//         return match;
//     }

//     getFormat(transform: TransformRule, match: RegExpExecArray) {
//         let format = {};

//         if (typeof transform.format === "string") {
//             format[transform.format] = match;
//         } else if (typeof transform.format === "object") {
//             format = transform.format;
//         }

//         return format;
//     }

//     transformMatch(transform: TransformRule, match) {
//         let find = new RegExp(transform.extract || transform.find);
//         return transform.transform ? match.replace(find, transform.transform) : match;
//     }
// }