import { useState } from 'react';
import { INITIAL_INVOICE_HEADERS } from '../constants/profile';
import type { InvoiceHeader } from '../types/profile';

export const useInvoiceHeaders = () => {
  const [invoiceHeaders, setInvoiceHeaders] = useState<InvoiceHeader[]>(INITIAL_INVOICE_HEADERS);
  const [selectedHeaderId, setSelectedHeaderId] = useState('h1');
  const [editingInvoiceHeader, setEditingInvoiceHeader] = useState<InvoiceHeader | null>(null);
  const [showInvoiceHeaderForm, setShowInvoiceHeaderForm] = useState(false);

  const addHeader = (header: InvoiceHeader) => {
    setInvoiceHeaders((prev) => [...prev, header]);
  };

  const updateHeader = (id: string, updates: Partial<InvoiceHeader>) => {
    setInvoiceHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const deleteHeader = (id: string) => {
    setInvoiceHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  return {
    invoiceHeaders,
    setInvoiceHeaders,
    selectedHeaderId,
    setSelectedHeaderId,
    editingInvoiceHeader,
    setEditingInvoiceHeader,
    showInvoiceHeaderForm,
    setShowInvoiceHeaderForm,
    addHeader,
    updateHeader,
    deleteHeader,
  };
};