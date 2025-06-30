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
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Filter,
  Download,
  Calendar,
  Package
} from 'lucide-react';
import { StockMovement } from '@/types';
import { useTenant } from '@/contexts/tenant-context';

// Mock stock movements data
const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    inventoryItemId: '1',
    type: 'in',
    quantity: 50,
    reason: 'Purchase Order: PO-2024-001 received',
    reference: 'PO-2024-001',
    date: new Date('2024-01-22T10:30:00'),
    tenantId: '1',
  },
  {
    id: '2',
    inventoryItemId: '2',
    type: 'out',
    quantity: 5,
    reason: 'Sale: Customer order #12345',
    reference: 'ORD-12345',
    date: new Date('2024-01-21T14:15:00'),
    tenantId: '1',
  },
  {
    id: '3',
    inventoryItemId: '3',
    type: 'out',
    quantity: 2,
    reason: 'Waste/Damage: Water damage during storage',
    reference: 'WAS-001',
    date: new Date('2024-01-20T09:45:00'),
    tenantId: '1',
  },
  {
    id: '4',
    inventoryItemId: '1',
    type: 'out',
    quantity: 3,
    reason: 'Transfer: Moved to warehouse B',
    reference: 'TRF-001',
    date: new Date('2024-01-19T16:20:00'),
    tenantId: '1',
  },
  {
    id: '5',
    inventoryItemId: '4',
    type: 'in',
    quantity: 100,
    reason: 'Adjustment: Physical count correction',
    reference: 'ADJ-001',
    date: new Date('2024-01-18T11:00:00'),
    tenantId: '1',
  },
];

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>(mockStockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const { currentTenant, permissions } = useTenant();

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movement.reference && movement.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const now = new Date();
      const movementDate = movement.date;
      
      switch (dateFilter) {
        case 'today':
          matchesDate = movementDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = movementDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = movementDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementIcon = (type: string) => {
    return type === 'in' ? (
      <ArrowUpCircle className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getMovementBadge = (type: string) => {
    return type === 'in' ? (
      <Badge className="bg-green-100 text-green-800">Stock In</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Stock Out</Badge>
    );
  };

  // Calculate summary stats
  const totalIn = movements
    .filter(m => m.type === 'in')
    .reduce((sum, m) => sum + m.quantity, 0);
  
  const totalOut = movements
    .filter(m => m.type === 'out')
    .reduce((sum, m) => sum + m.quantity, 0);

  const todayMovements = movements.filter(m => 
    m.date.toDateString() === new Date().toDateString()
  ).length;

  if (!permissions.canViewInventory) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to view stock movements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Movements</h1>
          <p className="text-gray-600 mt-2">
            Track all inventory movements including stock in, stock out, and adjustments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Stock In</p>
                <p className="text-2xl font-bold text-green-600">{totalIn.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Stock Out</p>
                <p className="text-2xl font-bold text-red-600">{totalOut.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Net Movement</p>
                <p className={`text-2xl font-bold ${
                  totalIn - totalOut >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(totalIn - totalOut >= 0 ? '+' : '') + (totalIn - totalOut).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Today's Movements</p>
                <p className="text-2xl font-bold text-purple-600">{todayMovements}</p>
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
            placeholder="Search by reason or reference..."
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
            <SelectItem value="in">Stock In</SelectItem>
            <SelectItem value="out">Stock Out</SelectItem>
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

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Movements ({filteredMovements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      {getMovementBadge(movement.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(movement.date)}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{movement.reason}</span>
                  </TableCell>
                  <TableCell>
                    {movement.reference && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {movement.reference}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMovements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No stock movements found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}