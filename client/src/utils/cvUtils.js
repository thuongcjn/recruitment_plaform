import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a multi-page PDF from an HTML element with fixed layout protection
 */
export const generatePDF = async (elementId, filename = 'my-cv.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  // Reset scroll to top
  window.scrollTo(0, 0);

  try {
    // Standard A4 width in pixels at 96dpi
    const a4WidthPx = 794;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      // Force capture at A4 width
      width: a4WidthPx,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '20mm';
          clonedElement.style.width = '794px'; // Fixed width in pixels
          clonedElement.style.height = 'auto';
          clonedElement.style.minHeight = '1123px';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.display = 'block';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.position = 'relative';
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Page 1
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Pages 2+
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};
