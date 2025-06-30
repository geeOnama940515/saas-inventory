'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Globe, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  AlertTriangle,
  Mail,
  Smartphone
} from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';

export default function SettingsPage() {
  const { currentTenant, currentUser } = useTenant();
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: currentTenant?.name || '',
    companyDescription: '',
    website: '',
    industry: '',
    
    // Regional Settings
    currency: currentTenant?.settings.currency || 'USD',
    timezone: currentTenant?.settings.timezone || 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'US',
    
    // Inventory Settings
    lowStockThreshold: currentTenant?.settings.lowStockThreshold || 10,
    autoReorderEnabled: false,
    barcodeFormat: 'CODE128',
    
    // Notification Settings
    emailNotifications: {
      lowStock: true,
      newOrders: true,
      weeklyReports: true,
      systemUpdates: false,
    },
    smsNotifications: {
      criticalAlerts: false,
      lowStock: false,
    },
    
    // Security Settings
    twoFactorEnabled: false,
    sessionTimeout: 60,
    passwordPolicy: 'medium',
    
    // Display Settings
    theme: 'light',
    compactMode: false,
    showTutorials: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In production, this would save to your API
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your organization settings and preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={settings.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder="Brief description of your company..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={settings.industry}
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value) => handleInputChange('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numberFormat">Number Format</Label>
                <Select
                  value={settings.numberFormat}
                  onValueChange={(value) => handleInputChange('numberFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">1,234.56 (US)</SelectItem>
                    <SelectItem value="EU">1.234,56 (EU)</SelectItem>
                    <SelectItem value="IN">1,23,456.78 (Indian)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Inventory Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Alert when stock falls below this number
                </p>
              </div>

              <div>
                <Label htmlFor="barcodeFormat">Barcode Format</Label>
                <Select
                  value={settings.barcodeFormat}
                  onValueChange={(value) => handleInputChange('barcodeFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CODE128">CODE128</SelectItem>
                    <SelectItem value="EAN13">EAN-13</SelectItem>
                    <SelectItem value="UPC">UPC</SelectItem>
                    <SelectItem value="QR">QR Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoReorder">Auto-Reorder</Label>
                <p className="text-sm text-gray-500">
                  Automatically create purchase orders when stock is low
                </p>
              </div>
              <Switch
                id="autoReorder"
                checked={settings.autoReorderEnabled}
                onCheckedChange={(checked) => handleInputChange('autoReorderEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4" />
                <Label className="text-base font-medium">Email Notifications</Label>
              </div>
              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailLowStock">Low stock alerts</Label>
                  <Switch
                    id="emailLowStock"
                    checked={settings.emailNotifications.lowStock}
                    onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'lowStock', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNewOrders">New purchase orders</Label>
                  <Switch
                    id="emailNewOrders"
                    checked={settings.emailNotifications.newOrders}
                    onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'newOrders', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailReports">Weekly reports</Label>
                  <Switch
                    id="emailReports"
                    checked={settings.emailNotifications.weeklyReports}
                    onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'weeklyReports', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailUpdates">System updates</Label>
                  <Switch
                    id="emailUpdates"
                    checked={settings.emailNotifications.systemUpdates}
                    onCheckedChange={(checked) => handleNestedChange('emailNotifications', 'systemUpdates', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-4 w-4" />
                <Label className="text-base font-medium">SMS Notifications</Label>
              </div>
              <div className="space-y-3 ml-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsCritical">Critical alerts only</Label>
                  <Switch
                    id="smsCritical"
                    checked={settings.smsNotifications.criticalAlerts}
                    onCheckedChange={(checked) => handleNestedChange('smsNotifications', 'criticalAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsLowStock">Low stock alerts</Label>
                  <Switch
                    id="smsLowStock"
                    checked={settings.smsNotifications.lowStock}
                    onCheckedChange={(checked) => handleNestedChange('smsNotifications', 'lowStock', checked)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                id="twoFactor"
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => handleInputChange('twoFactorEnabled', checked)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select
                  value={settings.sessionTimeout.toString()}
                  onValueChange={(value) => handleInputChange('sessionTimeout', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="passwordPolicy">Password Policy</Label>
                <Select
                  value={settings.passwordPolicy}
                  onValueChange={(value) => handleInputChange('passwordPolicy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                    <SelectItem value="strong">Strong (12+ chars, symbols)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Display & Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleInputChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compactMode">Compact Mode</Label>
                  <p className="text-sm text-gray-500">
                    Show more information in less space
                  </p>
                </div>
                <Switch
                  id="compactMode"
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => handleInputChange('compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showTutorials">Show Tutorials</Label>
                  <p className="text-sm text-gray-500">
                    Display helpful tips and tutorials
                  </p>
                </div>
                <Switch
                  id="showTutorials"
                  checked={settings.showTutorials}
                  onCheckedChange={(checked) => handleInputChange('showTutorials', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}