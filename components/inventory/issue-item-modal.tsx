'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { AlertCircle, Loader2, Package, User } from 'lucide-react';
import { InventoryItem, StockMovement } from '@/types';
import { useTenant } from '@/contexts/tenant-context';

interface IssueItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onIssue: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
}

export function IssueItemModal({
  open,
  onOpenChange,
  item,
  onIssue,
}: IssueItemModalProps) {
  const { currentTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    quantity: 1,
    issuedTo: '',
    reason: '',
    reference: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!item) {
      setError('No item selected');
      return false;
    }
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    if (formData.quantity > item.quantity) {
      setError(`Cannot issue more than available stock (${item.quantity})`);
      return false;
    }
    if (!formData.issuedTo.trim()) {
      setError('Issued To is required');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Reason is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm() || !item) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const movement: Omit<StockMovement, 'id' | 'date'> = {
        inventoryItemId: item.id,
        type: 'out',
        quantity: formData.quantity,
        reason: `Issued to ${formData.issuedTo}: ${formData.reason}`,
        reference: formData.reference || undefined,
        tenantId: currentTenant?.id || '1',
        inventoryItem: item,
      };

      onIssue(movement);

      // Reset form
      setFormData({
        quantity: 1,
        issuedTo: '',
        reason: '',
        reference: '',
        notes: '',
      });

      onOpenChange(false);
    } catch (error) {
      setError('Failed to process issuance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Issue Item
          </DialogTitle>
          <DialogDescription>
            Issue items from inventory for {item.name}
          </DialogDescription>
        </DialogHeader>

        {/* Item Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{item.name}</h3>
            <Badge variant="outline">SKU: {item.sku}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current Stock:</span>
              <span className="ml-2 font-medium">{item.quantity} units</span>
            </div>
            <div>
              <span className="text-gray-600">Minimum Stock:</span>
              <span className="ml-2 font-medium">{item.minQuantity} units</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issued To */}
          <div>
            <Label htmlFor="issuedTo">Issued To *</Label>
            <Input
              id="issuedTo"
              value={formData.issuedTo}
              onChange={(e) => handleInputChange('issuedTo', e.target.value)}
              placeholder="Person or Department"
              disabled={isLoading}
            />
          </div>

          {/* Quantity and Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity to Issue *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={item.quantity}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {item.quantity} units
              </p>
            </div>

            <div>
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                placeholder="Request #, Ticket #, etc."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Enter reason for issuance"
              disabled={isLoading}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Error */}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Issue Item'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 