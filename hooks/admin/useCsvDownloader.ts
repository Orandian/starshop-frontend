import { UseMutateFunction } from "@tanstack/react-query";
import { useState, useCallback } from "react";

export const useCsvDownloader = <T = Blob>(
  mutateFn: UseMutateFunction<T, Error, void, unknown>
) => {
  const [status, setStatus] = useState<"idle" | "downloading" | "success" | "error">("idle");

  const downloadCsv = useCallback(
    (payload?: void, fileName?: string, options?: { onSuccess?: () => void; onError?: (err: unknown) => void }) => {
      setStatus("downloading");

      mutateFn(payload, {
        onSuccess: (res) => {
          if (res instanceof Blob) {
            const url = window.URL.createObjectURL(res);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName || "export"}_${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          }

          setStatus("success");
          options?.onSuccess?.();
        },
        onError: (err) => {
          setStatus("error");
          options?.onError?.(err);
        },
      });
    },
    [mutateFn]
  );

  return {
    downloadCsv,
    status,
    isDownloading: status === "downloading",
    isSuccess: status === "success",
    isError: status === "error",
  };
};

