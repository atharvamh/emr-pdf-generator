/* eslint-disable @typescript-eslint/no-explicit-any */

import jsPDF from "jspdf";
import { IChamberReadings, IDoctorDetails, IDopplerFindings, IOtherEchoFindings, IPatientInformation } from "../interfaces/app-interfaces";

type StrNum = string | number;

const pdfTitle = "2D Echocardiography & Colour Doppler Report";
const pdfFontName = "helvetica";
const defaultBlankValue = "__";

function capitalizeWords(input: string) {
  return input.replace(/\b\w/g, match => match.toUpperCase());
}

class PdfGenerator{
  _pdfContext: jsPDF;
  pageWidth: number = 0;
  pageHeight: number = 0;
  margin: number = 16;
  usedSpaceFromTop : number = 0;

  constructor(){
    this._pdfContext = new jsPDF();
    this.pageWidth = this._pdfContext.internal.pageSize.width - (2 * this.margin);
    this.pageHeight = this._pdfContext.internal.pageSize.height - (2 * this.margin);
  }

  setTitle = (title: string) => {
    const fontSize = 14;
    this._pdfContext.setFont(pdfFontName, "bold");
    this._pdfContext.setFontSize(fontSize);
    const textWidth = this._pdfContext.getStringUnitWidth(title) * fontSize;
    const textX = Math.max(((this.pageWidth - textWidth) / 2) + this.margin, this.margin);

    this._pdfContext.text(title, textX, this.margin);
  }

  setPatientInfoSection = (name: string, age?: number, sex?: string) => {
    const infoSectionHeight = 12;
    const titleOffset = 4;
    const fontSize = 10;
    this._pdfContext.setFont(pdfFontName, "normal");
    this._pdfContext.setFontSize(fontSize);

    this._pdfContext.line(this.margin, this.margin + titleOffset, this.margin + this.pageWidth, this.margin + titleOffset);
    this._pdfContext.line(this.margin, this.margin + infoSectionHeight, this.margin + this.pageWidth, this.margin + infoSectionHeight);

    const nameSectionWidth = this.pageWidth / 2;
    const equiPartWidth = nameSectionWidth / 3;
    const posY = this.margin + titleOffset + (infoSectionHeight / 2.5);

    this._pdfContext.text(`Name: ${name}`, this.margin, posY);
    this._pdfContext.text(`Age: ${age ?? "--"}`, this.margin + nameSectionWidth, posY);
    this._pdfContext.text(`Sex: ${sex ?? "--"}`, this.margin + nameSectionWidth + equiPartWidth, posY);
    this._pdfContext.text(`Date: ${new Date().toLocaleDateString('en-UK') }`, this.margin + nameSectionWidth + 2 * equiPartWidth, posY);

    this.usedSpaceFromTop = this.margin + infoSectionHeight + titleOffset;
  }

  setChamberReadings = (ao: StrNum, la: StrNum, lvidd: StrNum, lvids: StrNum, 
    ivsd: StrNum, ivss: StrNum, pwd: StrNum, pws: StrNum, ra: StrNum, rv: StrNum, background? : string) => {
    const sectionOffset = 2;

    this._pdfContext.setFont(pdfFontName, "bold");
    this._pdfContext.setFontSize(12);
    this._pdfContext.text(`Background : ${background ?? "--"}`, this.margin, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 4);

    this._pdfContext.text("2D Echo findings", this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.setFontSize(10);
    this._pdfContext.setFont(pdfFontName, "normal");
    this._pdfContext.text("Chambers size:", this.margin, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 3);

    const equiPartWidth = this.pageWidth / 6;
    this._pdfContext.text(`Ao = ${ao || defaultBlankValue} cm`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`LA = ${la || defaultBlankValue} cm`, this.margin + equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`LVIDd = ${lvidd || defaultBlankValue} cm`, this.margin + 2 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`LVIDs = ${lvids || defaultBlankValue} cm`, this.margin + 3 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`IVSd = ${ivsd || defaultBlankValue} cm`, this.margin + 4 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`IVSs = ${ivss || defaultBlankValue} cm`, this.margin + 5 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`PWd = ${pwd || defaultBlankValue} cm`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`PWs = ${pws || defaultBlankValue} cm`, this.margin + equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`RA = ${ra || defaultBlankValue} cm`, this.margin + 2 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`RV = ${rv || defaultBlankValue} cm`, this.margin + 3 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.line(this.margin, this.usedSpaceFromTop, this.margin + this.pageWidth, this.usedSpaceFromTop);
    this.usedSpaceFromTop += (sectionOffset * 2);
  }

  setOtherReadings = (iasreading: string, valves: string, clots: string, clotDetails: string,
    vegetation: string, vegetationDetails: string, periCardialEffusion: string, periCardialEffusionDetails: string,
    aorticArch: string, aorticArchDetails: string, rwma: string, lvef: StrNum, rvef: StrNum, tapse: StrNum, ivc: StrNum) => {
    const sectionOffset = 2;

    this._pdfContext.text(`IAS/IVS: ${iasreading}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.text(`Valves: ${valves}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`Clots: ${clots}`, this.margin, this.usedSpaceFromTop + sectionOffset);

    if(clots === "Yes"){
      this.usedSpaceFromTop += (sectionOffset * 3);
      this._pdfContext.text(`Details : ${clotDetails}`, this.margin, this.usedSpaceFromTop + sectionOffset)
    }
      
    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.text(`Vegetation: ${vegetation}`, this.margin, this.usedSpaceFromTop + sectionOffset);

    if(vegetation === "Yes"){
      this.usedSpaceFromTop += (sectionOffset * 3);
      this._pdfContext.text(`Details : ${vegetationDetails}`, this.margin, this.usedSpaceFromTop + sectionOffset)
    }

    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`Pericardial Effusion: ${periCardialEffusion}`, this.margin, this.usedSpaceFromTop + sectionOffset);

    if(periCardialEffusion === "Yes"){
      this.usedSpaceFromTop += (sectionOffset * 3);
      this._pdfContext.text(`Details : ${periCardialEffusionDetails}`, this.margin, this.usedSpaceFromTop + sectionOffset)
    }

    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`Aortic Arch: ${aorticArch}`, this.margin, this.usedSpaceFromTop + sectionOffset);

    if(aorticArch === "Yes"){
      this.usedSpaceFromTop += (sectionOffset * 3);
      this._pdfContext.text(`Details : ${aorticArchDetails}`, this.margin, this.usedSpaceFromTop + sectionOffset)
    }

    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.line(this.margin, this.usedSpaceFromTop, this.margin + this.pageWidth, this.usedSpaceFromTop);

    this.usedSpaceFromTop += (sectionOffset * 2);
    
    this._pdfContext.text(`RWMA: ${rwma}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    const equiPartWidth = this.pageWidth / 3;
    this._pdfContext.text(`LVEF = ${lvef || defaultBlankValue} %`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`RVEF = ${rvef || defaultBlankValue} %`, this.margin + equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`(TAPSE = ${tapse || defaultBlankValue} cm)`, this.margin + 2 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`IVC = ${ivc}`, this.margin, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.line(this.margin, this.usedSpaceFromTop, this.margin + this.pageWidth, this.usedSpaceFromTop);

    this.usedSpaceFromTop += (sectionOffset * 2);
  }

  setDopplerFindings = (E: StrNum, A: StrNum, eDash: StrNum, flowAcrossValves: string, avMaxGradient: StrNum, rvsp: StrNum, rap: StrNum) => {
    const sectionOffset = 2;
    this._pdfContext.setFont(pdfFontName, "bold");
    this._pdfContext.setFontSize(12);

    this._pdfContext.text("Doppler Findings", this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.setFont(pdfFontName, "normal");
    this._pdfContext.setFontSize(10);

    const numE = Number(E);
    const numA = Number(A);
    const numeDash = Number(eDash);
    const equiPartWidth = this.pageWidth / 3;
    this._pdfContext.text(`${numE > numA ? "E > A" : (numE < numA ? "E < A" : "E = A")}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`E / A : ${numA !== 0 ? (numE / numA).toFixed(2) : defaultBlankValue}`, this.margin + equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`E / e' : ${numeDash !== 0 ? (numE / numeDash).toFixed(2) : defaultBlankValue}`, this.margin + (2 * equiPartWidth), this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`Flow across valves : ${flowAcrossValves}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`AV max gradient = ${avMaxGradient || defaultBlankValue} mm of Hg`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`PASP = ${rvsp || "0"} + ${rap || "0"} = ${Number(rvsp) + Number(rap)} mm of Hg`, this.margin, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.line(this.margin, this.usedSpaceFromTop, this.margin + this.pageWidth, this.usedSpaceFromTop);

    this.usedSpaceFromTop += (sectionOffset * 2);
  }

  setImpressions = (impressions: string) => {
    const sectionOffset = 2;
    this._pdfContext.setFont(pdfFontName, "bold");
    this._pdfContext.setFontSize(12);

    this._pdfContext.text("IMPRESSION", this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 2);
    this._pdfContext.rect(this.margin, this.usedSpaceFromTop, this.pageWidth, this.pageHeight - this.usedSpaceFromTop + sectionOffset * 4);

    this._pdfContext.setFontSize(10);
    const impArr = impressions.split(",");

    this.usedSpaceFromTop += (sectionOffset * 2);
    for(let i = 0; i < impArr.length; i++){
      this._pdfContext.text(`${impArr[i].trim().toUpperCase()}`, this.margin + sectionOffset, this.usedSpaceFromTop + sectionOffset);
      this.usedSpaceFromTop += (sectionOffset * 3);
    }
  }

  setDoctorSignature = (name: string, qualification: string) => {
    this._pdfContext.setFont(pdfFontName, "bold");
    this._pdfContext.setFontSize(12);
    this._pdfContext.text(`Dr. ${capitalizeWords(name)}`, this.margin, this.pageHeight + this.margin);

    this._pdfContext.setFont(pdfFontName, "normal");
    this._pdfContext.setFontSize(10);
    this._pdfContext.text(qualification, this.margin, this.pageHeight + this.margin + 5);
  }

  previewPdf = () => {
    const pdfDataUrl = this._pdfContext.output('dataurlstring');
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = pdfDataUrl;

    const pdfPreviewSection = document.getElementById('pdf-preview');
    if(pdfPreviewSection){
      pdfPreviewSection.innerHTML = "";
      pdfPreviewSection.appendChild(iframe);
    }
  }
}

export const generatePdf = (patientDetails: IPatientInformation, chamberReadings: IChamberReadings,
  otherEchoReadings: IOtherEchoFindings, dopplerFindings: IDopplerFindings, doctorDetails: IDoctorDetails, impressions: string) => {
  const pdfgen = new PdfGenerator();
  pdfgen.setTitle(pdfTitle);
  pdfgen.setPatientInfoSection(patientDetails.salutation + " " + patientDetails.name, patientDetails.age, patientDetails.gender);
  pdfgen.setChamberReadings(
    chamberReadings.ao, chamberReadings.la, chamberReadings.lvidd, chamberReadings.lvids,
    chamberReadings.ivsd, chamberReadings.ivss, chamberReadings.pwd, chamberReadings.pws,
    chamberReadings.ra, chamberReadings.rv, chamberReadings.background
  );
  pdfgen.setOtherReadings(
    otherEchoReadings.iasreading,
    otherEchoReadings.valves,
    otherEchoReadings.clots,
    otherEchoReadings.clotDetails,
    otherEchoReadings.vegetation,
    otherEchoReadings.vegetationDetails,
    otherEchoReadings.periCardialEffusion,
    otherEchoReadings.periCardialEffusionDetails,
    otherEchoReadings.aorticArch,
    otherEchoReadings.aorticArchDetails,
    otherEchoReadings.rwma,
    otherEchoReadings.lvef,
    otherEchoReadings.rvef,
    otherEchoReadings.tapse,
    otherEchoReadings.ivc
  );
  pdfgen.setDopplerFindings(
    dopplerFindings.E,
    dopplerFindings.A,
    dopplerFindings.eDash,
    dopplerFindings.flowAcrossValves,
    dopplerFindings.avMaxGradient,
    dopplerFindings.rvsp,
    dopplerFindings.rap
  );
  pdfgen.setImpressions(impressions);
  pdfgen.setDoctorSignature(doctorDetails.doctorName, doctorDetails.qualification);
  pdfgen.previewPdf();
  //pdfgen._pdfContext.save(`${patientDetails.name ? patientDetails.name : "Patient"}_Echo_Report.pdf`);
}