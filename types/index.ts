export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  settings: {
    currency: string;
    timezone: string;
    lowStockThreshold: number;
    maxUsers: number;
    maxItems: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ceo' | 'admin' | 'purchasing_officer' | 'administrative_staff' | 'warehouse_staff';
  tenantId: string | null; // null for CEO role
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  invitedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantInvitation {
  id: string;
  email: string;
  tenantId: string;
  role: 'admin' | 'purchasing_officer' | 'administrative_staff' | 'warehouse_staff';
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku: string;
  categoryId: string;
  supplierId: string;
  warehouseId?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  costPrice: number;
  images: string[];
  status: 'active' | 'inactive' | 'discontinued';
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  supplier?: Supplier;
  warehouse?: Warehouse;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  totalAmount: number;
  tenantId: string;
  items: PurchaseOrderItem[];
  supplier?: Supplier;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  inventoryItem?: InventoryItem;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  fromTenantId?: string;
  toTenantId?: string;
  status: 'pending' | 'in_transit' | 'received' | 'cancelled';
  transferDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  notes?: string;
  tenantId: string;
  items: TransferItem[];
  fromWarehouse?: Warehouse;
  toWarehouse?: Warehouse;
  fromTenant?: Tenant;
  toTenant?: Tenant;
  createdBy: string;
  receivedBy?: string;
}

export interface TransferItem {
  id: string;
  transferId: string;
  inventoryItemId: string;
  quantity: number;
  receivedQuantity: number;
  notes?: string;
  inventoryItem?: InventoryItem;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer_out' | 'transfer_in' | 'disposal';
  quantity: number;
  reason: string;
  reference?: string;
  transferId?: string;
  disposalReason?: string;
  date: Date;
  tenantId: string;
  warehouseId?: string;
  inventoryItem?: InventoryItem;
  warehouse?: Warehouse;
}

export interface Disposal {
  id: string;
  disposalNumber: string;
  inventoryItemId: string;
  quantity: number;
  reason: 'expired' | 'damaged' | 'obsolete' | 'quality_issue' | 'other';
  description: string;
  disposalDate: Date;
  approvedBy?: string;
  cost?: number;
  tenantId: string;
  warehouseId?: string;
  inventoryItem?: InventoryItem;
  warehouse?: Warehouse;
}

export interface PendingReceiving {
  id: string;
  type: 'purchase_order' | 'transfer';
  referenceId: string;
  referenceNumber: string;
  expectedDate?: Date;
  status: 'pending' | 'partial' | 'completed';
  totalItems: number;
  receivedItems: number;
  tenantId: string;
  warehouseId?: string;
  supplier?: Supplier;
  fromWarehouse?: Warehouse;
  fromTenant?: Tenant;
}

export interface PlanFeatures {
  maxUsers: number;
  maxItems: number;
  maxSuppliers: number;
  analytics: boolean;
  apiAccess: boolean;
  customReports: boolean;
  prioritySupport: boolean;
  customIntegrations: boolean;
}

export interface Plan {
  id: string;
  name: string;
  features: PlanFeatures;
  popular?: boolean;
}

// Role permissions interface
export interface RolePermissions {
  canViewAllCompanies: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canViewInventory: boolean;
  canManageInventory: boolean;
  canManagePurchasing: boolean;
  canViewAnalytics: boolean;
  canManageSuppliers: boolean;
  canManageCategories: boolean;
  canManageWarehouses: boolean;
  canManageTransfers: boolean;
  canReceiveStock: boolean;
  canDisposeStock: boolean;
}

// Helper function to get role permissions
export const getRolePermissions = (role: User['role']): RolePermissions => {
  switch (role) {
    case 'ceo':
      // CEO can see and manage everything across all companies
      return {
        canViewAllCompanies: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewInventory: true,
        canManageInventory: true,
        canManagePurchasing: true,
        canViewAnalytics: true,
        canManageSuppliers: true,
        canManageCategories: true,
        canManageWarehouses: true,
        canManageTransfers: true,
        canReceiveStock: true,
        canDisposeStock: true,
      };
    case 'admin':
      // Company Admin manages everything within their company
      return {
        canViewAllCompanies: false,
        canManageUsers: true,
        canManageSettings: true,
        canViewInventory: true,
        canManageInventory: true,
        canManagePurchasing: true,
        canViewAnalytics: true,
        canManageSuppliers: true,
        canManageCategories: true,
        canManageWarehouses: true,
        canManageTransfers: true,
        canReceiveStock: true,
        canDisposeStock: true,
      };
    case 'purchasing_officer':
      // Purchasing Officer manages purchasing functions and can view inventory for purchasing decisions
      return {
        canViewAllCompanies: false,
        canManageUsers: false,
        canManageSettings: false,
        canViewInventory: true, // Can view inventory to see stock levels
        canManageInventory: false, // Cannot modify inventory directly
        canManagePurchasing: true,
        canViewAnalytics: true,
        canManageSuppliers: true,
        canManageCategories: false,
        canManageWarehouses: false,
        canManageTransfers: false,
        canReceiveStock: false,
        canDisposeStock: false,
      };
    case 'administrative_staff':
      // Administrative Staff manages inventory for their company
      return {
        canViewAllCompanies: false,
        canManageUsers: false,
        canManageSettings: false,
        canViewInventory: true,
        canManageInventory: true,
        canManagePurchasing: false,
        canViewAnalytics: true,
        canManageSuppliers: false,
        canManageCategories: true,
        canManageWarehouses: false,
        canManageTransfers: false,
        canReceiveStock: true,
        canDisposeStock: true,
      };
    case 'warehouse_staff':
      // Warehouse Staff handles receiving, transfers, and disposal
      return {
        canViewAllCompanies: false,
        canManageUsers: false,
        canManageSettings: false,
        canViewInventory: true,
        canManageInventory: false, // Cannot create/edit items, only move stock
        canManagePurchasing: false,
        canViewAnalytics: false,
        canManageSuppliers: false,
        canManageCategories: false,
        canManageWarehouses: false,
        canManageTransfers: true, // Can process transfers
        canReceiveStock: true,
        canDisposeStock: true,
      };
    default:
      return {
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
  }
};