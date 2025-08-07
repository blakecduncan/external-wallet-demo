import { useState, useCallback } from "react";

interface Toast {
  text: string;
  type: "success" | "error" | "info";
  open: boolean;
}

export function useToast() {
  const [toast, setToastState] = useState<Toast>({
    text: "",
    type: "info",
    open: false,
  });

  const setToast = useCallback((newToast: Partial<Toast>) => {
    setToastState((prev) => ({ ...prev, ...newToast }));

    // Auto hide after 3 seconds
    if (newToast.open) {
      setTimeout(() => {
        setToastState((prev) => ({ ...prev, open: false }));
      }, 3000);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  return { toast, setToast, hideToast };
}
