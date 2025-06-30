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
import { AlertCircle, Loader2, Package, CheckCircle } from 'lucide-react';
import { PendingReceiving } from '@/types';

interface ReceiveStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receivingItem: PendingReceiving | null;
  onReceiveComplete: (receivingId: string, receivedItems: number) => void;
}

// Mock items for receiving
const mockReceivingItems = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3',
    sku: 'MBP-16-M3-512',
    expectedQuantity: 10,
    receivedQuantity: 0,
    unitPrice: 2499.00,
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    sku: 'WBH-NC-2024',
    expectedQuantity: 25,
    receivedQuantity: 0,
    unitPrice: 299.99,
  },
  {
    id: '3',
    name: 'USB-C Cable',
    sku: 'USB-C-001',
    expectedQuantity: 50,
    receivedQuantity: 0,
    unitPrice: 19.99,
  },
];

export function ReceiveStockModal({ 
  open, 
  onOpenChange, 
  receivingItem,
  onReceiveComplete
}: ReceiveStockModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState(mockReceivingItems);
  const [notes, setNotes] = useState('');

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, receivedQuantity: Math.max(0, Math.min(quantity, item.expectedQuantity)) }
          : item
      )
    );
    if (error) setError('');
  };

  const validateForm = () => {
    const hasReceivedItems = items.some(item => item.receivedQuantity > 0);
    if (!hasReceivedItems) {
      setError('Please receive at least one item');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm() || !receivingItem) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const totalReceivedItems = items.reduce((sum, item) => sum + item.receivedQuantity, 0);
      
      onReceiveComplete(receivingItem.id, totalReceivedItems);
      
      // Reset form
      setItems(mockReceivingItems.map(item => ({ ...item, receivedQuantity: 0 })));
      setNotes('');
      
      onOpenChange(false);
    } catch (error) {
      setError('Failed to process receiving. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalExpected = items.reduce((sum, item) => sum + item.expectedQuantity, 0);
  const totalReceived = items.reduce((sum, item) => sum + item.receivedQuantity, 0);
  const isPartialReceiving = totalReceived > 0 && totalReceived < totalExpected;

  if (!receivingItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Receive Stock - {receivingItem.referenceNumber}
          </DialogTitle>
          <DialogDescription>
            Record the actual quantities received for this {receivingItem.type === 'purchase_order' ? 'purchase order' : 'transfer'}.
          </DialogDescription>
        </DialogHeader>

        {/* Receiving Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Reference:</span>
              <span className="ml-2 font-medium">{receivingItem.referenceNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">
                {receivingItem.type === 'purchase_order' ? 'Purchase Order' : 'Transfer'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Source:</span>
              <span className="ml-2 font-medium">
                {receivingItem.supplier?.name || 
                 receivingItem.fromWarehouse?.name || 
                 receivingItem.fromTenant?.name}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Expected Date:</span>
              <span className="ml-2 font-medium">
                {receivingItem.expectedDate?.toLocaleDateString() || 'Not set'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items Table */}
          <div>
            <Label className="text-base font-medium">Items to Receive</Label>
            <div className="border rounded-lg mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.sku}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.expectedQuantity}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={item.expectedQuantity}
                          value={item.receivedQuantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        {item.receivedQuantity === 0 ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : item.receivedQuantity === item.expectedQuantity ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Partial
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-blue-900">Receiving Summary</p>
                <p className="text-sm text-blue-700">
                  {totalReceived} of {totalExpected} items to be received
                </p>
              </div>
              <div className="text-right">
                <div className="w-32 bg-blue-200 rounded-full h-2 mb-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(totalReceived / totalExpected) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-blue-700">
                  {Math.round((totalReceived / totalExpected) * 100)}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Partial Receiving Warning */}
          {isPartialReceiving && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Partial Receiving:</strong> You are receiving {totalReceived} out of {totalExpected} expected items. 
                The remaining items will stay pending for future receiving.
              </AlertDescription>
            </Alert>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Receiving Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the receiving process, condition of items, etc."
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
            <Button type="submit" disabled={isLoading || totalReceived === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Receive {totalReceived} Items
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}