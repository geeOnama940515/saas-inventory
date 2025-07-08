'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, User, getRolePermissions, RolePermissions } from '@/types';
import { useAuth } from './auth-context';

interface TenantContextType {
  currentTenant: Tenant | null;
  currentUser: User | null;
  tenants: Tenant[];
  permissions: RolePermissions;
  switchTenant: (tenantId: string) => void;
  isLoading: boolean;
  isCEO: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Mock data - in production, this would come from your API/database
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    plan: 'enterprise',
    status: 'active',
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      lowStockThreshold: 10,
      maxUsers: -1,
      maxItems: -1,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'TechStart Inc',
    slug: 'techstart',
    plan: 'pro',
    status: 'active',
    settings: {
      currency: 'USD',
      timezone: 'America/Los_Angeles',
      lowStockThreshold: 5,
      maxUsers: 25,
      maxItems: 10000,
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Global Retail Co',
    slug: 'global-retail',
    plan: 'starter',
    status: 'active',
    settings: {
      currency: 'EUR',
      timezone: 'Europe/London',
      lowStockThreshold: 15,
      maxUsers: 5,
      maxItems: 1000,
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Load tenant data based on authenticated user
      setTenants(mockTenants);
      
      if (currentUser.role === 'ceo') {
        // CEO can see all companies, start with first one
        setCurrentTenant(mockTenants[0]);
      } else {
        // Company user sees their assigned company
        const userTenant = mockTenants.find(t => t.id === currentUser.tenantId);
        setCurrentTenant(userTenant || null);
      }
      
      setIsLoading(false);
    } else {
      // User not authenticated, reset tenant data
      setCurrentTenant(null);
      setTenants([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const switchTenant = (tenantId: string) => {
    // Only CEO can switch between tenants
    if (currentUser?.role === 'ceo') {
      const tenant = tenants.find(t => t.id === tenantId);
      if (tenant) {
        setCurrentTenant(tenant);
      }
    }
  };

  const permissions = currentUser ? getRolePermissions(currentUser.role) : {
    canViewAllCompanies: false,
    canManageUsers: false,
    canManageSettings: false,
    canViewInventory: false,
    canManageInventory: false,
    canManagePurchasing: false,
    canViewAnalytics: false,
    canManageSuppliers: false,
    canManageCategories: false,
    canManageWarehouses: false,
    canManageTransfers: false,
    canReceiveStock: false,
    canDisposeStock: false,
  };

  const isCEO = currentUser?.role === 'ceo';

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        currentUser,
        tenants,
        permissions,
        switchTenant,
        isLoading,
        isCEO,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}