'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className={`text-xs mt-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { currentTenant } = useTenant();
  
  // Mock data - in production, this would come from your API
  const stats = [
    {
      title: 'Total Items',
      value: '2,543',
      change: '+12%',
      trend: 'up' as const,
      icon: Package,
    },
    {
      title: 'Low Stock Items',
      value: '23',
      change: '-5%',
      trend: 'down' as const,
      icon: AlertTriangle,
    },
    {
      title: 'Total Value',
      value: `${currentTenant?.settings.currency === 'EUR' ? '€' : '$'}847,392`,
      change: '+8%',
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      title: 'Monthly Orders',
      value: '156',
      change: '+23%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}