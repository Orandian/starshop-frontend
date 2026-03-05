import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generate PDF from a HTML element
 * @param element The container element to capture
 * @param fileName The name of the generated PDF file
 * @author Phway
 * @created 2025-11-25
 * @updated 2025-11-25
 */
export const generatePDF = async (element: HTMLElement, fileName: string) => {
  const content = element.cloneNode(true) as HTMLElement;
  // Create a temporary container to prevent layout issues
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "210mm"; // A4 width
  tempDiv.style.minHeight = "297mm"; // A4 height
  tempDiv.style.padding = "32px";
  tempDiv.style.boxSizing = "border-box";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.backgroundColor = "white";
  tempDiv.style.top = "0";

  tempDiv.appendChild(content);
  document.body.appendChild(tempDiv);

  try {
    // Wait for all images to load
    const images = tempDiv.getElementsByTagName("img");
    if (images.length > 0) {
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Resolve even if image fails to load
        });
      });

      await Promise.all(imagePromises);
    }

    // Add a small delay to ensure everything is rendered
    await new Promise((resolve) => setTimeout(resolve, 500));
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // better quality, prevents blur
      useCORS: true,
      backgroundColor: "#fff",
      removeContainer: true, // IMPORTANT
      logging: false,
      allowTaint: true,
      // Optimize rendering
      imageTimeout: 15000, // 15s timeout for images
      onclone: (clonedDoc) => {
        // Hide any elements that don't need to be in the PDF
        const elementsToHide = clonedDoc.querySelectorAll(
          ".no-print, [data-no-pdf]"
        );
        elementsToHide.forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      },
    });

    const imgData = canvas.toDataURL("image/png",0.85); //85% quality
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * pageWidth) / canvas.width;
    // If the calculated height is greater than A4 height, scale it down
    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      imgWidth = imgWidth * scale;
      imgHeight = pageHeight;
    }

    // Position at top of page
    const x = (pageWidth - imgWidth) / 2; // Center horizontally
    const y = 0; // Align to top

    let position = 0;
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");

    while (imgHeight > pageHeight) {
      position = imgHeight - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", x, position, imgWidth, pageHeight);
      imgHeight -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    document.body.removeChild(tempDiv);
  }
};
