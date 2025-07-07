'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/tenant-context';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Building2,
  Crown,
  ArrowUpDown,
  PackageCheck,
  ArrowRightLeft,
  Trash2,
  User
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { currentTenant, currentUser, permissions, isCEO } = useTenant();

  // Define navigation items with permission checks
  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      show: true 
    },
    { 
      name: 'Inventory', 
      href: '/inventory', 
      icon: Package,
      show: permissions.canViewInventory 
    },
    { 
      name: 'Issuances', 
      href: '/issuances', 
      icon: User,
      show: permissions.canViewInventory 
    },
    { 
      name: 'Stock Movements', 
      href: '/stock-movements', 
      icon: ArrowUpDown,
      show: permissions.canViewInventory 
    },
    { 
      name: 'Receiving', 
      href: '/receiving', 
      icon: PackageCheck,
      show: permissions.canReceiveStock 
    },
    { 
      name: 'Transfers', 
      href: '/transfers', 
      icon: ArrowRightLeft,
      show: permissions.canManageTransfers || permissions.canViewInventory 
    },
    { 
      name: 'Disposal', 
      href: '/disposal', 
      icon: Trash2,
      show: permissions.canDisposeStock 
    },
    { 
      name: 'Categories', 
      href: '/categories', 
      icon: Tags,
      show: permissions.canManageCategories 
    },
    { 
      name: 'Suppliers', 
      href: '/suppliers', 
      icon: Truck,
      show: permissions.canManageSuppliers 
    },
    { 
      name: 'Purchase Orders', 
      href: '/purchase-orders', 
      icon: ShoppingCart,
      show: permissions.canManagePurchasing 
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: BarChart3,
      show: permissions.canViewAnalytics 
    },
    { 
      name: 'Users', 
      href: '/users', 
      icon: Users,
      show: permissions.canManageUsers 
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      show: permissions.canManageSettings 
    },
  ];

  // Filter navigation items based on permissions
  const navigation = navigationItems.filter(item => item.show);

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo and Tenant Info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            InventoryPro
          </h1>
          {currentTenant && (
            <p className="text-sm text-gray-500 truncate">{currentTenant.name}</p>
          )}
          {isCEO && (
            <div className="flex items-center gap-1 mt-1">
              <Crown className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-700 font-medium">CEO Access</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Badge */}
      {currentUser && (
        <div className="px-6 py-3 border-b border-gray-100">
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            currentUser.role === 'ceo' && "bg-purple-100 text-purple-800",
            currentUser.role === 'admin' && "bg-blue-100 text-blue-800",
            currentUser.role === 'purchasing_officer' && "bg-green-100 text-green-800",
            currentUser.role === 'administrative_staff' && "bg-orange-100 text-orange-800",
            currentUser.role === 'warehouse_staff' && "bg-teal-100 text-teal-800"
          )}>
            {currentUser.role === 'ceo' && 'CEO'}
            {currentUser.role === 'admin' && 'Admin'}
            {currentUser.role === 'purchasing_officer' && 'Purchasing Officer'}
            {currentUser.role === 'administrative_staff' && 'Administrative Staff'}
            {currentUser.role === 'warehouse_staff' && 'Warehouse Staff'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}