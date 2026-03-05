import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (element: HTMLElement, fileName: string, mode?: "portrait" | "landscape") => {
  // Create a deep clone of the element to avoid modifying the original
  const content = element.cloneNode(true) as HTMLElement;

  // Add a class to the content to indicate PDF generation
  content.classList.add("generating-pdf");

  // Create a temporary container
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "fixed";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "0";
  tempDiv.style.width = mode === "landscape" ? "1123px" : "794px"; // A4 width in pixels at 96dpi
  tempDiv.style.backgroundColor = "white";
  document.body.appendChild(tempDiv);
  tempDiv.appendChild(content);

  try {
    // Force a repaint to ensure all styles are applied
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Use html2canvas with options to handle unsupported CSS
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      // Remove unsupported CSS properties
      onclone: (clonedDoc) => {
        // Remove any elements with 'oklch' in their style
        const elements = clonedDoc.querySelectorAll("*");
        elements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const props = [
            "color",
            "background-color",
            "border-color",
            "fill",
            "stroke",
          ];

          props.forEach((prop) => {
            const value = style.getPropertyValue(prop);
            if (value && value.includes("oklch")) {
              // Replace oklch with a fallback color
              if (prop === "background-color") {
                el.setAttribute("style", "background-color: #ffffff");
              } else {
                el.setAttribute("style", "color: #000000");
              }
            }
          });
        });
      },
    });

    // Convert canvas to PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF(mode === "landscape" ? "l" : "p", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imageHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imageHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 40;
    const contentHeight = pageHeight - 2 * margin;

    // Add first page
    if (heightLeft < contentHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imageHeight);
    } else {
      const pageContentHeight = Math.min(heightLeft, contentHeight);
      while (heightLeft > 0) {
        pdf.addImage(
          imgData,
          "PNG",
          margin, // x position with left margin
          margin - position, // y position with top margin
          pdfWidth - 2 * margin, // width with left and right margins
          pageContentHeight,
          undefined,
          "FAST"
        );

        heightLeft -= pageContentHeight;
        position -= pageContentHeight;

        // Check if there's still content to add
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    // Clean up
    if (tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }
  }
};
