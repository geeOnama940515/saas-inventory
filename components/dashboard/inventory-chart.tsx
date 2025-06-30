'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Electronics', inStock: 450, lowStock: 23, outOfStock: 5 },
  { name: 'Clothing', inStock: 380, lowStock: 12, outOfStock: 8 },
  { name: 'Books', inStock: 290, lowStock: 8, outOfStock: 3 },
  { name: 'Home & Garden', inStock: 520, lowStock: 18, outOfStock: 7 },
  { name: 'Sports', inStock: 340, lowStock: 15, outOfStock: 4 },
  { name: 'Toys', inStock: 280, lowStock: 9, outOfStock: 2 },
];

export function InventoryChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="inStock" stackId="a" fill="#3B82F6" name="In Stock" />
            <Bar dataKey="lowStock" stackId="a" fill="#F59E0B" name="Low Stock" />
            <Bar dataKey="outOfStock" stackId="a" fill="#EF4444" name="Out of Stock" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}