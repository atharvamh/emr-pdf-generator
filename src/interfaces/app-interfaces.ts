type StrNum = string | number;

export interface IPatientInformation{
    salutation: string;
    name: string,
    age: number | undefined
    gender: string | undefined
}

export interface IChamberReadings{
    ao: StrNum, 
    la: StrNum, 
    lvidd: StrNum,
    lvids: StrNum,
    ivsd: StrNum,
    ivss: StrNum,
    pwd: StrNum,
    pws: StrNum,
    ra: StrNum, 
    rv: StrNum, 
    background? : string
}

export interface IOtherEchoFindings{
    iasreading: string, 
    valves: string,
    clots: string,
    clotDetails: string,
    vegetation: string,
    vegetationDetails: string,
    periCardialEffusion: string,
    periCardialEffusionDetails: string,
    aorticArch: string,
    aorticArchDetails: string,
    rwma: string, 
    lvef: StrNum, 
    rvef: StrNum, 
    tapse: StrNum, 
    ivc: string
}

export interface IDopplerFindings{
    E: StrNum,
    A: StrNum,
    eDash: StrNum,
    flowAcrossValves: string,
    avMaxGradient: StrNum,
    rvsp: StrNum,
    rap: StrNum
}

export interface IDoctorDetails{
    doctorName: string,
    qualification: string,
}

export interface IImpressionTemplate{
    id: string,
    name: string,
    value: string
}