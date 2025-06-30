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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Trash2, Package } from 'lucide-react';
import { mockInventoryItems } from '@/lib/mock-data';
import { useTenant } from '@/contexts/tenant-context';

interface CreateDisposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateDisposal: (disposal: any) => void;
}

const disposalReasons = [
  { value: 'expired', label: 'Expired', description: 'Items past their expiration date' },
  { value: 'damaged', label: 'Damaged', description: 'Items damaged during storage or handling' },
  { value: 'obsolete', label: 'Obsolete', description: 'Items no longer needed or outdated' },
  { value: 'quality_issue', label: 'Quality Issue', description: 'Items with quality defects' },
  { value: 'other', label: 'Other', description: 'Other disposal reasons' },
];

export function CreateDisposalModal({ 
  open, 
  onOpenChange, 
  onCreateDisposal
}: CreateDisposalModalProps) {
  const { currentTenant, currentUser } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    inventoryItemId: '',
    quantity: 1,
    reason: '',
    description: '',
    cost: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const selectedItem = mockInventoryItems.find(item => item.id === formData.inventoryItemId);
  const selectedReason = disposalReasons.find(reason => reason.value === formData.reason);

  const validateForm = () => {
    if (!formData.inventoryItemId) {
      setError('Please select an inventory item');
      return false;
    }
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    if (selectedItem && formData.quantity > selectedItem.quantity) {
      setError(`Cannot dispose more than available stock (${selectedItem.quantity})`);
      return false;
    }
    if (!formData.reason) {
      setError('Please select a disposal reason');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please provide a description');
      return false;
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

      const disposalData = {
        ...formData,
        inventoryItem: selectedItem,
        approvedBy: currentUser?.name,
        cost: formData.cost || undefined,
      };

      onCreateDisposal(disposalData);
      
      // Reset form
      setFormData({
        inventoryItemId: '',
        quantity: 1,
        reason: '',
        description: '',
        cost: 0,
      });
      
      onOpenChange(false);
    } catch (error) {
      setError('Failed to record disposal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedCost = selectedItem ? selectedItem.costPrice * formData.quantity : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Record Inventory Disposal
          </DialogTitle>
          <DialogDescription>
            Record the disposal of inventory items that are expired, damaged, or no longer usable.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Selection */}
          <div>
            <Label htmlFor="item">Inventory Item *</Label>
            <Select
              value={formData.inventoryItemId}
              onValueChange={(value) => handleInputChange('inventoryItemId', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select item to dispose" />
              </SelectTrigger>
              <SelectContent>
                {mockInventoryItems
                  .filter(item => item.quantity > 0)
                  .map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            SKU: {item.sku} • Available: {item.quantity}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedItem && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedItem.name}</p>
                    <p className="text-sm text-gray-600">Available: {selectedItem.quantity} units</p>
                  </div>
                  <Badge variant="outline">
                    {selectedItem.sku}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Quantity and Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity to Dispose *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedItem?.quantity || 1}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                disabled={isLoading || !selectedItem}
              />
              {selectedItem && (
                <p className="text-sm text-gray-500 mt-1">
                  Max: {selectedItem.quantity} units
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="reason">Disposal Reason *</Label>
              <Select
                value={formData.reason}
                onValueChange={(value) => handleInputChange('reason', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {disposalReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      <div>
                        <div className="font-medium">{reason.label}</div>
                        <div className="text-sm text-gray-500">{reason.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedReason && (
                <p className="text-sm text-gray-600 mt-1">{selectedReason.description}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed description of the disposal reason..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Cost */}
          <div>
            <Label htmlFor="cost">Disposal Cost (Optional)</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              disabled={isLoading}
            />
            {estimatedCost > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Estimated cost based on item cost price: {currentTenant?.settings.currency === 'EUR' ? '€' : '$'}{estimatedCost.toFixed(2)}
              </p>
            )}
          </div>

          {/* Cost Impact Warning */}
          {estimatedCost > 0 && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                <strong>Cost Impact:</strong> This disposal will result in a loss of approximately{' '}
                {currentTenant?.settings.currency === 'EUR' ? '€' : '$'}{estimatedCost.toFixed(2)} based on the item's cost price.
              </AlertDescription>
            </Alert>
          )}

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
            <Button type="submit" disabled={isLoading} variant="destructive">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Record Disposal
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}