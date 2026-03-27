import { useState } from 'react';
import { INITIAL_INVOICES } from '../constants/profile';
import type { BuyerInvoice } from '../types/profile';

export const useBuyerInvoices = () => {
  const [invoices, setInvoices] = useState<BuyerInvoice[]>(INITIAL_INVOICES);
  const [invoiceSubTab, setInvoiceSubTab] = useState<'invoiceable' | 'history'>('invoiceable');

  const addInvoice = (invoice: BuyerInvoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  };

  return { invoices, setInvoices, invoiceSubTab, setInvoiceSubTab, addInvoice };
};