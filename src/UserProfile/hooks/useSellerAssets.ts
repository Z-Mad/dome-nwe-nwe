import { useState, useEffect } from 'react';
import { RICH_ASSETS_MOCK } from '../constants/profile';
import type { SellerAsset } from '../types/profile';

export const useSellerAssets = (extraAssets: any[]) => {
  const [sellerAssets, setSellerAssets] = useState<SellerAsset[]>(RICH_ASSETS_MOCK);
  const [sellerAssetFilter, setSellerAssetFilter] = useState('all');

  useEffect(() => {
    if (extraAssets.length > 0) {
      const newRichAssets = extraAssets.map((a) => ({
        id: a.id,
        title: a.title,
        status: a.status === 'live' ? 'live' : 'review',
        category: a.type,
        desc: a.desc || 'No description',
        versions: [
          {
            ver: a.currentVersion || 'v1.0.0',
            date: new Date().toISOString().split('T')[0],
            health: 100,
            installs: 0,
            status: 'active',
            log: 'Initial release',
          },
        ],
      }));
      const combined = [
        ...RICH_ASSETS_MOCK,
        ...newRichAssets.filter((na) => !RICH_ASSETS_MOCK.find((ra) => ra.title === na.title)),
      ];
      setSellerAssets(combined);
    }
  }, [extraAssets]);

  const updateAsset = (assetId: string, updates: Partial<SellerAsset>) => {
    setSellerAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, ...updates } : a))
    );
  };

  const deleteAsset = (assetId: string) => {
    setSellerAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  return {
    sellerAssets,
    sellerAssetFilter,
    setSellerAssetFilter,
    updateAsset,
    deleteAsset,
  };
};