'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ShoppingCart, Eye, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { PurchaseOrder } from '@/types';
import { useTenant } from '@/contexts/tenant-context';
import { CreatePurchaseOrderModal } from '@/components/purchase-orders/create-purchase-order-modal';

// Mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    supplierId: '1',
    status: 'pending',
    orderDate: new Date('2024-01-20'),
    expectedDate: new Date('2024-01-30'),
    totalAmount: 12500.00,
    tenantId: '1',
    items: [],
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
    orderNumber: 'PO-2024-002',
    supplierId: '2',
    status: 'ordered',
    orderDate: new Date('2024-01-18'),
    expectedDate: new Date('2024-01-28'),
    totalAmount: 8750.00,
    tenantId: '1',
    items: [],
    supplier: {
      id: '2',
      name: 'Fashion Forward Inc',
      email: 'orders@fashionforward.com',
      phone: '+1 (555) 234-5678',
      address: '456 Fashion Ave, New York, NY 10001',
      tenantId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }
  },
  {
    id: '3',
    orderNumber: 'PO-2024-003',
    supplierId: '3',
    status: 'received',
    orderDate: new Date('2024-01-15'),
    expectedDate: new Date('2024-01-25'),
    receivedDate: new Date('2024-01-24'),
    totalAmount: 3200.00,
    tenantId: '1',
    items: [],
    supplier: {
      id: '3',
      name: 'BookWorld Publishers',
      email: 'sales@bookworld.com',
      phone: '+1 (555) 345-6789',
      address: '789 Literature Lane, Boston, MA 02101',
      tenantId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    }
  },
];

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentTenant, permissions } = useTenant();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    const currency = currentTenant?.settings.currency || 'USD';
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreatePurchaseOrder = (purchaseOrderData: any) => {
    const newPurchaseOrder: PurchaseOrder = {
      ...purchaseOrderData,
      id: `po-${Date.now()}`,
      orderNumber: `PO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      orderDate: new Date(),
      status: 'pending',
      tenantId: currentTenant?.id || '1',
    };
    
    setOrders(prev => [newPurchaseOrder, ...prev]);
  };

  if (!permissions.canManagePurchasing) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to manage purchase orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage your purchase orders and track supplier deliveries.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-600">{order.supplier?.name}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Ordered: {formatDate(order.orderDate)}</span>
                </div>
                {order.expectedDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Expected: {formatDate(order.expectedDate)}</span>
                  </div>
                )}
                {order.receivedDate && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Calendar className="h-4 w-4" />
                    <span>Received: {formatDate(order.receivedDate)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first purchase order to start managing supplier orders.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Purchase Order
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ordered</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => o.status === 'ordered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Received</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => o.status === 'received').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Purchase Order Modal */}
      <CreatePurchaseOrderModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreatePurchaseOrder={handleCreatePurchaseOrder}
      />
    </div>
  );
}