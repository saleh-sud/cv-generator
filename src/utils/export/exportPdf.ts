import { downloadSelectablePdf } from "../pdf/pdfGenerator";

/**
 * Wraps our high-fidelity, Arabic-unicode compliant pdfMake implementation
 */
export const exportPdf = downloadSelectablePdf;
