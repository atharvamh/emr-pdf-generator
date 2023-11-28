/* eslint-disable @typescript-eslint/no-explicit-any */

import jsPDF from "jspdf";
import { IChamberReadings, IOtherEchoFindings, IPatientInformation } from "../interfaces/app-interfaces";

const pdfTitle = "2D Echocardiography & Colour Doppler Report";
const pdfFontName = "helvetica";

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

  setChamberReadings = (ao: string | number, la: string | number, lvidd: string | number, ivsd: string | number, 
    pwd: string | number, ra: string | number, rv: string | number, background? : string) => {
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

    const equiPartWidth = this.pageWidth / 7;
    this._pdfContext.text(`Ao = ${ao}cm`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`LA = ${la}cm`, this.margin + equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`LVIDd = ${lvidd}cm`, this.margin + 2 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`IVSd = ${ivsd}cm`, this.margin + 3 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`PWd = ${pwd}cm`, this.margin + 4 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`RA = ${ra}cm`, this.margin + 5 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`RV = ${rv}cm`, this.margin + 6 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);

    this.usedSpaceFromTop += (sectionOffset * 3);
  }

  setOtherReadings = (iasreading: string, valves: string, valveDetails: string, rwma: string, lvef: number | string, 
    rvef: number | string, tapse: number | string, ivc: number | string, collapse: number | string) => {
    const sectionOffset = 2;
    const lineHeight = 3;

    this._pdfContext.text(`IAS/IVS: ${iasreading}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.text(`Valves: ${valves}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
    
    const splitDetails = this._pdfContext.splitTextToSize(valveDetails, this.pageWidth);
    this._pdfContext.text(splitDetails, this.margin, this.usedSpaceFromTop + sectionOffset, { maxWidth : this.pageWidth });

    this.usedSpaceFromTop += (sectionOffset * 3) + (splitDetails.length * lineHeight);
    this._pdfContext.text(`RWMA: ${rwma}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    const equiPartWidth = this.pageWidth / 3;
    this._pdfContext.text(`LVEF = ${lvef} %`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`RVEF = ${rvef} %`, this.margin + equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this._pdfContext.text(`(TAPSE = ${tapse}cm)`, this.margin + 2 * equiPartWidth, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text(`IVC = ${ivc}cm & collapsing > ${collapse} %`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
  }

  setDopplerFindings = (septalReading: string, flowReading: string, avgradient: number, pasp: number) => {
    const sectionOffset = 2;
    this._pdfContext.setFont(pdfFontName, "bold");
    this._pdfContext.setFontSize(12);

    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.text("Doppler Findings", this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);

    this._pdfContext.setFont(pdfFontName, "normal");
    this._pdfContext.setFontSize(10);

    this._pdfContext.text(`${septalReading} cm/sec`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.text(`Flow across valves: ${flowReading}`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.text(`AV max gradient = ${avgradient} mm of Hg`, this.margin, this.usedSpaceFromTop + sectionOffset);
    this.usedSpaceFromTop += (sectionOffset * 3);
    this._pdfContext.text(`PASP = ${pasp} mm of Hg`, this.margin, this.usedSpaceFromTop + sectionOffset);

  }

  previewPdf = () => {
    const pdfDataUrl = this._pdfContext.output('dataurlstring');
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = pdfDataUrl;

    document.body.appendChild(iframe);
  }
}

export const generatePdf = (patientDetails: IPatientInformation, chamberReadings: IChamberReadings,
  otherEchoReadings: IOtherEchoFindings) => {
  const pdfgen = new PdfGenerator();
  pdfgen.setTitle(pdfTitle);
  pdfgen.setPatientInfoSection(patientDetails.salutation + " " + patientDetails.name, patientDetails.age, patientDetails.gender);
  pdfgen.setChamberReadings(
    chamberReadings.ao, chamberReadings.la, chamberReadings.lvidd, 
    chamberReadings.ivsd, chamberReadings.pwd, 
    chamberReadings.ra, chamberReadings.rv, chamberReadings.background
  );
  pdfgen.setOtherReadings(
    otherEchoReadings.iasreading,
    otherEchoReadings.valves,
    otherEchoReadings.valveDetails,
    otherEchoReadings.rwma,
    otherEchoReadings.lvef,
    otherEchoReadings.rvef,
    otherEchoReadings.tapse,
    otherEchoReadings.ivc,
    otherEchoReadings.collapse
  );
  pdfgen.setDopplerFindings(
    "E<A, septal",
    "Trace MR, Trace TR, Trivial AR",
    6, 15
  );
  pdfgen._pdfContext.save(`${patientDetails.name ? patientDetails.name : "Patient"}_Echo_Report.pdf`);
}