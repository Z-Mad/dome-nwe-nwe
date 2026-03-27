import { useState, useEffect } from 'react';

export const useBuyerResources = (globalResources: any[]) => {
  const [localResources, setLocalResources] = useState<any[]>(globalResources);
  const [resourceSubTab, setResourceSubTab] = useState<'purchased' | 'favorites'>('purchased');
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(null);
  const [editingInstanceName, setEditingInstanceName] = useState('');
  const [activatingInstanceId, setActivatingInstanceId] = useState<string | null>(null);
  const [activatingInstanceName, setActivatingInstanceName] = useState('');

  useEffect(() => {
    setLocalResources(globalResources);
  }, [globalResources]);

  const updateResource = (resourceId: string, updates: any) => {
    setLocalResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, ...updates } : r))
    );
  };

  const addResource = (resource: any) => {
    setLocalResources((prev) => [resource, ...prev]);
  };

  return {
    localResources,
    setLocalResources,
    resourceSubTab,
    setResourceSubTab,
    editingInstanceId,
    setEditingInstanceId,
    editingInstanceName,
    setEditingInstanceName,
    activatingInstanceId,
    setActivatingInstanceId,
    activatingInstanceName,
    setActivatingInstanceName,
    updateResource,
    addResource,
  };
};