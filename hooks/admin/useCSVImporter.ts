import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  parseCSV,
  validateCSVData,
  validateCSVContent,
} from "@/utils/admin/csvValidation";
import { useImportCSVData } from "@/hooks/admin/useOrder";
import { ImportCSVResponse } from "@/types/admin/csvData.type";

export const useCSVImporter = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: importCSVData } = useImportCSVData();

  const handleCSVUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const loadingToastId = toast.loading("CSVファイルを解析中...");
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const contentValidation = validateCSVContent(content);
          if (!contentValidation.isValid) {
            toast.error(
              `CSVファイルの形式が正しくありません: ${contentValidation.error}`,
            );
            toast.dismiss(loadingToastId);
            return;
          }
          const data = parseCSV(content);
          const result = validateCSVData(data);
          toast.dismiss(loadingToastId);

          if (!result.isValid) {
            const errorMessage = result.errors.slice(0, 5).join("\n");
            const moreErrors =
              result.errors.length > 5
                ? `\n... 他 ${result.errors.length - 5} 件のエラー`
                : "";
            toast.error(`検証エラー:\n${errorMessage}${moreErrors}`);
          } else {
            //call api
            setIsImporting(true);
            const importingToastId =
              toast.loading("CSVデータをインポート中...");
            importCSVData(result.validData, {
              onSuccess: (response: ImportCSVResponse) => {
                toast.dismiss(importingToastId);
                const { successCount, failureCount, errors } = response.data;

                if (failureCount === 0) {
                  setIsSuccess(true);
                  // All successful
                  toast.success(
                    `${successCount}行のデータをインポートしました`,
                  );
                } else {
                  // Partial success or all failed
                  if (successCount > 0) {
                    setIsSuccess(true);
                    // Partial success
                    toast.warning(
                      `${successCount}行成功、${failureCount}行失敗\n` +
                        (errors?.slice(0, 3).join("\n") || ""),
                    );
                  } else {
                    // All failed
                    toast.error(
                      `インポート失敗\n` +
                        (errors?.slice(0, 5).join("\n") ||
                          "エラーが発生しました"),
                    );
                  }
                }
              },
              onError: (error) => {
                toast.dismiss(importingToastId);
                const message =
                  error.message || "CSVデータのインポートに失敗しました";
                toast.error(message);
              },
              onSettled: () => {
                setIsImporting(false);
              },
            });
          }
        } catch (error) {
          toast.dismiss(loadingToastId);
          toast.error("CSVファイルの解析に失敗しました");
          console.error("CSV parse error:", error);
        } finally {
          setIsUploading(false);
          e.target.value = "";
        }
      };
      reader.readAsText(file);
    },
    [importCSVData],
  );
  return {
    fileInputRef,
    handleCSVUpload,
    handleFileChange,
    isSuccess,
    isUploading: isUploading || isImporting,
  };
};
