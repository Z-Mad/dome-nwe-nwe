import { useState } from 'react';

import type { ModalType } from '../types/profile';

export const useModal = () => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const openModal = (type: ModalType, item: any = null, subItem: any = null) => {
    setSelectedItem(item);
    if (subItem) setSelectedVersion(subItem);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal('none');
    setSelectedItem(null);
    setSelectedVersion(null);
  };

  return {
    activeModal,
    selectedItem,
    selectedVersion,
    openModal,
    closeModal,
    setSelectedItem,
  };
};