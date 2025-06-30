'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { mockSuppliers, mockInventoryItems } from '@/lib/mock-data';
import { useTenant } from '@/contexts/tenant-context';

interface CreatePurchaseOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePurchaseOrder: (purchaseOrder: any) => void;
}

interface OrderItem {
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function CreatePurchaseOrderModal({ 
  open, 
  onOpenChange, 
  onCreatePurchaseOrder
}: CreatePurchaseOrderModalProps) {
  const { currentTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    supplierId: '',
    expectedDate: '',
    notes: '',
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const addOrderItem = () => {
    setOrderItems(prev => [...prev, {
      inventoryItemId: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate total price when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        // Auto-fill unit price when item is selected
        if (field === 'inventoryItemId') {
          const selectedItem = mockInventoryItems.find(inv => inv.id === value);
          if (selectedItem) {
            updatedItem.unitPrice = selectedItem.costPrice;
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const validateForm = () => {
    if (!formData.supplierId) {
      setError('Please select a supplier');
      return false;
    }
    if (orderItems.length === 0) {
      setError('Please add at least one item to the order');
      return false;
    }
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      if (!item.inventoryItemId) {
        setError(`Please select an item for row ${i + 1}`);
        return false;
      }
      if (item.quantity <= 0) {
        setError(`Please enter a valid quantity for row ${i + 1}`);
        return false;
      }
      if (item.unitPrice <= 0) {
        setError(`Please enter a valid unit price for row ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const supplier = mockSuppliers.find(s => s.id === formData.supplierId);

      const purchaseOrderData = {
        ...formData,
        expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : undefined,
        totalAmount,
        supplier,
        items: orderItems.map(item => ({
          ...item,
          inventoryItem: mockInventoryItems.find(inv => inv.id === item.inventoryItemId),
        })),
      };

      onCreatePurchaseOrder(purchaseOrderData);
      
      // Reset form
      setFormData({
        supplierId: '',
        expectedDate: '',
        notes: '',
      });
      setOrderItems([]);
      
      onOpenChange(false);
    } catch (error) {
      setError('Failed to create purchase order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const formatCurrency = (amount: number) => {
    const currency = currentTenant?.settings.currency || 'USD';
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Create Purchase Order
          </DialogTitle>
          <DialogDescription>
            Create a new purchase order to order inventory from a supplier.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => handleInputChange('supplierId', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.email}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expectedDate">Expected Delivery Date</Label>
              <Input
                id="expectedDate"
                type="date"
                value={formData.expectedDate}
                onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">Order Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOrderItem}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {orderItems.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, index) => {
                      const selectedItem = mockInventoryItems.find(inv => inv.id === item.inventoryItemId);
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.inventoryItemId}
                              onValueChange={(value) => updateOrderItem(index, 'inventoryItemId', value)}
                              disabled={isLoading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockInventoryItems.map((invItem) => (
                                  <SelectItem key={invItem.id} value={invItem.id}>
                                    <div>
                                      <div className="font-medium">{invItem.name}</div>
                                      <div className="text-sm text-gray-500">
                                        SKU: {invItem.sku} • Current: {invItem.quantity}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {selectedItem && (
                              <Badge variant="outline" className="mt-1">
                                Current Stock: {selectedItem.quantity}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-20"
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-24"
                              disabled={isLoading}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOrderItem(index)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No items added to the order yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOrderItem}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {orderItems.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Order Amount:</span>
                <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Order Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any special instructions or notes for this order..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || orderItems.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}