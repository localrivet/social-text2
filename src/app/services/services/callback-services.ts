import {ContentMarkupCommands} from './parts-of-speech.service';
import {InsertTypes} from '../../enums/insert-types.enum';

export class CallbackServices {
    static callBackResults: any;

    constructor() {

        this.registerCallback(ContentMarkupCommands.Quoted, this.getQuotedAction.bind(this));
        this.registerCallback(InsertTypes.Mention, this.getMentionAction.bind(this));
        this.registerCallback(InsertTypes.Acronym, this.getAcronymAction.bind(this));
        this.registerCallback(InsertTypes.Icon, this.getIconAction.bind(this));
        this.registerCallback(InsertTypes.HashTag, this.getHashtagAction.bind(this));
        this.registerCallback(InsertTypes.ActionTag, this.getActionTag.bind(this));
    }

    executeCallback(transformName: string, value: string): any {
        CallbackServices.callBackResults = undefined;
        const callback = this.getCallback(transformName);
        if (callback && value.trim().length > 0) {
            for (let i = 0; !CallbackServices.callBackResults && i < callback.length; i++) {
                CallbackServices.callBackResults = callback[i](value);
            }
        }

        return CallbackServices.callBackResults;
    }

    /**
     * Callback to determine if word is action.
     * 
     * @param name - name of quoted text
     * @result URL for click of quoted text
     */
    getActionTag(text: string): any {

        let result = text.toLowerCase().indexOf(`please`);

        return result;
    }

    /**
     * Callback to supply URL for quoted text.
     * 
     * @param name - name of quoted text
     * @result URL for click of quoted text
     */
    getNounAction(text: string): any {

        return this.nounLookups[text.toLowerCase().trim()];
    }

    nounLookups = {
        "massachusetts": "http://www.massgeneral.org/",
        "general": "http://www.massgeneral.org/",
        "hospital": "http://www.massgeneral.org/",
        "yale": "http://https://www.ynhh.org/"
    }

    /**
     * Callback to supply URL for quoted text.
     * 
     * @param name - name of quoted text
     * @result URL for click of quoted text
     */
    getQuotedAction(text: string): any {

        if (text.length > 1) {
            text = text.trim().substring(1, text.length - 2);
        }

        return this.quoteLookups[text.toLowerCase()];
    }

    quoteLookups = {
        "moby dick": "https://en.wikipedia.org/wiki/Moby-Dick",
        "pilgrim's progress": "https://en.wikipedia.org/wiki/The_Pilgrim%27s_Progress"
    }

    /**
     * Callback to supply URL for quoted text.
     * 
     * @param name - name of quoted text
     * @result URL for click of quoted text
     */
    getMentionAction(text: string): any {

        return this.mentionLookups[text.toLowerCase().trim()];
    }

    mentionLookups = {
        "@mike": {Name: "Mike Tingey", ID: "mike.tingey"},
        "@mike.tingey": {Name: "Mike Tingey", ID: "mike.tingey"},
        "@mike.tingey@dharbor.com": {Name: "Mike Tingey", ID: "mike.tingey"},
        "@sagar": {Name: "Sagar Patel", ID: "sagar.patel"},
        "@sagar.patel": {Name: "Sagar Patel", ID: "sagar.patel"},
        "@rohit": {Name: "Rohit Agarwal", ID: "rohit.agarwal"},
        "@rohit.agarwal": {Name: "Rohit Agarwal", ID: "rohit.agarwal"},
        "@scott": {Name: "Scott Wood", ID: "scott.wood"},
        "@scott.wood": {Name: "Scott Wood", ID: "scott.wood"}
    }

    /**
     * Callback to supply value for acronym.
     * 
     * @param name - name of quoted text
     * @result URL for click of quoted text
     */
    getAcronymAction(text: string): any {

        return this.acronymLookups[text.trim()];
    }

    acronymLookups = {
        AAA: 'Abdominal Aortic Aneurysm',
        AB: 'Abortion',
        ABG: 'Arterial Blood Gases',
        AC: 'Before Meals or Anterior Cephalic Vein',
        ACE: 'Angiotensin Converting Enzyme',
        ACL: 'Anterior Cruciate Ligament',
        ACTH: 'Adrenocorticotropic Hormone',
        ADA: 'American Diabetes Association',
        ADH: 'Antidiuretic Hormone',
        ADL: 'Activities Of Daily Living',
        AED: 'Automated External Defibrillator',
        AF: 'Atrial Fibrillation',
        AFA: 'Advanced First Aid',
        AFB: 'Acid-fast Bacilli',
        AFP: 'Alpha-fetoprotein',
        AGA: 'Appropriate For Gestational Age',
        AIDS: 'Acquired Immune Deficiency Syndrome',
        AKA: 'Above Knee Amputation',
        AKF: 'Acute Kidney Failure',
        ALP: 'Alkaline Phosphatase',
        ALT: 'Alanine Transaminase',
        AMA: 'Against Medical Advice',
        AMI: 'Acute Myocardial Infarction',
        AODM: 'Adult Onset Diabetes Mellitus',
        AP: 'Apical Pulse',
        APE: 'Acute Pulmonary Edema / Acute Pulmonary Embolism',
        APO: 'Acute Pulmonary Oedema',
        APSGN: 'Acute Poststreptococcal Glomerulonephritis',
        ARDS: 'Acute Respiratory Distress Syndrome',
        ARF: 'Acute Renal Failure',
        AS: 'Auricle Sinistrus (Left Ear)',
        ASAD: 'Arthroscopic Subacromial Decompression',
        ASCUS: 'Atypical Squamous Cells Of Unknown Significance',
        ASD: 'Atrial Septal Defect',
        ASHD: 'Arteriosclerotic Heart Disease',
        AST: 'Aspartate Aminotransferase',
        ATN: 'Acute Tubular Necrosis',
        AU: 'Both Ears',
        AV: 'Atrio-Ventricular (cardiac)',
        AVB: 'Atrio-Ventricular Block',
        BK: 'Below Knee',
        BA: 'Breathing Apparatus',
        BAC: 'Blood Alcohol Content',
        BBP: 'Blood-Borne Pathogen',
        BBS: 'Bilateral Breath Sounds',
        BE: 'Barium Enema',
        BG: 'Blood Glucose',
        BGL: 'Blood Glucose Level',
        BI: 'Brain Injury',
        BID: 'Twice A Day',
        BILAT: 'Bilateral',
        BM: 'Bowel Movement Or Breast Milk',
        BMI: 'Body Mass Index',
        BP: 'Blood Pressure',
        BPH: 'Benign Prostatic Hypertrophy',
        BPV: 'Benign Positional Vertigo',
        BRM: 'Biologic Response Modifiers',
        BRP: 'Bathroom Privileges',
        BRT: 'Body Restorative Therapy',
        BS: 'Bowel Sounds',
        BSA: 'Body Surface Area',
        BSE: 'Breast Self Examination',
        BSI: 'Bodily Substance Isolation',
        BSL: 'Blood Sugar Level',
        BT: 'Bowel Tones',
        BUN: 'Blood Urea Nitrogen',
        BZD: 'BenZoDiazepine',
        CS: 'Culture And Sensitivity',
        CA: 'Calcium',
        CABA: 'Complaints Of',
        CABG: 'Coronary Artery Bypass Graft',
        CAD: 'Coronary Artery Disease',
        CAOX4: 'Conscious',
        CAPD: 'Continuous Ambulatory Peritoneal Dialysis',
        CAT: 'Computerized Tomography Scan',
        CBC: 'Complete Blood Count',
        CBD: 'Common Bile Duct',
        CBE: 'Clinical Breast Examination',
        CBG: 'Capillary Blood Glucose',
        CBI: 'Continuous Bladder Irrigation',
        CBS: 'Capillary Blood Sugar',
        CC: 'Chief Complaint',
        CCK: 'Cholecystokinin',
        CCPD: 'Continuous Cyclic Peritoneal Dialysis',
        CEA: 'Cultured Epithelial Autograft',
        CFT: 'Complement-fixation Test',
        CHD: 'Coronary Heart Disease',
        CHF: 'Congestive Heart Failure',
        CI: 'ContraIndications',
        CID: 'Cervical Immobilization Device',
        CIN: 'Cervical Intraepithelial Neoplasm',
        CL: 'Cleft Lip',
        CMS: 'Circulation',
        CNS: 'Central Nervous System',
        CO: 'Cardiac Output or Complains of',
        COAD: 'Chronic Obstructive Airways Disease',
        COPD: 'Chronic Obstructive Pulmonary Disease',
        CP: 'Chest Pain',
        CPAP: 'Continuous Positive Airway Pressure',
        CPD: 'Cephalo-pelvic Disproportion',
        CPP: 'Cerebral Perfusion Pressure',
        CPPD: 'Chest Percussion And Post Drainage',
        CPR: 'Chronic Obstructive Airway Disease',
        CRF: 'Chronic Renal Failure',
        CRRT: 'Continuous Renal Replacement Therapy',
        CRT: 'Capillary Refill Time',
        CSF: 'Cerebrospinal Fluid',
        CT: 'Chest Tube',
        CTD: 'Close To Death',
        CVA: 'Cerebral Vascular Accident',
        CVP: 'Central Venous Pressure',
        CX: 'Cervix',
        CXR: 'Chest X-ray',
        D5W: 'Dextrose 5% In Water (IV)',
        DAA: 'Denitrogenation Absorption Atelectasis',
        DAT: 'Diet As Tolerated',
        DC: '(dc) Discontinue',
        DCCT: 'Diabetes Control And Complication Trials',
        DEX: '(DXT) Blood Sugar',
        DIA: 'Digital Image Analysis',
        DIC: 'Disseminated Intravascular Coagulation',
        DKA: 'Diabetic Ketoacidosis',
        DM: 'Diabetic Mellitus',
        DNA: 'Deoxyribonucleic Acid',
        DNR: 'Do Not Resuscitate',
        DOA: 'Dead On Arrival',
        DP: 'Direct Pressure',
        DTR: 'Deep Tendon Reflex',
        DVT: 'Deep Vein Thrombosis',
        DX: 'Diagnosis',
        EBV: 'Epstein-Barr Virus',
        ECF: 'Extracellular Fluid',
        ECG: 'Electro CardioGram',
        EEG: 'ElectroEncephaloGram',
        EENT: 'Eye',
        EMC: 'Ensephalomyocarditis',
        EMG: 'Electromyogram',
        EOA: 'Esophageal Obturator Airway',
        ER: 'Emergency Room',
        ERCP: 'Endoscopic Retrograde Cholangiopancreatography',
        ESRD: 'End Stage Renal Disease',
        ET: 'Endotracheal Tube',
        FR: 'Force And Rhythm',
        FA: 'Fatty Acid',
        FB: 'Foreign Body',
        FBS: 'Fasting Blood Sugar',
        FD: 'Fatal Dose',
        FDA: 'Food & Drug Administration',
        FHR: 'Foetal Heart Rate',
        FHT: 'Foetal Heart Tones',
        FUO: 'Fever Of Unknown Origin',
        FVD: 'Fluid Volume Deficit',
        FX: 'Fracture',
        GB: 'Gallbladder',
        GDM: 'Gestational Diabetes Melitus',
        GERD: 'Gastroesophageal Reflux Disease',
        GFR: 'Glomerular Filtration Rate',
        GGT: 'Gamma-glutamyl Transferase',
        GI: 'Gastro-Intestinal',
        GOT: 'Glutamic Oxalic Transaminase',
        GU: 'Genito-Urinary',
        GVHD: 'Graft-versus-host-disease',
        HA: 'Headache',
        HASHD: 'Hypertensive ArterioSclerotic Heart Disease',
        HB: 'Hemoglobin',
        HCG: 'Human Chorionic Gonadotropin',
        HCO3: 'Bicarbonate',
        HCT: 'Hematocrit',
        HD: 'Hemodialysis',
        HDL: 'High Density Lipoprotein',
        HEENT: 'Head',
        HGB: 'Hemoglobin',
        HGSIL: 'High Grade Squamous Intraepithelial Lesion',
        HIV: 'Human Immunodeficiency Virus',
        HPE: 'H P E',
        HPV: 'Human Papiloma Virus',
        HR: 'Heart Rate',
        HRT: 'Hormone Replacement Therapy',
        HS: 'Bedtime',
        HTN: 'Gestational Diabetes Mellitus',
        HX: 'History',
        IABP: 'Intra-Aortic Balloon Pump',
        IBC: 'Iron Binding Capacity',
        IBD: 'Inflammatory Bowel Disease',
        IBS: 'Irritable Bowel Syndrome',
        IBW: 'Ideal Body Weight',
        ICCE: 'Intracapsular Cataract Extraction',
        ICF: 'Intermediate Care Facility',
        ICP: 'Intracranial Pressure',
        ICS: 'Intercostal Space',
        ICT: 'Inflammation Of Connective Tissue',
        ICU: 'Intensive Care Unit',
        IDDM: 'Insulin Dependent Diabetes Mellitus',
        IDM: 'Infant Of Diabetic Mother',
        IE: 'Inspiratory Exerciser or Inspiratory To Expiratory Ratio',
        IH: 'Infectious Hepatitis',
        IHD: 'Ischemic Heart Disease',
        IIP: 'Implantable Insulin Pump',
        IM: 'Intramuscular',
        IMV: 'Intermittent Mandatory Ventilation',
        INR: 'International Normalization Ratio',
        IOF: 'International Operation Forces',
        IPAP: 'Inspiratory Positive Airway Pressure',
        IPD: 'Intermittent Peritoneal Dialysis',
        IPPB: 'Intermittent Positive Pressure Breathing',
        IPPV: 'Intermittent Positive Pressure Ventilation',
        ITP: 'Immune Thrombocytopenic Purpura',
        IUD: 'IntraUterine Device',
        IV: 'Intravenous',
        IVDA: 'IV Drug Abuse/Abuser',
        IVF: 'In Vitro Fertilization',
        IVP: 'Intravenous Pyelography',
        JAMA: 'Journal Of The American Medical Association',
        JVD: 'Jugular Vein Distention',
        JVP: 'Jugular Venous Pressure',
        K: 'Potassium',
        KCL: 'Potassium Chloride',
        KI: 'Potassium Iodide',
        KUB: 'Kidney',
        KVO: 'Keep Vein Open',
        L: '& A Light And Accommodation',
        LA: 'Light And Accommodation',
        LAD: 'Left Anterior Descending (artery)',
        LB: 'Large Bowel',
        LDL: 'Low Density Lipoprotein',
        LE: 'Lower Extremities',
        LEEP: 'Loop Electrosurgical Excision Procedure',
        LFTS: 'Liver Function Test',
        LIJ: 'Left Internal Jugular',
        LLQ: 'Left Lower Quadrant',
        LMA: 'Laryngeal Mask Airway',
        LMP: 'Last Menstrual Period',
        LOX: 'Liquid Oxygen',
        LP: 'Lumbar Puncture',
        LSC: 'Left Subclavian',
        LSIL: 'Low Grade Squamous Intraepithelial Lesion',
        LUQ: 'Left Upper Quadrant',
        LVEF: 'Left Ventricular Ejection Fraction',
        LVF: 'Left Ventricular Failure',
        LVH: 'Left Ventricular Hypertrophy',
        MD: 'Doctorate Of Medicine',
        MAP: 'Mean Arterial Pressure',
        MAR: 'Medication Administration Record',
        MCL: 'Modified Chest Lead',
        MDI: 'Multiple Daily Vitamin',
        MI: 'Myocardial Infarction',
        MLC: 'Midline Catheter',
        MM: 'Mucous Membrane',
        MOABS: 'Monoclonal Antibodies',
        MOM: 'Milk Of Magnesia',
        MRDD: 'Mental Retarded/Developmentally Disabled',
        MRI: 'Magnetic Resonance Imaging',
        MRM: 'Modified Radical Mastectomy',
        MS: 'Multiple Sclerosis',
        MVA: 'Motor Vehicle Accident',
        NA: 'Sodium',
        NACL: 'Sodium Chloride',
        NAD: 'No Acute Distress',
        NC: 'Nasal Cannula',
        NED: 'No Evidence Of Disease',
        NG: 'NasoGastric',
        NICU: 'Neonatal Intensive Care Unit',
        NIDDM: 'Noninsulin Dependent Diabetes Mellitus',
        NKA: 'No Known Allergies',
        NKDA: 'No Known Drug Allergies or Non-ketotic Diabetic Acidosis',
        NKHC: 'Non-Ketotic Hyperglycemic Coma',
        NKHHC: 'NonKetonic Hyperglycemic-Hyperosmolar Coma',
        NKMA: 'No Known Medcation Allergies',
        NOS: 'Not Otherwise Specified',
        NPA: 'Nasopharyngeal Airway',
        NPD: 'Nightly Peritoneal Dialysis',
        NPO: 'Nothing By Mouth',
        NPQ: 'Not Physically Qualified',
        NS: 'Normal Saline (IV)',
        NSAID: 'Nonsteroidal Anti-inflammatory Drug',
        NSR: 'Normal Sinus Rythym (cardiac)',
        NT: 'NasoTracheal or No Tenderness/Not Tender',
        NTD: 'Neural Tube Defect',
        NV: 'Nausea & Vomiting',
        NWB: 'NON-WEIGHT BEARING',
        NYD: 'Not Yet Diagnosed',
        O2: 'Oxygen',
        OD: 'Overdose',
        OGTT: 'Oral Glucose Tolerance Test',
        OPA: 'Oropharyngeal Airway',
        ORIF: 'Open Reduction Internal Fixation',
        OS: 'Left Eye',
        OU: 'Both Eyes',
        PABA: 'Para-Aminobenzoic Acid',
        PAD: 'Peripheral Arterial Disease',
        PC: 'After Meals',
        PCA: 'Patient Controlled Analgesia',
        PCN: 'Penicillin',
        PCV: 'Packed Cell Volume',
        PD: 'Peritoneal Dialysis',
        PDA: 'Patent Ductus Arteriosus',
        PDD: 'Pervasive Development Disorder',
        PDR: `Physician's Desk Reference`,
        PE: 'Pulmonary Edema / Embolism',
        PEG: 'Percutaneous Endoscopic Gastrostomy',
        PEJ: 'Percutaneous Endoscopic Jejunostomy',
        PERL: 'Pupils Equal, Round, Reactive To Light',
        PERRLA: 'Pupils Equal, Round, Reactive To Light And Accommodation',
        PET: 'Positron Emission Tomography',
        PFT: 'Pulmonary Function Test',
        PG: 'Prostaglandin',
        PH: 'Past History or Concentration Of Hydrogen Ions',
        PHD: 'Doctorate Of Philosophy',
        PI: 'Present Illness',
        PICC: 'Peripherally Inserted Central Venous Catheter',
        PID: 'Pelvic Inflammatory Disease',
        PM: 'ParaMedic',
        PMHX: 'Prior/Previous Medical History',
        PMI: 'Point Of Maximal Impulse',
        PMS: 'Peripheral Motor (nervous) System',
        PNB: 'Pulseless Not Breathing',
        PND: 'Paroxysmal Nocturnal Dyspnea',
        PNH: 'Paroxysmal Nocturnal Hemoglobinuria',
        PNS: 'Peripheral Nervous System',
        PO: 'By Mouth / Per Oral',
        PO2: 'Partial Pressure Of O2',
        POTS: 'POSTURAL ORTHOSTATIC TACHYCARDIA SYNDROME',
        PPV: 'Positive Pressure Ventilation',
        PR: 'Per Rectum',
        PRBC: 'Packed Red Blood Cells',
        PRN: '(pro Re Nata) AS NEEDED',
        PS: 'Pyloric Stenosis',
        PSA: 'Prostate Specific Antigen',
        PSVT: 'Paroxysmal Supra-Ventricular Tachycardia',
        PT: 'Prothrombin Time',
        PTCA: 'Percutaneous Transluminal Coronary Angioplasty',
        PTT: 'Partial Thromboplastin Time',
        PUD: 'Peptic Ulcer Disease',
        PVD: 'Peripheral Vascular Disease',
        PWB: 'PARTIAL WEIGHT BEARING',
        PX: 'Pneumothorax',
        QD: 'Everyday',
        QID: 'Four Times A Day',
        QNS: 'Quantity Not Sufficient',
        QOD: 'Every Other Day',
        QS: 'Quantity Sufficient',
        RA: 'Rheumatoid Arthritis',
        RAD: 'Reactive Airway Disease',
        RAI: 'Radioactive Iodine',
        RAIU: 'Radioactive Iodine Uptake',
        RCA: 'Right Coronary Artery',
        RDW: 'Red Cell Distribution Width',
        REEDA: 'Redness',
        RHD: 'Rheumatic Heart Disease',
        RIJ: 'Right Internal Jugular',
        RLQ: 'Right Lower Quadrant',
        RM: 'Respiratory Movement',
        ROM: 'Range Of Motion',
        ROS: 'Review Of Systems',
        RSC: 'Right Subclavian: ',
        RSR: 'Regular Sinus Rhythym',
        RSV: 'Respiratory Syncitial Virus',
        RUQ: 'Right Upper Quadrant',
        RX: 'Prescription',
        SAB: 'Spontaneous Abortion',
        SABA: 'Supplied Air Breathing Apparatus',
        SAED: 'SemiAutomatic External Defibrillator',
        SAST: 'Serum Aspartate Aminotransferase',
        SB: 'Spina Bifida',
        SBO: 'Small Bowel Obstruction',
        SC: 'Subcutaneous',
        SGPT: 'Serum Glutamic-pyruvic Transaminase',
        SLE: 'Systemic Lupus Erythematosus',
        SLUD: 'Salivation',
        SMO: 'Standing Medical Orders',
        SNF: 'Skilled Nursing Facility',
        SOB: 'Short(ness) Of Breath',
        SR: 'Sedimentation Rate',
        SS: 'Social Services or Signs & Symptoms',
        ST: 'Sinus Tachycardia (cardiac)',
        STD: 'Sexually Transmitted Disease',
        STH: 'Somatotropic Hormone',
        STM: 'Short Term Memory',
        SUI: 'Stress Urinary Incontinence',
        SVR: 'Systemic Vascular Resistance',
        SVT: 'Supra-Ventricular Tachycardia',
        SX: 'Symptoms or Surgery',
        SZ: 'Seizure',
        T3: 'Triiodothyronine',
        T4: 'Thyroxine',
        TB: 'Tuberculosis/Trouble Breathing',
        TBF: 'Total Body Failure',
        TBI: 'Traumatic Brain Injury',
        TBSA: 'Total Body Surface Area',
        TCDB: 'Turn, Cough, Deep Breathe',
        TED: 'Thrombo-Embolism Deterrent',
        TEP: 'Transesophageal Puncture',
        THR: 'Total Hip Replacement',
        TIA: 'Transient Ischemic Attack',
        TIBC: 'Total Iron Binding Capacity',
        TID: 'Three Times A Day',
        TIL: 'Tumor Infiltrating Lymphocytes',
        TKR: 'Total Knee Replacement',
        TM: 'Tympanic Membrane',
        TNF: 'Tumor Necrosis Factor',
        TNM: 'Tumor, Node, Metastases',
        TNTC: 'Too Numerous To Mention',
        TP: 'Tuberculin Precipitation',
        TPN: 'Total Parenteral Nutrition',
        TPR: 'Temperature',
        TTN: 'Transient Tachypnea Of The Newborn',
        TTP: 'Thrombotic Thrombocytopenia Purpura',
        TUPR: 'Trans-urethral Prostatic Resection',
        TUR: 'Trans-Urethral Resection Of The Prostate',
        TURP: 'Trans-Urethral Resection Of The Prostate',
        TWB: 'Touch Weight Bear',
        TWE: 'Tap Water Enema',
        TX: 'Treatment',
        UA: 'Urinalysis',
        UAO: 'Upper Airway Obstruction',
        UBW: 'Usual Body Weight',
        UGI: 'Upper Gastrointestinal',
        UPJ: 'Ureteropelvic Junction',
        URI: 'Upper Respiratory Infection or URinary Incontinence',
        US: 'Ultrasonic',
        UTI: 'Urinary Tract Infection',
        UVJ: 'Ureterovesical Junction',
        VA: 'Visual Acuity',
        VBAC: 'Vaginal Birth After Caeserean',
        VF: 'Ventricular Fibrillation',
        VFIB: 'Ventricular Fibrillation',
        VLDL: 'Very Low Density Lipoprotein',
        VMA: 'Vanillylmandelic Acid',
        VPB: 'Ventricular Premature Beat',
        VPC: 'Ventricular Premature Contraction',
        VSA: 'Vital Signs Absent',
        VSD: 'Ventricular Septal Defect',
        VT: 'Ventricular Tachycardia',
        VTACH: 'Ventricular Tachycardia',
        VW: 'Vessel Wall',
        WC: 'Wheelchair',
        WBC: 'White Blood Cell',
        WD: 'Well Developed',
        WDI: 'Warm',
        WHO: 'World Health Organization',
        WMA: 'World Medical Association',
        WN: 'Well Nourished',
        WNL: 'Within Normal Limits',
        PAVE: 'Provider Application, Validation, and Enrollment',
        MED: 'Medicaid Exclusion Database',
        IRS: 'Internal Revenue Service'
    }

    /**
     * Callback to supply name and color for icon.
     * 
     * @param name - name of icon
     * @result name and color of icon
     */
    getIconAction(text: string): any {

        return this.iconLookups[text.toLowerCase().trim()];
    }

    iconLookups = {
        alert: {class: 'fa-exclamation-triangle', color: 'color:green;'},
        alerts: {class: 'fa-exclamation-triangle', color: 'color:green;'},
        warn: {class: 'fa-exclamation-triangle', color: 'color:orange;'},
        warns: {class: 'fa-exclamation-triangle', color: 'color:orange;'},
        warning: {class: 'fa-exclamation-triangle', color: 'color:orange;'},
        warnings: {class: 'fa-exclamation-triangle', color: 'color:orange;'},
        fail: {class: 'fa-exclamation-circle', color: 'color:red;'},
        failure: {class: 'fa-exclamation-circle', color: 'color:red;'},
        failing: {class: 'fa-exclamation-circle', color: 'color:red;'},
        error: {class: 'fa-exclamation-circle', color: 'color:red;'},
        errors: {class: 'fa-exclamation-circle', color: 'color:red;'},
        danger: {class: 'fa-exclamation-circle', color: 'color:red;'},
        dangers: {class: 'fa-exclamation-circle', color: 'color:red;'},
        comment: {class: 'fa-comment', color: 'color:green;'},
        comments: {class: 'fa-comments', color: 'color:green;'},
        mute: {class: 'fa-volume-mute', color: 'color:green;'},
        mutes: {class: 'fa-volume-mute', color: 'color:green;'},
        setting: {class: 'fa-cog', color: 'color:blue;'},
        settings: {class: 'fa-cog', color: 'color:blue;'},
        user: {class: 'fa-user', color: 'color:green;'},
        users: {class: 'fa-users', color: 'color:green;'},
        select: {class: 'fa-check-square', color: 'color:green;'},
        selects: {class: 'fa-check-square', color: 'color:green;'},
        selection: {class: 'fa-check-square', color: 'color:green;'},
        unselect: {class: 'fa-check-square', color: 'color:green;'},
        unselects: {class: 'fa-check-square', color: 'color:green;'},
        unselection: {class: 'fa-check-square', color: 'color:green;'},
        check: {class: 'fa-check-square', color: 'color:green;'},
        checks: {class: 'fa-check-square', color: 'color:green;'},
        checkbox: {class: 'fa-check-square', color: 'color:green;'},
        checkboxes: {class: 'fa-check-square', color: 'color:green;'},
        add: {class: 'fa-plus', color: 'color:green;'},
        adds: {class: 'fa-plus', color: 'color:green;'},
        notify: {class: 'fa-bell', color: 'color:green;'},
        notification: {class: 'fa-bell', color: 'color:green;'},
        notifications: {class: 'fa-bell', color: 'color:green;'},
        bug: {class: 'fa-bug', color: 'color:red;'},
        bugs: {class: 'fa-bug', color: 'color:red;'}
    }

    /**
     * Callback to pass hashtag (#hashtag).
     * 
     * @param name - name of icon
     * @result name and color of icon
     */
    getHashtagAction(text: string): any {

        return true;
    }

    public registerCallback(name: string, fnc: Function): void {
        const win = (window as any);
        win.SocialService.register(name, fnc);
    }

    public getCallback(name: string): Function[] {

        const win = (window as any);
        return win.SocialService.getRegistry(name);
    }
}

