"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Send,
  Mail,
  Users,
  Filter
} from 'lucide-react';

interface Email {
  id: string;
  email: string;
  createdAt: string;
}

export default function EmailTable() {
  const searchParam = useSearchParams();
  const query = searchParam.get("q") || "";
  const page = parseInt(searchParam.get("page") || "1");
  const workspaceId = searchParam.get("workspaceId");
  const categoryId = searchParam.get("categoryId");
  
  const [loading, setLoading] = useState<boolean>(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      console.log("started fetching");
      try {
        if (!workspaceId || !categoryId) {
          toast("missing workspaceId and categoryId in url");
          return;
        }

        const result = await axios.get(
          `/api/email?q=${query}&page=${page}&limit=10&workspaceId=${workspaceId}&categoryId=${categoryId}`
        );
        console.log(result);
        if (result.status == 200) {
          setEmails(result.data?.emails || []);
          setTotalPages(result.data?.totalPages || 1);
          toast("data fetched successfully");
        }
      } catch (error) {
        console.error("error happened while fetching the emails", error);
        toast("error happened at email table");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [workspaceId, categoryId, query, page]);

  const getEmailStatus = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) return 'active';
    if (daysDiff <= 7) return 'pending';
    return 'inactive';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const isAllSelected = emails.length > 0 && 
    emails.every(email => selectedEmails.includes(email.id));

  const handleSelectAllCurrentPage = (checked: boolean) => {
    emails.forEach(email => {
      if (checked && !selectedEmails.includes(email.id)) {
        handleEmailSelect(email.id);
      } else if (!checked && selectedEmails.includes(email.id)) {
        handleEmailSelect(email.id);
      }
    });
  };

  const goToPage = (newPage: number) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(newPage));
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleSendInvitations = () => {
    if (selectedEmails.length === 0) {
      toast("No emails selected. Please select at least one email to send invitations.");
      return;
    }

    toast(`Successfully sent invitations to ${selectedEmails.length} recipients.`);
    setSelectedEmails([]);
  };

  const getEmailDomain = (email: string) => {
    return email.split('@')[1] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-xl font-semibold text-gray-700">Loading emails...</h1>
        </div>
      </div>
    );
  }

  console.log("emails at useState", emails);

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-bold text-gray-900">{emails.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">{selectedEmails.length}</p>
              </div>
              <Filter className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{page}</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Email List</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select emails to send invitations
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAllCurrentPage}
                      aria-label="Select all emails on current page"
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Domain</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.length > 0 ? (
                  emails.map((email) => {
                    const status = getEmailStatus(email.createdAt);
                    return (
                      <TableRow 
                        key={email.id} 
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedEmails.includes(email.id)}
                            onCheckedChange={() => handleEmailSelect(email.id)}
                            aria-label={`Select ${email.email}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {email.email}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {getEmailDomain(email.email)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(status)}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(email.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No emails found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-700">
                Showing page {page} of {totalPages}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={page === 1}
                  className="p-2"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={page === totalPages}
                  className="p-2"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {selectedEmails.length > 0 ? (
                  <>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selectedEmails.length} selected
                    </Badge>
                    <span>emails ready for invitation</span>
                  </>
                ) : (
                  <span>No emails selected</span>
                )}
              </div>
              
              <Button 
                onClick={handleSendInvitations}
                disabled={selectedEmails.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Invitations
                {selectedEmails.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-500 text-white ml-1">
                    {selectedEmails.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}