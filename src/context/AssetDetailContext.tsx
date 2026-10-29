import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { IntegrationAsset } from '@/data/integrations';

interface AssetDetailContextValue {
  selectedAsset: IntegrationAsset | null;
  openDetail: (asset: IntegrationAsset) => void;
  closeDetail: () => void;
}

const AssetDetailContext = createContext<AssetDetailContextValue | undefined>(undefined);

export function AssetDetailProvider({ children }: { children: ReactNode }) {
  const [selectedAsset, setSelectedAsset] = useState<IntegrationAsset | null>(null);

  const openDetail = useCallback((asset: IntegrationAsset) => setSelectedAsset(asset), []);
  const closeDetail = useCallback(() => setSelectedAsset(null), []);

  const value = useMemo<AssetDetailContextValue>(
    () => ({ selectedAsset, openDetail, closeDetail }),
    [selectedAsset, openDetail, closeDetail],
  );

  return <AssetDetailContext.Provider value={value}>{children}</AssetDetailContext.Provider>;
}

export function useAssetDetail(): AssetDetailContextValue {
  const ctx = useContext(AssetDetailContext);
  if (!ctx) throw new Error('useAssetDetail must be used within an AssetDetailProvider');
  return ctx;
}
