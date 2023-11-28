export interface IPatientInformation{
    salutation: string;
    name: string,
    age: number | undefined
    gender: string | undefined
}

export interface IChamberReadings{
    ao: number | string, 
    la: number | string, 
    lvidd: number | string, 
    ivsd: number | string, 
    pwd: number | string, 
    ra: number | string, 
    rv: number | string, 
    background? : string
}

export interface IOtherEchoFindings{
    iasreading: string, 
    valves: string, 
    valveDetails: string, 
    rwma: string, 
    lvef: number | string, 
    rvef: number | string, 
    tapse: number | string, 
    ivc: number | string, 
    collapse: number | string
}