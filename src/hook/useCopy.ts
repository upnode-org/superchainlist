import { useEffect, useState } from "react";

interface UseCopyOptions {
  resetAfter?: number; // Time in milliseconds to reset `hasCopied`
  onSuccess?: (data: string) => void; // Callback for successful copy
  onError?: () => void; // Callback for failed copy
}

interface UseCopyReturn {
  hasCopied: boolean; // State indicating if data has been copied
  onCopy: (data: string | object) => Promise<void>; // Function to copy data
}

export const useCopy = (options?: UseCopyOptions): UseCopyReturn => {
  const [hasCopied, setHasCopied] = useState(false);

  const resetAfter = options?.resetAfter ?? 1000;
  const onSuccess = options?.onSuccess;
  const onError = options?.onError;

  useEffect(() => {
    if (hasCopied && resetAfter) {
      const handler = setTimeout(() => {
        setHasCopied(false);
      }, resetAfter);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [hasCopied, resetAfter]);

  return {
    hasCopied,
    onCopy: async (data: string | object) => {
      try {
        const stringData = typeof data === "string" ? data : JSON.stringify(data);

        await navigator.clipboard.writeText(stringData);

        setHasCopied(true);

        if (onSuccess) {
          onSuccess(stringData);
        }
      } catch {
        if (onError) {
          onError();
        }
      }
    },
  };
};
