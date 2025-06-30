'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const demoAccounts = [
  { email: 'ceo@inventorypro.com', role: 'CEO', name: 'Sarah Williams', description: 'Can see all companies' },
  { email: 'admin@acme.com', role: 'Admin', name: 'John Smith', description: 'Manages users & settings for Acme Corp' },
  { email: 'purchasing@acme.com', role: 'Purchasing Officer', name: 'Emily Johnson', description: 'Manages purchasing for Acme Corp' },
  { email: 'inventory@acme.com', role: 'Administrative Staff', name: 'Mike Wilson', description: 'Manages inventory for Acme Corp' },
  { email: 'warehouse@acme.com', role: 'Warehouse Staff', name: 'Lisa Chen', description: 'Handles receiving, transfers & disposal' },
];

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(formData.email, formData.password);
    if (!success) {
      setError('Invalid email or password. Please try one of the demo accounts below.');
    }
  };

  const handleDemoLogin = async (email: string) => {
    setFormData({ email, password: 'demo' });
    setError('');
    const success = await login(email, 'demo');
    if (!success) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Building2 className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">InventoryPro</h1>
          </div>
          <p className="text-lg text-gray-600">
            Multi-tenant inventory management system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Demo Accounts</CardTitle>
              <p className="text-sm text-gray-600">
                Click any account below to sign in and explore different role permissions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDemoLogin(account.email)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{account.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            account.role === 'CEO' ? 'bg-purple-100 text-purple-800' :
                            account.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                            account.role === 'Purchasing Officer' ? 'bg-green-100 text-green-800' :
                            account.role === 'Administrative Staff' ? 'bg-orange-100 text-orange-800' :
                            'bg-teal-100 text-teal-800'
                          }`}>
                            {account.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{account.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{account.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a demo system. Any password will work for these accounts.
                  In production, proper authentication would be implemented.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}