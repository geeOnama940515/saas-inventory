'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, AlertTriangle, User } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'stock_update',
    message: 'Stock updated for MacBook Pro 16"',
    time: '2 minutes ago',
    icon: Package,
    status: 'success',
  },
  {
    id: 2,
    type: 'low_stock',
    message: 'Low stock alert for Wireless Headphones',
    time: '15 minutes ago',
    icon: AlertTriangle,
    status: 'warning',
  },
  {
    id: 3,
    type: 'order',
    message: 'New purchase order #PO-2024-001 created',
    time: '1 hour ago',
    icon: ShoppingCart,
    status: 'info',
  },
  {
    id: 4,
    type: 'user',
    message: 'New user Sarah Johnson added to team',
    time: '2 hours ago',
    icon: User,
    status: 'success',
  },
  {
    id: 5,
    type: 'stock_update',
    message: 'Received 50 units of Gaming Mouse',
    time: '3 hours ago',
    icon: Package,
    status: 'success',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                activity.status === 'success' ? 'bg-green-100 text-green-600' :
                activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <Badge
                variant={
                  activity.status === 'success' ? 'default' :
                  activity.status === 'warning' ? 'secondary' :
                  'outline'
                }
              >
                {activity.type.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}