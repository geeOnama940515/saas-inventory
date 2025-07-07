'use client';

import React, { useState } from 'react';
import { InventoryItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Search, Filter, Minus, Plus, User } from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onView: (item: InventoryItem) => void;
  onStockRelease?: (item: InventoryItem) => void;
  onStockReceive?: (item: InventoryItem) => void;
  onIssue?: (item: InventoryItem) => void;
}

export function InventoryTable({ 
  items, 
  onEdit, 
  onDelete, 
  onView, 
  onStockRelease,
  onStockReceive,
  onIssue
}: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currentTenant, permissions } = useTenant();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (item.quantity <= item.minQuantity) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const formatCurrency = (amount: number) => {
    const currency = currentTenant?.settings.currency || 'USD';
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status: {statusFilter === 'all' ? 'All' : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('discontinued')}>
              Discontinued
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>{item.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.quantity}</div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minQuantity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        {/* Stock Operations */}
                        {onStockReceive && (
                          <DropdownMenuItem onClick={() => onStockReceive(item)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Receive Stock
                          </DropdownMenuItem>
                        )}
                        
                        {onStockRelease && item.quantity > 0 && (
                          <DropdownMenuItem onClick={() => onStockRelease(item)}>
                            <Minus className="h-4 w-4 mr-2" />
                            Release Stock
                          </DropdownMenuItem>
                        )}

                        {onIssue && item.quantity > 0 && (
                          <DropdownMenuItem onClick={() => onIssue(item)}>
                            <User className="h-4 w-4 mr-2" />
                            Issue Item
                          </DropdownMenuItem>
                        )}

                        {/* Management Operations - Only for users with manage permissions */}
                        {permissions.canManageInventory && (
                          <>
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items found matching your criteria.
        </div>
      )}
    </div>
  );
}