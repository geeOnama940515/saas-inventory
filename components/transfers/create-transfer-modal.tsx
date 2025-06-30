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
import { AlertCircle, Loader2, Truck, Building2 } from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';

interface CreateTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTransfer: (transfer: any) => void;
}

const mockWarehouses = [
  { id: '1', name: 'Main Warehouse', code: 'WH-MAIN' },
  { id: '2', name: 'Distribution Center', code: 'WH-DIST' },
  { id: '3', name: 'Retail Store A', code: 'WH-STORE-A' },
];

const mockCompanies = [
  { id: '2', name: 'TechStart Inc' },
  { id: '3', name: 'Global Retail Co' },
];

export function CreateTransferModal({ 
  open, 
  onOpenChange, 
  onCreateTransfer
}: CreateTransferModalProps) {
  const { currentTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    transferType: 'warehouse', // 'warehouse' or 'company'
    fromWarehouseId: '',
    toWarehouseId: '',
    toTenantId: '',
    expectedDate: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.transferType === 'warehouse') {
      if (!formData.fromWarehouseId) {
        setError('Please select source warehouse');
        return false;
      }
      if (!formData.toWarehouseId) {
        setError('Please select destination warehouse');
        return false;
      }
      if (formData.fromWarehouseId === formData.toWarehouseId) {
        setError('Source and destination warehouses must be different');
        return false;
      }
    } else {
      if (!formData.toTenantId) {
        setError('Please select destination company');
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

      const transferData = {
        ...formData,
        expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : undefined,
      };

      onCreateTransfer(transferData);
      
      // Reset form
      setFormData({
        transferType: 'warehouse',
        fromWarehouseId: '',
        toWarehouseId: '',
        toTenantId: '',
        expectedDate: '',
        notes: '',
      });
      
      onOpenChange(false);
    } catch (error) {
      setError('Failed to create transfer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Create New Transfer
          </DialogTitle>
          <DialogDescription>
            Create a transfer to move inventory between warehouses or companies.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transfer Type */}
          <div>
            <Label htmlFor="transferType">Transfer Type *</Label>
            <Select
              value={formData.transferType}
              onValueChange={(value) => handleInputChange('transferType', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Warehouse to Warehouse</div>
                      <div className="text-sm text-gray-500">Transfer within your company</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="company">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Company to Company</div>
                      <div className="text-sm text-gray-500">Transfer to another company</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse Transfer Fields */}
          {formData.transferType === 'warehouse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromWarehouse">From Warehouse *</Label>
                <Select
                  value={formData.fromWarehouseId}
                  onValueChange={(value) => handleInputChange('fromWarehouseId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        <div>
                          <div className="font-medium">{warehouse.name}</div>
                          <div className="text-sm text-gray-500">{warehouse.code}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="toWarehouse">To Warehouse *</Label>
                <Select
                  value={formData.toWarehouseId}
                  onValueChange={(value) => handleInputChange('toWarehouseId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses
                      .filter(w => w.id !== formData.fromWarehouseId)
                      .map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          <div>
                            <div className="font-medium">{warehouse.name}</div>
                            <div className="text-sm text-gray-500">{warehouse.code}</div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Company Transfer Fields */}
          {formData.transferType === 'company' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>From Company</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{currentTenant?.name}</div>
                  <div className="text-sm text-gray-500">Current company</div>
                </div>
              </div>

              <div>
                <Label htmlFor="toCompany">To Company *</Label>
                <Select
                  value={formData.toTenantId}
                  onValueChange={(value) => handleInputChange('toTenantId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Expected Date */}
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

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Transfer Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any special instructions or notes for this transfer..."
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Transfer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}