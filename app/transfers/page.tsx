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
  Truck, 
  Building2,
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Eye,
  Edit
} from 'lucide-react';
import { Transfer } from '@/types';
import { useTenant } from '@/contexts/tenant-context';
import { CreateTransferModal } from '@/components/transfers/create-transfer-modal';

// Mock transfers data
const mockTransfers: Transfer[] = [
  {
    id: '1',
    transferNumber: 'TRF-2024-001',
    fromWarehouseId: '1',
    toWarehouseId: '2',
    status: 'pending',
    transferDate: new Date('2024-01-22'),
    expectedDate: new Date('2024-01-24'),
    tenantId: '1',
    items: [],
    fromWarehouse: {
      id: '1',
      name: 'Main Warehouse',
      code: 'WH-MAIN',
      address: '123 Storage St, City, State',
      tenantId: '1',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    toWarehouse: {
      id: '2',
      name: 'Distribution Center',
      code: 'WH-DIST',
      address: '456 Distribution Ave, City, State',
      tenantId: '1',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    createdBy: '1',
  },
  {
    id: '2',
    transferNumber: 'TRF-2024-002',
    fromTenantId: '1',
    toTenantId: '2',
    status: 'in_transit',
    transferDate: new Date('2024-01-20'),
    expectedDate: new Date('2024-01-23'),
    tenantId: '1',
    items: [],
    fromTenant: {
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
    toTenant: {
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
    createdBy: '1',
  },
];

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { permissions } = useTenant();

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transfer.fromWarehouse?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (transfer.toWarehouse?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (transfer.fromTenant?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (transfer.toTenant?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    let matchesType = true;
    if (typeFilter === 'warehouse') {
      matchesType = !!transfer.fromWarehouseId && !!transfer.toWarehouseId;
    } else if (typeFilter === 'company') {
      matchesType = !!transfer.fromTenantId && !!transfer.toTenantId;
    }
    
    return matchesSearch && matchesStatus && matchesType;
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
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'received':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleCreateTransfer = (transferData: any) => {
    const newTransfer: Transfer = {
      ...transferData,
      id: `transfer-${Date.now()}`,
      transferNumber: `TRF-2024-${String(transfers.length + 1).padStart(3, '0')}`,
      transferDate: new Date(),
      status: 'pending',
      tenantId: '1',
      items: [],
      createdBy: '1',
    };
    
    setTransfers(prev => [newTransfer, ...prev]);
  };

  // Calculate summary stats
  const totalPending = transfers.filter(t => t.status === 'pending').length;
  const totalInTransit = transfers.filter(t => t.status === 'in_transit').length;
  const totalReceived = transfers.filter(t => t.status === 'received').length;

  if (!permissions.canManageTransfers && !permissions.canViewInventory) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to view transfers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
          <p className="text-gray-600 mt-2">
            Manage inventory transfers between warehouses and companies.
          </p>
        </div>
        {permissions.canManageTransfers && (
          <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Create Transfer
          </Button>
        )}
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
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{totalInTransit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Received</p>
                <p className="text-2xl font-bold text-green-600">{totalReceived}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-purple-600">{transfers.length}</p>
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
            placeholder="Search by transfer number or location..."
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
            <SelectItem value="warehouse">Warehouse to Warehouse</SelectItem>
            <SelectItem value="company">Company to Company</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfers ({filteredTransfers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Transfer Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{transfer.transferNumber}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transfer.fromWarehouseId ? (
                        <Truck className="h-4 w-4 text-green-600" />
                      ) : (
                        <Building2 className="h-4 w-4 text-purple-600" />
                      )}
                      <span className="text-sm">
                        {transfer.fromWarehouseId ? 'Warehouse' : 'Company'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transfer.fromWarehouse?.name || transfer.fromTenant?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transfer.fromWarehouse?.code || 'External Company'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {transfer.toWarehouse?.name || transfer.toTenant?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transfer.toWarehouse?.code || 'External Company'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(transfer.transferDate)}</span>
                  </TableCell>
                  <TableCell>
                    {transfer.expectedDate ? (
                      <span className="text-sm">{formatDate(transfer.expectedDate)}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transfer.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(transfer.status)}
                        <span className="capitalize">{transfer.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {permissions.canManageTransfers && transfer.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTransfers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transfers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Transfer Modal */}
      <CreateTransferModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateTransfer={handleCreateTransfer}
      />
    </div>
  );
}