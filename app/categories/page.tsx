'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { AddCategoryModal } from '@/components/categories/add-category-modal';
import { mockCategories } from '@/lib/mock-data';
import { Category } from '@/types';
import { useTenant } from '@/contexts/tenant-context';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const { permissions } = useTenant();

  // Mock item counts per category
  const getItemCount = (categoryId: string) => {
    const counts: Record<string, number> = {
      '1': 45,
      '2': 32,
      '3': 18,
      '4': 27,
    };
    return counts[categoryId] || 0;
  };

  const handleAddCategory = (newCategoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...newCategoryData,
      id: `category-${Date.now()}`, // Generate a temporary ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCategories(prevCategories => [newCategory, ...prevCategories]);
  };

  const handleEditCategory = (category: Category) => {
    // In production, this would open an edit modal
    console.log('Edit category:', category);
  };

  const handleDeleteCategory = (category: Category) => {
    // In production, this would show a confirmation dialog
    setCategories(categories.filter(c => c.id !== category.id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Organize your inventory with categories for better management.
          </p>
        </div>
        {permissions.canManageCategories && (
          <Button className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </div>
                <Badge variant="secondary">
                  {getItemCount(category.id)} items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                {category.description || 'No description provided'}
              </p>
              {permissions.canManageCategories && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first category to organize your inventory.
          </p>
          {permissions.canManageCategories && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Category
            </Button>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}