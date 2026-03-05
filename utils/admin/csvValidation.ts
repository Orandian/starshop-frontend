import { CSVRow, ValidationResult } from "@/types/admin/csvData.type";

export const parseCSV = (content: string): CSVRow[] => {
  // Split by lines and filter out empty lines
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  if (lines.length < 4) {
    return []; // Need at least 2 headers + 1 data row + 1 summary row
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const requiredColumns = ["注文ID", "運送会社", "伝票番号", "発送日"];

  // Find the indices of the required columns
  const columnIndices: Record<string, number> = {};
  requiredColumns.forEach((col) => {
    const index = headers.findIndex((header) => header === col);
    if (index !== -1) {
      columnIndices[col] = index;
    }
  });

  // Skip first 2 headers
  let dataLines = lines.slice(2);

  // Filter out empty rows and conditionally remove summary row
  if (dataLines.length > 0) {
    dataLines = dataLines.filter((line, index) => {
      const values = parseCSVLine(line);

      // Check if this is the last row and it's a summary row (発送日 column contains "合計")
      const isLastRow = index === dataLines.length - 1;
      const shippingDateIndex = columnIndices["発送日"];
      const isSummaryRow =
        isLastRow &&
        shippingDateIndex !== undefined &&
        values[shippingDateIndex]?.trim() === "合計";

      // Skip summary rows
      if (isSummaryRow) {
        return false;
      }

      // Skip rows where all required columns are empty
      const hasAnyData = requiredColumns.some((col) => {
        const colIndex = columnIndices[col];
        return colIndex !== undefined && values[colIndex]?.trim() !== "";
      });

      return hasAnyData;
    });
  }

  return dataLines.map((line) => {
    const values = parseCSVLine(line);
    const row: CSVRow = {
      注文ID:
        columnIndices["注文ID"] !== undefined
          ? values[columnIndices["注文ID"]] || ""
          : "",
      運送会社:
        columnIndices["運送会社"] !== undefined
          ? values[columnIndices["運送会社"]] || ""
          : "",
      伝票番号:
        columnIndices["伝票番号"] !== undefined
          ? values[columnIndices["伝票番号"]] || ""
          : "",
      発送日:
        columnIndices["発送日"] !== undefined
          ? values[columnIndices["発送日"]] || ""
          : "",
    };
    return row;
  });
};
/**
 * Validate CSV data for order shipping information
 * @param csvData - The CSV data as a string
 * @returns ValidationResult
 * @author Phway
 */
export const validateCSVData = (data: CSVRow[]): ValidationResult => {
  const errors: string[] = [];
  const validData: CSVRow[] = [];
  data.forEach((row, index) => {
    const rowNum = index + 3; // +3 for 2 headers and 0-based index
    const rowErrors: string[] = [];
    // Check if empty and validate order ID
    if (!row.注文ID) {
      rowErrors.push(
        `行 ${rowNum}: ID "${row.注文ID}" が注文データに存在しません`,
      );
    } else {
      //validate format 20260120-12
      const idPattern = /^\d{8}-\d{1,}$/;
      if (!idPattern.test(row.注文ID)) {
        rowErrors.push(
          `行 ${rowNum}: ID "${row.注文ID}" の形式が正しくありません。例: 20260120-12`,
        );
      } else {
        //extract id number after hyphen and check
        const idNumberPart = row.注文ID.split("-")[1];
        if (!idNumberPart) {
          rowErrors.push(
            `行 ${rowNum}: ID "${row.注文ID}" が注文データに存在しません`,
          );
        } else {
          //replce 注文ID with id number part for valid data
          row.注文ID = idNumberPart;
        }
      }
    }
    // check if shipping company, tracking number, shipping date are present
    if (!row.運送会社) {
      rowErrors.push(`行 ${rowNum}: 配送会社 は必須です`);
    }
    if (!row.伝票番号) {
      rowErrors.push(`行 ${rowNum}: 追跡番号 は必須です`);
    }
    if (!row.発送日) {
      rowErrors.push(`行 ${rowNum}: 発送日 は必須です`);
    }
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      validData.push(row);
    }
  });
  return {
    isValid: errors.length === 0,
    errors,
    validData,
  };
};

/**
 * validte csv content
 */
export const validateCSVContent = (
  content: string,
): { isValid: boolean; error?: string } => {
  if (!content || content.trim() === "") {
    return {
      isValid: false,
      error: "CSVファイルが空です。データを入力してください。",
    };
  }

  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    return {
      isValid: false,
      error: "CSVファイルにはヘッダー行と少なくとも1行のデータが必要です。",
    };
  }

  return { isValid: true };
};

/**
 * helper function for quoted fields
 * @param line
 * @returns
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}
