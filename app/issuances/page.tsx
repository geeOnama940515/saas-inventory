"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IssueItemModal } from "@/components/inventory/issue-item-modal";
import { mockInventoryItems } from "@/lib/mock-data";
import { InventoryItem, StockMovement } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, User, Hash, Building2, Calendar, ClipboardCheck, Truck, FileText, CheckCircle, Send, ListPlus, Trash2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';

// Issuance type for multiple items
interface IssuanceItem {
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantity: number;
  notes: string;
}

interface Issuance {
  id: string;
  requestor: string;
  department: string;
  requestNumber: string;
  dateRequested: string;
  approvedBy: string;
  releasedBy: string;
  dateReleased: string;
  notes: string;
  items: IssuanceItem[];
}

const mockIssuances: Issuance[] = [
  {
    id: 'iss-1',
    requestor: 'John Doe',
    department: 'IT',
    requestNumber: 'REQ-001',
    dateRequested: '2024-06-01',
    approvedBy: 'Jane Smith',
    releasedBy: 'Mark Lee',
    dateReleased: '2024-06-02',
    notes: 'Urgent request for project X',
    items: [
      {
        inventoryItemId: '1',
        inventoryItem: mockInventoryItems[0],
        quantity: 2,
        notes: 'For project X',
      },
      {
        inventoryItemId: '2',
        inventoryItem: mockInventoryItems[1],
        quantity: 1,
        notes: 'For repair',
      },
    ],
  },
];

export default function IssuancesPage() {
  const [issuances, setIssuances] = useState<Issuance[]>(mockIssuances);
  const [showModal, setShowModal] = useState(false);
  // Form fields
  const [requestor, setRequestor] = useState("");
  const [department, setDepartment] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [dateRequested, setDateRequested] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [approvedBy, setApprovedBy] = useState("");
  const [releasedBy, setReleasedBy] = useState("");
  const [dateReleased, setDateReleased] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState("");
  // Item input
  const [itemId, setItemId] = useState<string>(mockInventoryItems[0]?.id || "");
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemNotes, setItemNotes] = useState("");
  // Items table
  const [formItems, setFormItems] = useState<IssuanceItem[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [itemSearchOpen, setItemSearchOpen] = useState(false);
  const [viewIssuance, setViewIssuance] = useState<Issuance | null>(null);

  const handleAddOrEditItem = () => {
    const itemObj: IssuanceItem = {
      inventoryItemId: itemId,
      inventoryItem: mockInventoryItems.find(i => i.id === itemId),
      quantity: itemQty,
      notes: itemNotes,
    };
    if (editIdx !== null) {
      setFormItems(items => items.map((it, idx) => idx === editIdx ? itemObj : it));
      setEditIdx(null);
    } else {
      setFormItems(items => [...items, itemObj]);
    }
    setItemId(mockInventoryItems[0]?.id || "");
    setItemQty(1);
    setItemNotes("");
  };

  const handleEditItem = (idx: number) => {
    const item = formItems[idx];
    setItemId(item.inventoryItemId);
    setItemQty(item.quantity);
    setItemNotes(item.notes);
    setEditIdx(idx);
  };

  const handleRemoveItem = (idx: number) => {
    setFormItems(items => items.filter((_, i) => i !== idx));
    if (editIdx === idx) {
      setEditIdx(null);
      setItemId(mockInventoryItems[0]?.id || "");
      setItemQty(1);
      setItemNotes("");
    }
  };

  const handleCreateIssuance = (e: React.FormEvent) => {
    e.preventDefault();
    const newIssuance: Issuance = {
      id: `iss-${Date.now()}`,
      requestor,
      department,
      requestNumber,
      dateRequested,
      approvedBy,
      releasedBy,
      dateReleased,
      notes,
      items: formItems,
    };
    setIssuances(prev => [newIssuance, ...prev]);
    setShowModal(false);
    // Reset form
    setRequestor("");
    setDepartment("");
    setRequestNumber("");
    setDateRequested(format(new Date(), 'yyyy-MM-dd'));
    setApprovedBy("");
    setReleasedBy("");
    setDateReleased(format(new Date(), 'yyyy-MM-dd'));
    setNotes("");
    setFormItems([]);
    setItemId(mockInventoryItems[0]?.id || "");
    setItemQty(1);
    setItemNotes("");
    setEditIdx(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issuances</h1>
          <p className="text-gray-600 mt-2">
            View and record all inventory issuances.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          New Issuance
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Requested</TableHead>
            <TableHead>Requestor</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Request #</TableHead>
            <TableHead>Note/s</TableHead>
            <TableHead>Approved By</TableHead>
            <TableHead>Released By</TableHead>
            <TableHead>Date Released</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issuances.map((iss) => (
            <TableRow key={iss.id}>
              <TableCell>{iss.dateRequested}</TableCell>
              <TableCell>{iss.requestor}</TableCell>
              <TableCell>{iss.department}</TableCell>
              <TableCell>{iss.requestNumber}</TableCell>
              <TableCell>{iss.notes}</TableCell>
              <TableCell>{iss.approvedBy}</TableCell>
              <TableCell>{iss.releasedBy}</TableCell>
              <TableCell>{iss.dateReleased}</TableCell>
              <TableCell>
                <Button size="icon" variant="outline" onClick={() => setViewIssuance(iss)} aria-label="View">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* New Issuance Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
          <div className="flex flex-col min-h-[70vh]">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                <ListPlus className="h-6 w-6 text-blue-600" />
                New Issuance
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateIssuance} className="flex-1 px-6 pb-4 space-y-8">
              {/* Requestor & Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-medium">
                    <User className="h-4 w-4 text-gray-500" /> Requestor
                  </label>
                  <Input value={requestor} onChange={e => setRequestor(e.target.value)} required placeholder="Enter requestor name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-medium">
                    <Hash className="h-4 w-4 text-gray-500" /> Request #
                  </label>
                  <Input value={requestNumber} onChange={e => setRequestNumber(e.target.value)} required placeholder="e.g. REQ-001" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-medium">
                    <Building2 className="h-4 w-4 text-gray-500" /> Department
                  </label>
                  <Input value={department} onChange={e => setDepartment(e.target.value)} required placeholder="e.g. IT, HR, etc." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-gray-500" /> Date Requested
                  </label>
                  <Input type="date" value={dateRequested} onChange={e => setDateRequested(e.target.value)} required />
                </div>
              </div>

              {/* Add Item Section */}
              <div className="rounded-lg border bg-gray-50 p-4 mb-2">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-lg">Add Item to Issuance</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Label>Item</Label>
                    <Popover open={itemSearchOpen} onOpenChange={setItemSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={itemSearchOpen}
                          className="w-full justify-between"
                        >
                          {mockInventoryItems.find(i => i.id === itemId)?.name || 'Select Item'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search item..." />
                          <CommandList>
                            <CommandEmpty>No item found.</CommandEmpty>
                            {mockInventoryItems.map(item => (
                              <CommandItem
                                key={item.id}
                                value={item.name}
                                onSelect={() => {
                                  setItemId(item.id);
                                  setItemSearchOpen(false);
                                }}
                              >
                                {item.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" min={1} value={itemQty} onChange={e => setItemQty(parseInt(e.target.value) || 1)} className="w-24" />
                  </div>
                  <div className="flex-1">
                    <Label>Note/s</Label>
                    <Input value={itemNotes} onChange={e => setItemNotes(e.target.value)} placeholder="Note/s" />
                  </div>
                  <Button type="button" onClick={handleAddOrEditItem} className="h-10" variant={editIdx !== null ? 'default' : 'secondary'}>
                    {editIdx !== null ? <ClipboardCheck className="h-4 w-4 mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                    {editIdx !== null ? 'Update' : 'Add Item'}
                  </Button>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Note/s</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formItems.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.inventoryItem?.name || item.inventoryItemId}</TableCell>
                        <TableCell>{item.inventoryItem?.description || '-'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.notes}</TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-2">
                            <Button type="button" size="icon" variant="outline" onClick={() => handleEditItem(idx)} aria-label="Edit">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveItem(idx)} aria-label="Remove">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {formItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">No items added.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Notes Section - full width */}
              <div>
                <label className="flex items-center gap-2 font-medium mb-1">
                  <FileText className="h-4 w-4 text-gray-500" /> Note/s
                </label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="General notes for this issuance" className="w-full" />
              </div>

              {/* Approval Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-gray-500" /> Approved By
                    </label>
                    <Input value={approvedBy} onChange={e => setApprovedBy(e.target.value)} required className="w-full" />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-gray-500" /> Released By
                    </label>
                    <Input value={releasedBy} onChange={e => setReleasedBy(e.target.value)} required className="w-full" />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-gray-500" /> Date Released
                    </label>
                    <Input type="date" value={dateReleased} onChange={e => setDateReleased(e.target.value)} required />
                  </div>
                </div>
              </div>
            </form>
            <div className="px-6 pb-6 pt-2 border-t bg-white w-full flex flex-row justify-end gap-2 flex-nowrap">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="issuance-form" className="bg-blue-600 text-white hover:bg-blue-700">
                <ListPlus className="h-4 w-4 mr-1" />Create Issuance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Issuance Modal */}
      <Dialog open={!!viewIssuance} onOpenChange={open => !open && setViewIssuance(null)}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Eye className="h-6 w-6 text-blue-600" />
              Issuance Details
            </DialogTitle>
          </DialogHeader>
          {viewIssuance && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Requestor:</strong> {viewIssuance.requestor}</div>
                <div><strong>Request #:</strong> {viewIssuance.requestNumber}</div>
                <div><strong>Department:</strong> {viewIssuance.department}</div>
                <div><strong>Date Requested:</strong> {viewIssuance.dateRequested}</div>
                <div><strong>Approved By:</strong> {viewIssuance.approvedBy}</div>
                <div><strong>Released By:</strong> {viewIssuance.releasedBy}</div>
                <div><strong>Date Released:</strong> {viewIssuance.dateReleased}</div>
              </div>
              <div>
                <strong>Note/s:</strong>
                <div className="bg-gray-50 rounded p-2 mt-1 text-gray-700 whitespace-pre-line">
                  {viewIssuance.notes || <span className="italic text-gray-400">No notes</span>}
                </div>
              </div>
              <div>
                <strong>Items:</strong>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Note/s</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewIssuance.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.inventoryItem?.name || item.inventoryItemId}</TableCell>
                        <TableCell>{item.inventoryItem?.description || '-'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 