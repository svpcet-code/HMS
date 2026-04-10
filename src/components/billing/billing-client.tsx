"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreHorizontal, ArrowUpRight, Trash2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteInvoice } from "@/actions/billing";
import { AddInvoiceModal } from "@/components/modals/add-invoice-modal";

interface Invoice {
  id: string;
  patientId: string;
  amount: number;
  status: string;
  type: string;
  createdAt: Date;
  patient: {
    name: string;
  };
}

interface BillingClientProps {
  initialInvoices: Invoice[];
  patients: { id: string; name: string }[];
}

export function BillingClient({ initialInvoices, patients }: BillingClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredInvoices = initialInvoices.filter(inv => {
    const matchesSearch = inv.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? inv.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = initialInvoices
    .filter(inv => inv.status === "PAID")
    .reduce((acc, inv) => acc + inv.amount, 0);

  const pendingPayments = initialInvoices
    .filter(inv => inv.status === "UNPAID" || inv.status === "PENDING")
    .reduce((acc, inv) => acc + inv.amount, 0);

  const pendingCount = initialInvoices.filter(inv => inv.status === "UNPAID" || inv.status === "PENDING").length;

  const getStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case "PAID": 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
      case "UNPAID": 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Unpaid</span>;
      case "PENDING": 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>;
      default: 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const handleExport = () => {
    const headers = ["Invoice ID", "Patient", "Type", "Amount", "Status", "Date"];
    const rows = filteredInvoices.map(inv => [
      inv.id,
      inv.patient.name,
      inv.type,
      inv.amount.toString(),
      inv.status,
      new Date(inv.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billing_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Billing & Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage patient invoices and payments</p>
        </div>
        <AddInvoiceModal patients={patients} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase tracking-wider text-[10px]">Total Revenue</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs font-medium text-green-600 mt-2 flex items-center bg-green-50 w-fit px-2 py-1 rounded-full"><ArrowUpRight className="h-3 w-3 mr-1" /> +12% growth</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 font-bold uppercase tracking-wider text-[10px]">Pending Payments</p>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-500">₹{pendingPayments.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">{pendingCount} invoices pending</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search invoices by ID or patient..." 
              className="pl-10 h-12 rounded-2xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus-visible:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none h-12 rounded-2xl text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 font-bold">
                  <Filter className="mr-2 h-4 w-4" /> {statusFilter || "Filter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl p-1">
                <DropdownMenuItem onClick={() => setStatusFilter(null)} className="rounded-lg">All Statuses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PAID")} className="rounded-lg text-green-600 font-bold">Paid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("UNPAID")} className="rounded-lg text-red-600 font-bold">Unpaid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PENDING")} className="rounded-lg text-amber-600 font-bold">Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
                onClick={handleExport}
                variant="outline" 
                className="flex-1 sm:flex-none h-12 rounded-2xl text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 font-bold"
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30">
            <TableRow className="dark:border-slate-700 hover:bg-transparent">
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400 py-6 pl-8">Invoice ID</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Patient</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Service Type</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Date</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Amount</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800 border-b border-slate-100 transition-colors group">
                  <TableCell className="font-black text-slate-900 dark:text-slate-200 pl-8 text-xs">{invoice.id}</TableCell>
                  <TableCell className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">
                            {invoice.patient.name.charAt(0)}
                        </div>
                        {invoice.patient.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                        {invoice.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-black text-slate-900 dark:text-slate-100">₹{invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-1">
                        <DropdownMenuItem className="rounded-lg cursor-pointer">
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => handleDelete(invoice.id)}
                            className="rounded-lg text-red-600 focus:text-red-600 cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="dark:border-slate-700">
                <TableCell colSpan={7} className="h-64 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Receipt className="h-12 w-12 text-slate-100" />
                    <p className="font-bold text-slate-300">No invoices found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
