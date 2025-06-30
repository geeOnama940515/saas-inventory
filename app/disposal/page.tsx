'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus,
  Trash2, 
  AlertTriangle,
  Search, 
  Filter,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';
import { Disposal } from '@/types';
import { useTenant } from '@/contexts/tenant-context';
import { CreateDisposalModal } from '@/components/disposal/create-disposal-modal';

// Mock disposal data
const mockDisposals: Disposal[] = [
  {
    id: '1',
    disposalNumber: 'DSP-2024-001',
    inventoryItemId: '4',
    quantity: 25,
    reason: 'expired',
    description: 'Books damaged by water leak in storage area',
    disposalDate: new Date('2024-01-20'),
    approvedBy: 'John Smith',
    cost: 1250.00,
    tenantId: '1',
    inventoryItem: {
      id: '4',
      name: 'Programming Guide: React',
      sku: 'BOOK-REACT-2024',
      categoryId: '3',
      supplierId: '3',
      quantity: 0,
      minQuantity: 15,
      maxQuantity: 75,
      unitPrice: 49.99,
      costPrice: 25.00,
      images: [],
      status: 'active',
      tenantId: '1',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-22'),
    }
  },
  {
    id: '2',
    disposalNumber: 'DSP-2024-002',
    inventoryItemId: '2',
    quantity: 5,
    reason: 'damaged',
    description: 'Headphones with manufacturing defects',
    disposalDate: new Date('2024-01-18'),
    approvedBy: 'Sarah Johnson',
    cost: 999.95,
    tenantId: '1',
    inventoryItem: {
      id: '2',
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-NC-2024',
      categoryId: '1',
      supplierId: '1',
      quantity: 3,
      minQuantity: 10,
      maxQuantity: 100,
      unitPrice: 299.99,
      costPrice: 199.99,
      images: [],
      status: 'active',
      tenantId: '1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
    }
  },
];

export default function DisposalPage() {
  const [disposals, setDisposals] = useState<Disposal[]>(mockDisposals);
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { permissions, currentTenant } = useTenant();

  const filteredDisposals = disposals.filter(disposal => {
    const matchesSearch = disposal.disposalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disposal.inventoryItem?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disposal.inventoryItem?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reasonFilter === 'all' || disposal.reason === reasonFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const disposalDate = disposal.disposalDate;
      
      switch (dateFilter) {
        case 'today':
          matchesDate = disposalDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = disposalDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = disposalDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesReason && matchesDate;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    const currency = currentTenant?.settings.currency || 'USD';
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'obsolete':
        return 'bg-gray-100 text-gray-800';
      case 'quality_issue':
        return 'bg-orange-100 text-orange-800';
      case 'other':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'expired':
        return 'Expired';
      case 'damaged':
        return 'Damaged';
      case 'obsolete':
        return 'Obsolete';
      case 'quality_issue':
        return 'Quality Issue';
      case 'other':
        return 'Other';
      default:
        return reason;
    }
  };

  const handleCreateDisposal = (disposalData: any) => {
    const newDisposal: Disposal = {
      ...disposalData,
      id: `disposal-${Date.now()}`,
      disposalNumber: `DSP-2024-${String(disposals.length + 1).padStart(3, '0')}`,
      disposalDate: new Date(),
      tenantId: currentTenant?.id || '1',
    };
    
    setDisposals(prev => [newDisposal, ...prev]);
  };

  // Calculate summary stats
  const totalQuantity = disposals.reduce((sum, disposal) => sum + disposal.quantity, 0);
  const totalCost = disposals.reduce((sum, disposal) => sum + (disposal.cost || 0), 0);
  const thisMonthDisposals = disposals.filter(d => {
    const now = new Date();
    const disposalDate = d.disposalDate;
    return disposalDate.getMonth() === now.getMonth() && 
           disposalDate.getFullYear() === now.getFullYear();
  }).length;

  if (!permissions.canDisposeStock) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to manage disposals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disposal Management</h1>
          <p className="text-gray-600 mt-2">
            Track and manage inventory disposals for expired, damaged, or obsolete items.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Record Disposal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Disposed</p>
                <p className="text-2xl font-bold text-red-600">{totalQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">{thisMonthDisposals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-purple-600">{disposals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            placeholder="Search by disposal number, item name, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={reasonFilter} onValueChange={setReasonFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Reasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reasons</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
            <SelectItem value="obsolete">Obsolete</SelectItem>
            <SelectItem value="quality_issue">Quality Issue</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Disposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Disposal Records ({filteredDisposals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disposal #</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Approved By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisposals.map((disposal) => (
                <TableRow key={disposal.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{disposal.disposalNumber}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{disposal.inventoryItem?.name}</div>
                      <div className="text-sm text-gray-500">
                        SKU: {disposal.inventoryItem?.sku}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {disposal.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-red-600">{disposal.quantity}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getReasonColor(disposal.reason)}>
                      {getReasonLabel(disposal.reason)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {disposal.cost ? (
                      <span className="font-medium">{formatCurrency(disposal.cost)}</span>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(disposal.disposalDate)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{disposal.approvedBy || 'System'}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDisposals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No disposal records found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Disposal Modal */}
      <CreateDisposalModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateDisposal={handleCreateDisposal}
      />
    </div>
  );
}