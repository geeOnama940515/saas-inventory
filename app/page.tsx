'use client';

import React from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { InventoryChart } from '@/components/dashboard/inventory-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      <div className="space-y-8">
        {/* Stats Cards */}
        <StatsCards />

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <InventoryChart />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}