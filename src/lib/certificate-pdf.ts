import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function downloadCertificatePdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Certificate element not found');

  try {
    // Wait for fonts
    await document.fonts.ready;
    
    // Convert to high quality PNG (scale up for better resolution)
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });

    // A4 landscape dimensions in mm (297 x 210)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
    
    const safeFilename = filename.replace(/[^a-z0-9أ-ي\s-]/gi, '').replace(/\s+/g, '-');
    pdf.save(`${safeFilename}.pdf`);
  } catch (err) {
    console.error('PDF Generation failed:', err);
    throw new Error('تعذر تجهيز ملف PDF، برجاء المحاولة مرة أخرى.');
  }
}
