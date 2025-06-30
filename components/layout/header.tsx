'use client';

import React from 'react';
import { useTenant } from '@/contexts/tenant-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, ChevronDown, Search, Menu, Building2, Crown, LogOut, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { currentUser, currentTenant, tenants, switchTenant, isCEO } = useTenant();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Mobile menu and search */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            placeholder="Search inventory..."
            className="pl-10 w-full md:w-80"
          />
        </div>
      </div>

      {/* Right side - Company switcher, notifications and user menu */}
      <div className="flex items-center gap-4">
        {/* Company Switcher - Only for CEO */}
        {isCEO && tenants.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building2 className="h-4 w-4" />
                {currentTenant?.name || 'Select Company'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                Switch Company
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenants.map((tenant) => (
                <DropdownMenuItem
                  key={tenant.id}
                  onClick={() => switchTenant(tenant.id)}
                  className={currentTenant?.id === tenant.id ? 'bg-blue-50' : ''}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{tenant.name}</span>
                    <span className="text-sm text-gray-500 capitalize">
                      {tenant.status}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {currentUser?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role === 'ceo' && 'CEO'}
                  {currentUser?.role === 'admin' && 'Admin'}
                  {currentUser?.role === 'purchasing_officer' && 'Purchasing Officer'}
                  {currentUser?.role === 'administrative_staff' && 'Administrative Staff'}
                  {currentUser?.role === 'warehouse_staff' && 'Warehouse Staff'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            {isCEO && (
              <DropdownMenuItem>System Administration</DropdownMenuItem>
            )}
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}