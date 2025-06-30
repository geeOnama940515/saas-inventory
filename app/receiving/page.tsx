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
  Package, 
  Truck, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  ArrowRight
} from 'lucide-react';
import { PendingReceiving } from '@/types';
import { useTenant } from '@/contexts/tenant-context';
import { ReceiveStockModal } from '@/components/receiving/receive-stock-modal';

// Mock pending receiving data
const mockPendingReceiving: PendingReceiving[] = [
  {
    id: '1',
    type: 'purchase_order',
    referenceId: 'po-1',
    referenceNumber: 'PO-2024-001',
    expectedDate: new Date('2024-01-25'),
    status: 'pending',
    totalItems: 3,
    receivedItems: 0,
    tenantId: '1',
    supplier: {
      id: '1',
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA 94043',
      tenantId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }
  },
  {
    id: '2',
    type: 'transfer',
    referenceId: 'tr-1',
    referenceNumber: 'TRF-2024-001',
    expectedDate: new Date('2024-01-24'),
    status: 'partial',
    totalItems: 5,
    receivedItems: 2,
    tenantId: '1',
    fromWarehouse: {
      id: '1',
      name: 'Main Warehouse',
      code: 'WH-MAIN',
      address: '123 Storage St, City, State',
      tenantId: '1',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }
  },
  {
    id: '3',
    type: 'transfer',
    referenceId: 'tr-2',
    referenceNumber: 'TRF-2024-002',
    expectedDate: new Date('2024-01-26'),
    status: 'pending',
    totalItems: 2,
    receivedItems: 0,
    tenantId: '1',
    fromTenant: {
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
    }
  },
];

export default function ReceivingPage() {
  const [pendingItems, setPendingItems] = useState<PendingReceiving[]>(mockPendingReceiving);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PendingReceiving | null>(null);
  const { permissions } = useTenant();

  const filteredItems = pendingItems.filter(item => {
    const matchesSearch = item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.fromWarehouse?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.fromTenant?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleReceive = (item: PendingReceiving) => {
    setSelectedItem(item);
    setShowReceiveModal(true);
  };

  const handleReceiveComplete = (receivingId: string, receivedItems: number) => {
    setPendingItems(prev => 
      prev.map(item => {
        if (item.id === receivingId) {
          const newReceivedItems = item.receivedItems + receivedItems;
          const newStatus = newReceivedItems >= item.totalItems ? 'completed' : 'partial';
          return {
            ...item,
            receivedItems: newReceivedItems,
            status: newStatus
          };
        }
        return item;
      })
    );
  };

  // Calculate summary stats
  const totalPending = pendingItems.filter(item => item.status === 'pending').length;
  const totalPartial = pendingItems.filter(item => item.status === 'partial').length;
  const totalOverdue = pendingItems.filter(item => 
    item.expectedDate && item.expectedDate < new Date() && item.status !== 'completed'
  ).length;

  if (!permissions.canReceiveStock) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to access the receiving area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receiving</h1>
          <p className="text-gray-600 mt-2">
            Manage incoming stock from purchase orders and transfers.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Partial</p>
                <p className="text-2xl font-bold text-blue-600">{totalPartial}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{totalOverdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-green-600">{pendingItems.length}</p>
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
            placeholder="Search by reference number or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase_order">Purchase Orders</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Receiving Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Receiving ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.type === 'purchase_order' ? (
                        <Package className="h-4 w-4 text-blue-600" />
                      ) : item.fromTenant ? (
                        <Building2 className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Truck className="h-4 w-4 text-green-600" />
                      )}
                      <span className="capitalize">
                        {item.type === 'purchase_order' ? 'Purchase Order' : 
                         item.fromTenant ? 'Company Transfer' : 'Warehouse Transfer'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{item.referenceNumber}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.supplier?.name || 
                         item.fromWarehouse?.name || 
                         item.fromTenant?.name}
                      </div>
                      {item.supplier && (
                        <div className="text-sm text-gray-500">Supplier</div>
                      )}
                      {item.fromWarehouse && (
                        <div className="text-sm text-gray-500">
                          {item.fromWarehouse.code}
                        </div>
                      )}
                      {item.fromTenant && (
                        <div className="text-sm text-gray-500">External Company</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.expectedDate ? (
                      <div className={`text-sm ${
                        item.expectedDate < new Date() && item.status !== 'completed'
                          ? 'text-red-600 font-medium'
                          : 'text-gray-600'
                      }`}>
                        {formatDate(item.expectedDate)}
                        {item.expectedDate < new Date() && item.status !== 'completed' && (
                          <div className="text-xs text-red-500">Overdue</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(item.receivedItems / item.totalItems) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.receivedItems}/{item.totalItems}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status !== 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => handleReceive(item)}
                        className="gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Receive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pending receiving items found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receive Stock Modal */}
      <ReceiveStockModal
        open={showReceiveModal}
        onOpenChange={setShowReceiveModal}
        receivingItem={selectedItem}
        onReceiveComplete={handleReceiveComplete}
      />
    </div>
  );
}