'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Package, 
  Check,
  Crown,
  Settings
} from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    features: {
      maxUsers: 5,
      maxItems: 1000,
      analytics: false,
      apiAccess: false,
      prioritySupport: false
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Advanced features for growing businesses',
    features: {
      maxUsers: 25,
      maxItems: 10000,
      analytics: true,
      apiAccess: true,
      prioritySupport: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full-featured solution for large organizations',
    features: {
      maxUsers: -1, // unlimited
      maxItems: -1, // unlimited
      analytics: true,
      apiAccess: true,
      prioritySupport: true
    }
  }
];

export default function BillingPage() {
  const { currentTenant } = useTenant();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock usage data
  const usage = {
    users: 8,
    items: 2543,
    apiCalls: 15420
  };

  const currentPlan = plans.find(p => p.id === currentTenant?.plan) || plans[0];

  const getUsersProgress = () => {
    if (currentPlan.features.maxUsers === -1) return 0;
    return (usage.users / currentPlan.features.maxUsers) * 100;
  };

  const getItemsProgress = () => {
    if (currentPlan.features.maxItems === -1) return 0;
    return (usage.items / currentPlan.features.maxItems) * 100;
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Plan & Usage</h1>
        <p className="text-gray-600 mt-2">
          Manage your current plan and monitor usage across your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <p className="text-gray-600">{currentPlan.description}</p>
                </div>
                <Button variant="outline" onClick={() => setShowUpgradeModal(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Plan
                </Button>
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members
                    </span>
                    <span>
                      {usage.users} / {currentPlan.features.maxUsers === -1 ? '∞' : currentPlan.features.maxUsers}
                    </span>
                  </div>
                  <Progress value={getUsersProgress()} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Inventory Items
                    </span>
                    <span>
                      {usage.items.toLocaleString()} / {currentPlan.features.maxItems === -1 ? '∞' : currentPlan.features.maxItems.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={getItemsProgress()} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {currentPlan.features.maxUsers === -1 ? 'Unlimited' : currentPlan.features.maxUsers} team members
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {currentPlan.features.maxItems === -1 ? 'Unlimited' : currentPlan.features.maxItems.toLocaleString()} inventory items
                  </span>
                </div>
                {currentPlan.features.analytics && (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                )}
                {currentPlan.features.apiAccess && (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API access</span>
                  </div>
                )}
                {currentPlan.features.prioritySupport && (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Email support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Data export</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Mobile app access</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Comparison */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border rounded-lg ${
                      plan.id === currentPlan.id ? 'border-blue-200 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {plan.id === currentPlan.id && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3" />
                        {plan.features.maxUsers === -1 ? 'Unlimited' : plan.features.maxUsers} users
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3" />
                        {plan.features.maxItems === -1 ? 'Unlimited' : plan.features.maxItems.toLocaleString()} items
                      </li>
                      {plan.features.analytics && (
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3" />
                          Advanced analytics
                        </li>
                      )}
                      {plan.features.apiAccess && (
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3" />
                          API access
                        </li>
                      )}
                    </ul>
                    {plan.id !== currentPlan.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => setShowUpgradeModal(true)}
                      >
                        Switch to {plan.name}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-medium">{usage.users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Items</span>
                  <span className="font-medium">{usage.items.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Calls (30 days)</span>
                  <span className="font-medium">{usage.apiCalls.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}