'use client';

import React, { useState } from 'react';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { AddItemModal } from '@/components/inventory/add-item-modal';
import { StockReleaseModal } from '@/components/inventory/stock-release-modal';
import { IssueItemModal } from '@/components/inventory/issue-item-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockInventoryItems, mockCategories, mockSuppliers } from '@/lib/mock-data';
import { InventoryItem, StockMovement } from '@/types';
import { useTenant } from '@/contexts/tenant-context';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { permissions } = useTenant();

  const handleEdit = (item: InventoryItem) => {
    // In production, this would open an edit modal or navigate to edit page
    console.log('Edit item:', item);
  };

  const handleDelete = (item: InventoryItem) => {
    // In production, this would show a confirmation dialog
    setItems(items.filter(i => i.id !== item.id));
  };

  const handleView = (item: InventoryItem) => {
    // In production, this would open a detailed view modal or page
    console.log('View item:', item);
  };

  const handleStockRelease = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowReleaseModal(true);
  };

  const handleStockReceive = (item: InventoryItem) => {
    // In production, this would open a stock receive modal
    console.log('Receive stock for:', item);
  };

  const handleIssue = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowIssueModal(true);
  };

  const handleItemIssuance = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === movement.inventoryItemId) {
          const newQuantity = item.quantity - movement.quantity;
          return {
            ...item,
            quantity: Math.max(0, newQuantity),
            updatedAt: new Date(),
          };
        }
        return item;
      })
    );
    // In production, you would also save the movement to your database
    console.log('Item issued:', movement);
  };

  const handleAddItem = (newItemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: `item-${Date.now()}`, // Generate a temporary ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setItems(prevItems => [newItem, ...prevItems]);
  };

  const handleStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    // Update the item quantity based on the movement
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === movement.inventoryItemId) {
          const newQuantity = movement.type === 'in' 
            ? item.quantity + movement.quantity
            : item.quantity - movement.quantity;
          
          return {
            ...item,
            quantity: Math.max(0, newQuantity), // Ensure quantity doesn't go negative
            updatedAt: new Date(),
          };
        }
        return item;
      })
    );

    // In production, you would also save the movement to your database
    console.log('Stock movement recorded:', movement);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-2">
            {permissions.canManageInventory 
              ? "Manage your inventory items, track stock levels, and monitor performance."
              : "View inventory items and stock levels for purchasing decisions."
            }
          </p>
        </div>
        {permissions.canManageInventory && (
          <Button className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      <InventoryTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onStockRelease={handleStockRelease}
        onStockReceive={handleStockReceive}
        onIssue={handleIssue}
      />

      {/* Add Item Modal */}
      <AddItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddItem={handleAddItem}
        categories={mockCategories}
        suppliers={mockSuppliers}
      />

      {/* Stock Release Modal */}
      <StockReleaseModal
        open={showReleaseModal}
        onOpenChange={setShowReleaseModal}
        item={selectedItem}
        onStockRelease={handleStockMovement}
      />

      {/* Issue Item Modal */}
      <IssueItemModal
        open={showIssueModal}
        onOpenChange={setShowIssueModal}
        item={selectedItem}
        onIssue={handleItemIssuance}
      />
    </div>
  );
}