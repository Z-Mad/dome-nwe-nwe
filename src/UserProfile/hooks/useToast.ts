import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  return { toastMsg, showToast };
};