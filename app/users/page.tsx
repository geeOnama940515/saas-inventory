'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';
import { useTenant } from '@/contexts/tenant-context';
import { User } from '@/types';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.smith@acme.com',
    name: 'John Smith',
    role: 'admin',
    tenantId: '1',
    isActive: true,
    lastLoginAt: new Date('2024-01-22T10:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '2',
    email: 'sarah.johnson@acme.com',
    name: 'Sarah Johnson',
    role: 'purchasing_officer',
    tenantId: '1',
    isActive: true,
    lastLoginAt: new Date('2024-01-21T14:15:00'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: '3',
    email: 'mike.wilson@acme.com',
    name: 'Mike Wilson',
    role: 'administrative_staff',
    tenantId: '1',
    isActive: true,
    lastLoginAt: new Date('2024-01-20T09:45:00'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    email: 'emma.davis@acme.com',
    name: 'Emma Davis',
    role: 'administrative_staff',
    tenantId: '1',
    isActive: false,
    lastLoginAt: new Date('2024-01-15T16:20:00'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15'),
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'administrative_staff',
  });
  const { currentTenant, permissions, isCEO } = useTenant();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ceo': return 'text-purple-700 bg-purple-100';
      case 'admin': return 'text-blue-700 bg-blue-100';
      case 'purchasing_officer': return 'text-green-700 bg-green-100';
      case 'administrative_staff': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ceo': return 'CEO';
      case 'admin': return 'Admin';
      case 'purchasing_officer': return 'Purchasing Officer';
      case 'administrative_staff': return 'Administrative Staff';
      default: return role;
    }
  };

  const handleInviteUser = () => {
    // In production, this would send an invitation email
    console.log('Inviting user:', inviteForm);
    setShowInviteDialog(false);
    setInviteForm({ email: '', role: 'administrative_staff' });
  };

  const handleEditUser = (user: User) => {
    // In production, this would open an edit modal
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (user: User) => {
    // In production, this would show a confirmation dialog
    setUsers(users.filter(u => u.id !== user.id));
  };

  const toggleUserStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Check plan limits
  const planLimits = {
    starter: 5,
    pro: 25,
    enterprise: -1, // unlimited
  };
  
  const maxUsers = planLimits[currentTenant?.plan || 'starter'];
  const canAddUsers = (maxUsers === -1 || users.length < maxUsers) && permissions.canManageUsers;

  // Don't show this page if user doesn't have permission
  if (!permissions.canManageUsers) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to manage users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their access permissions.
            {isCEO && (
              <span className="flex items-center gap-1 mt-1">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">CEO: Managing {currentTenant?.name}</span>
              </span>
            )}
          </p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!canAddUsers}>
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team. They'll receive an email with setup instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="colleague@company.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="purchasing_officer">Purchasing Officer</SelectItem>
                    <SelectItem value="administrative_staff">Administrative Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser}>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plan Usage */}
      {maxUsers !== -1 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Team Member Usage</p>
                  <p className="text-sm text-gray-600">
                    {users.length} of {maxUsers} members used
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((users.length / maxUsers) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round((users.length / maxUsers) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="purchasing_officer">Purchasing Officer</SelectItem>
            <SelectItem value="administrative_staff">Administrative Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={user.isActive ? 'text-green-700' : 'text-red-700'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {user.lastLoginAt ? formatLastLogin(user.lastLoginAt) : 'Never'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.createdAt.toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                          {user.isActive ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No team members found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Limit Warning */}
      {!canAddUsers && maxUsers !== -1 && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Team Member Limit Reached</p>
                <p className="text-sm text-orange-700">
                  You've reached the maximum number of team members for your {currentTenant?.plan} plan. 
                  Upgrade to add more members.
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}