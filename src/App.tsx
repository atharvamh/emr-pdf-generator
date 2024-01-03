import { FormEvent, useEffect, useState } from 'react';
import { Disclosure, Tab } from '@headlessui/react';
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';
import { generatePdf } from './lib/utils';
import GeneralInput from './general-input';
import { IChamberReadings, IDopplerFindings, IImpressionTemplate, IOtherEchoFindings, IPatientInformation } from './interfaces/app-interfaces';
import toast, { Toaster } from 'react-hot-toast';
import { getLocalStorageUsage } from './lib/storageUtils';
import packageJson from "../package.json";

const App = () => {
  const genderOptions = [
    {value : "M", label : "M" },
    {value : "F", label : "F" }
  ]

  const yesNoOptions = [
    { value: "Yes", label : "Yes" },
    { value : "No", label : "No" }
  ]

  const salutationOptions = [
    { value: "Mr.", label : "Mr." },
    { value : "Mrs.", label : "Mrs." },
    { value : "Ms.", label : "Ms." },
    { value : "Dr.", label : "Dr." }
  ]

  const [patientDetails, setPatientDetails] = useState<IPatientInformation>({
    salutation: "Mr.",
    name: "",
    age: 0,
    gender: ""
  });

  const [chamberReadings, setChamberReadings] = useState<IChamberReadings>({
    ao: "",
    la: "",
    lvidd: "",
    lvids: "",
    ivsd: "",
    ivss: "",
    pwd: "",
    pws: "",
    ra: "",
    rv: "",
    background : ""
  })

  const [otherEchoReadings, setOtherEchoReadings] = useState<IOtherEchoFindings>({
    iasreading: "",
    valves: "",
    clots: "",
    clotDetails: "",
    vegetation: "",
    vegetationDetails: "",
    periCardialEffusion: "",
    periCardialEffusionDetails: "",
    aorticArch: "",
    rwma: "",
    lvef: "",
    rvef: "",
    tapse: "",
    ivc: ""
  });
  
  const [dopplerFindings, setDopplerFindings] = useState<IDopplerFindings>({
    E: "",
    A: "",
    eDash: "",
    flowAcrossValves: "",
    avMaxGradient: "",
    rvsp: "",
    rap: "",
    moreDetails: ""
  })

  const [impressionsReport, setImpressionsReport] = useState<string>("");
  const[doctorName, setDoctorName] = useState<string>("");
  const [qualification, setQualification] = useState<string>("");
  const [impressionTemplates, setImpressionTemplates] = useState<IImpressionTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);

  useEffect(() => {
    const doctorDetails = localStorage.getItem("ecr-u-metadata");
    const savedImpressions = localStorage.getItem("ecr-u-impression-templates");

    if(savedImpressions)
      setImpressionTemplates(JSON.parse(savedImpressions));

    if(!doctorDetails)
      return;

    const { name, qualification } = JSON.parse(doctorDetails);
    setDoctorName(name);
    setQualification(qualification);
  },[]);

  const handleGenerate = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(doctorName?.trim() && qualification?.trim()){
      generatePdf(patientDetails, chamberReadings, otherEchoReadings, dopplerFindings, { doctorName, qualification }, impressionsReport);
      return;
    }
      
    toast.error("Please fill up profile information");
  };

  const handleInput = (inputname: string, value: string) => {
    if(inputname === "doctorName")
      setDoctorName(value);

    else if(inputname === "qualification")
      setQualification(value);
  }

  const handlePatientInfoInput = (inputname: string, value: string) => {
    setPatientDetails((prev) => {
      return {
        ...prev,
        [inputname]: value
      }
    });
  }

  const handleChamberReadingsInput = (inputname: string, value: string) => {
    setChamberReadings((prev) => {
      return {
        ...prev,
        [inputname]: value
      }
    });
  }

  const handleOtherEchoInput = (inputname: string, value: string) => {
    setOtherEchoReadings(
      (prev) => {
        return {
          ...prev,
          [inputname]: value
        }
      }
    );
  }

  const handleDopplerInput = (inputname: string, value: string) => {
    setDopplerFindings(
      (prev) => {
        return {
          ...prev,
          [inputname]: value
        }
      }
    );
  }

  const handleImpressionsInput = (value: string) => {
    setImpressionsReport(value);
  }

  const saveImpressionTemplate = () => {

    const storage = getLocalStorageUsage();
    if(storage.totalSpace - 0.5 < storage.usedSpace){
      toast.error("Storage limit exceeded. Please delete some templates and try again.");
      return;
    }

    const savedImpressions = localStorage.getItem("ecr-u-impression-templates");
    if(savedImpressions){
      const templates = JSON.parse(savedImpressions);

      const existingTemplate = templates.find((template : IImpressionTemplate) => template.value === impressionsReport);
      if(existingTemplate){
        toast.error(`Template with same content already exists - ${existingTemplate.name}`);
        return;
      }

      const newTemplate = { id: crypto.randomUUID(), name : `Template ${(templates.length + 1)}`, value : impressionsReport };
      templates.push(newTemplate);
      localStorage.setItem("ecr-u-impression-templates", JSON.stringify(templates));
      setImpressionTemplates((prev) => [...prev, newTemplate]);
    }

    else{
      const newTemplate = { id: crypto.randomUUID(), name : "Template 1", value : impressionsReport };
      localStorage.setItem("ecr-u-impression-templates", JSON.stringify([newTemplate]));
      setImpressionTemplates((prev) => [...prev, newTemplate]);
    }

    toast.success("Template saved successfully.");
  }

  const deleteImpressionTemplate = (id: string) => {
    const savedImpressions = localStorage.getItem("ecr-u-impression-templates");

    if(savedImpressions){
      const templates = JSON.parse(savedImpressions);
      const tbdIndex = templates.findIndex((template : IImpressionTemplate) => template.id === id);
      templates.splice(tbdIndex, 1);
      localStorage.setItem("ecr-u-impression-templates", JSON.stringify(templates));
      setImpressionTemplates(templates);
      toast.success("Template deleted successfully.");
    }
  }

  const saveDoctorDetails = () => {
    if(!doctorName?.trim() || !qualification?.trim())
      return;

    const doctorDetails = {
      name: doctorName,
      qualification: qualification
    }

    localStorage.setItem("ecr-u-metadata", JSON.stringify(doctorDetails));
    toast.success("Details saved successfully.");
  }

  return (
    <div className='w-full flex flex-1 h-screen'>
      <Toaster />
      <div className="p-6 bg-gray-800 text-white w-full h-screen overflow-y-auto mb-8">
        <Tab.Group>
          <Tab.List className="flex flex-1 w-full px-2 gap-2">
            <Tab className={({ selected }) =>
                `py-2 px-4 rounded-md transition-all ${ selected ? 'bg-amber-600 text-white' : 'text-white hover:bg-amber-600'}`
              }
              onClick={() => setActiveTab(1)}
            >
              Report
            </Tab>
            <Tab className={({ selected }) =>
                `py-2 px-4 rounded-md transition-all ${ selected ? 'bg-amber-600 text-white' : 'text-white hover:bg-amber-600'}`
              }
              onClick={() => setActiveTab(2)}
            >
              My Profile
            </Tab>
          </Tab.List>
          <Tab.Panels className="pt-8">
              <Tab.Panel>
                {
                  activeTab === 1 &&
                  <form className='items-center flex flex-col flex-1 w-full h-full px-2 rounded-lg overflow-y-auto' 
                    onSubmit={(e) => handleGenerate(e)}>
                    
                    <Disclosure defaultOpen={true}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 bg-purple-500 text-white rounded-md focus:outline-none">
                            <span>Patient Details</span>
                            {open ? <FiChevronUp /> : <FiChevronDown />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="p-4 border border-t-0 rounded-md w-full flex flex-col gap-4 items-start justify-between">
                            <div className='w-full flex gap-2'>
                              <div className='w-1/4'>
                              <GeneralInput type="dropdown" id="salutation" name="salutation" label="Title" value={patientDetails.salutation} 
                                onChange={handlePatientInfoInput} required={true} options={salutationOptions}/>
                              </div>
                              <GeneralInput type="text" id="name" name="name" label="Name" value={patientDetails.name} 
                                onChange={handlePatientInfoInput} required={false}/>
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="dropdown" id="sex" name="gender" label="Sex" value={patientDetails.gender}
                                options={genderOptions} onChange={handlePatientInfoInput} required={false}/>
                              <GeneralInput type="number" id="age" name="age" label="Age" 
                              value={patientDetails.age} onChange={handlePatientInfoInput}  required={false}/>
                              </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 mt-4 bg-purple-500 text-white rounded-md focus:outline-none">
                            <span>2D Echo Findings</span>
                            {open ? <FiChevronUp /> : <FiChevronDown />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="p-4 border border-t-0 rounded-md w-full flex flex-col gap-2 items-start">
                            <div className="w-full">
                              <GeneralInput type="text" id="background" name="background" label="Background" value={chamberReadings.background} 
                                onChange={handleChamberReadingsInput} required={false}/>
                            </div>
                            <div className='w-full justify-center flex'>
                              <p className='font-semibold'>-- Chambers Size Readings --</p>
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="number" id="ao" name="ao" label="Ao" value={chamberReadings.ao} 
                                onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="la" name="la" label="LA" value={chamberReadings.la} 
                                onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="lvidd" name="lvidd" label="LVIDd" value={chamberReadings.lvidd} 
                                onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="lvids" name="lvids" label="LVIDs" value={chamberReadings.lvids} 
                                onChange={handleChamberReadingsInput} required={false}/>
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="number" id="ivsd" name="ivsd" label="IVSd" value={chamberReadings.ivsd} 
                                onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="ivss" name="ivss" label="IVSs" value={chamberReadings.ivss} 
                                onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="pwd" name="pwd" label="PWd" value={chamberReadings.pwd} 
                                  onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="pws" name="pws" label="PWs" value={chamberReadings.pws} 
                                  onChange={handleChamberReadingsInput} required={false}/>
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="number" id="ra" name="ra" label="RA" value={chamberReadings.ra} 
                                onChange={handleChamberReadingsInput} required={false}/>
                              <GeneralInput type="number" id="rv" name="rv" label="RV" value={chamberReadings.rv} 
                                onChange={handleChamberReadingsInput} required={false}/>
                            </div>
                            <div className='w-full justify-center flex'>
                              <p className='font-semibold'>-- Details --</p>
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="text" id="iasreading" name="iasreading" label="IAS/IVS" value={otherEchoReadings.iasreading}
                                onChange={handleOtherEchoInput} required={false} />
                              <GeneralInput type="text" id="valves" name="valves" label="Valves" value={otherEchoReadings.valves}
                                onChange={handleOtherEchoInput} required={false} />
                            </div>
                            <div className='w-full flex flex-col gap-2 items-center'>
                              <GeneralInput type="dropdown" id="clots" name="clots" label="Clots" value={otherEchoReadings.clots}
                                  onChange={handleOtherEchoInput} required={false} options={yesNoOptions} />
                              {
                                otherEchoReadings.clots === "Yes" &&
                                <GeneralInput type="text" id="clotDetails" name="clotDetails" label="Clot Details" value={otherEchoReadings.clotDetails}
                                onChange={handleOtherEchoInput} required={false} />
                              }
                            </div>
                            <div className='w-full flex flex-col gap-2 items-center'>
                              <GeneralInput type="dropdown" id="vegetation" name="vegetation" label="Vegetation" value={otherEchoReadings.vegetation}
                                onChange={handleOtherEchoInput} required={false} options={yesNoOptions} />
                              {
                                otherEchoReadings.vegetation === "Yes" &&
                                <GeneralInput type="text" id="vegetationDetails" name="vegetationDetails" label="Vegetation Details" 
                                value={otherEchoReadings.vegetationDetails} onChange={handleOtherEchoInput} required={false} />
                              }
                            </div>
                            <div className='w-full flex flex-col gap-2 items-center'>
                              <GeneralInput type="dropdown" id="periCardialEffusion" name="periCardialEffusion" label="Pericardial Effusion" 
                                  value={otherEchoReadings.periCardialEffusion} onChange={handleOtherEchoInput} required={false} options={yesNoOptions} />
                              {
                                otherEchoReadings.periCardialEffusion === "Yes" &&
                                <GeneralInput type="text" id="periCardialEffusionDetails" name="periCardialEffusionDetails" 
                                label="Pericardial Effusion Details" value={otherEchoReadings.periCardialEffusionDetails} onChange={handleOtherEchoInput} required={false} />
                              }
                            </div>
                            <div className='w-full flex flex-col gap-2 items-center'>
                              <GeneralInput type="text" id="aorticArch" name="aorticArch" label="Aortic Arch" 
                                  value={otherEchoReadings.aorticArch} onChange={handleOtherEchoInput} required={false} />
                            </div>
                            <div className='w-full flex'>
                              <GeneralInput type="text" id="rwma" name="rwma" label="RWMA" value={otherEchoReadings.rwma}
                                onChange={handleOtherEchoInput} required={false} />
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="number" id="lvef" name="lvef" label="LVEF" value={otherEchoReadings.lvef}
                                onChange={handleOtherEchoInput} required={false} />
                              <GeneralInput type="number" id="rvef" name="rvef" label="RVEF" value={otherEchoReadings.rvef}
                                onChange={handleOtherEchoInput} required={false} />
                              <GeneralInput type="number" id="tapse" name="tapse" label="TAPSE" value={otherEchoReadings.tapse}
                                onChange={handleOtherEchoInput} required={false} />
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="text" id="ivc" name="ivc" label="IVC" value={otherEchoReadings.ivc}
                                onChange={handleOtherEchoInput} required={false} />
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 mt-4 bg-purple-500 text-white rounded-md focus:outline-none">
                            <span>Doppler Findings</span>
                            {open ? <FiChevronUp /> : <FiChevronDown />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="p-4 border border-t-0 rounded-md w-full">
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="number" id="E" name="E" label="E" value={dopplerFindings.E}
                                onChange={handleDopplerInput} required={false} />
                              <GeneralInput type="number" id="A" name="A" label="A" value={dopplerFindings.A}
                                onChange={handleDopplerInput} required={false} />
                              <GeneralInput type="number" id="eDash" name="eDash" label="e'" value={dopplerFindings.eDash}
                                onChange={handleDopplerInput} required={false} />
                            </div>
                            <div className='w-full flex'>
                              <GeneralInput type="text" id="flowAcrossValves" name="flowAcrossValves" label="Flow Across Valves" 
                                value={dopplerFindings.flowAcrossValves} onChange={handleDopplerInput} required={false} />
                            </div>
                            <div className='w-full flex'>
                              <GeneralInput type="number" id="avMaxGradient" name="avMaxGradient" label="AV Max Gradient" 
                                value={dopplerFindings.avMaxGradient} onChange={handleDopplerInput} required={false} />
                            </div>
                            <div className='w-full flex gap-2'>
                              <GeneralInput type="number" id="rvsp" name="rvsp" label="RVSP (for PASP)" 
                                value={dopplerFindings.rvsp} onChange={handleDopplerInput} required={false} />
                              <GeneralInput type="number" id="rap" name="rap" label="RAP (for PASP)" 
                                value={dopplerFindings.rap} onChange={handleDopplerInput} required={false} />
                            </div>
                            <div className='w-full flex'>
                              <GeneralInput type="text" id="moreDetails" name="moreDetails" label="Additional Details" 
                                value={dopplerFindings.moreDetails} onChange={handleDopplerInput} required={false} />
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 mt-4 bg-purple-500 text-white rounded-md focus:outline-none">
                            <span>Impression</span>
                            {open ? <FiChevronUp /> : <FiChevronDown />}
                          </Disclosure.Button>
                          <Disclosure.Panel className="p-4 border border-t-0 rounded-md w-full">
                            <GeneralInput type="textarea" id="impressionsReport" name="impressionsReport" label="Details (comma seperated)" 
                                value={impressionsReport} onChange={() => null}
                                onTxtAreaChange={handleImpressionsInput} required={false} />
                            <div className='flex items-center justify-center'>
                              <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md 
                                disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                                onClick={saveImpressionTemplate}
                                disabled={!impressionsReport?.trim()}
                              >
                                Save template
                              </button>
                            </div>
                            {
                              impressionTemplates?.length ? 
                              <div className='impression-templates pt-8 pb-2'>
                                <p className='font-semibold pb-2'>Impression templates</p>
                                {
                                  impressionTemplates.map((template) => {
                                    return (
                                      <div className='flex flex-col gap-2 items-start pb-4' key={template.id}>
                                        <div className='flex w-full items-center justify-between pr-2'>
                                          <p className='text-xs flex gap-2 items-center'>
                                            <span>{template.name}</span>
                                          </p>
                                          <p className='text-sm cursor-pointer' onClick={() => deleteImpressionTemplate(template.id)}>
                                            <FiTrash2 />
                                          </p>
                                        </div>
                                        <p 
                                          className='bg-green-700 text-white p-2 text-sm w-full 
                                          rounded-lg cursor-pointer hover:bg-green-800' 
                                          onClick={() => setImpressionsReport(template.value)}>
                                          {template.value}
                                        </p>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              : <></>
                            }
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    <div className='my-4'>
                      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Generate Report
                      </button>
                    </div>
                  </form>
                }
              </Tab.Panel>
              <Tab.Panel>
                {
                  activeTab === 2 &&
                  <>
                    <div className='flex w-full items-center gap-2'>
                      <div className='flex w-1/5'>
                        <GeneralInput 
                          type='text' id='docsalut' name='docsalut' label='Dr.' value={"Dr."}
                          onChange={() => null} disabled={true}
                        />
                      </div>
                      <GeneralInput 
                        type='text' id='doctorName' name='doctorName' label='Consulting Doctor Name' value={doctorName}
                        onChange={handleInput} required={true}
                      />
                    </div>
                    <div className='flex flex-col w-full'>
                      <GeneralInput 
                        type='text' id='qualification' name='qualification' label='Qualification (comma seperated)' value={qualification}
                        onChange={handleInput} required={true}
                      />
                    </div>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
                      onClick={saveDoctorDetails}
                    >
                      Save Details
                    </button>
                  </>
                }
              </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <footer className='w-full absolute bottom-0 right-0 text-center p-4'>
          <p className='text-sm'>&copy; { new Date().getFullYear() }. MediGen Solutions. All Rights Reserved.</p>
          <p className='text-xs p-1'>Version - {packageJson.version}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;