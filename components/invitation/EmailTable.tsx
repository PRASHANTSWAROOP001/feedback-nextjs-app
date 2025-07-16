"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Topic } from "@/app/generated/prisma";
import { Category } from "@/app/generated/prisma";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Send,
} from "lucide-react";

interface Email {
  id: string;
  email: string;
  createdAt: string;
}

import { SkeletonCard } from "../shared/SkeltonCard";

type EmailTableProp = {
  categoryArray: Category[];
  topicArray: Topic[];
};

export default function EmailTable({ categoryArray, topicArray}: EmailTableProp) {
  const { workspaceId } = useWorkspaceStore();
  const [emails, setEmails] = useState<Email[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [topic, selectTopic] = useState<string|null>(null)

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        if (!workspaceId) {
          toast("Missing workspace ID.");
          return;
        }

        const url = `/api/email?q=${searchQuery}&page=${page}&limit=10&workspaceId=${workspaceId}${
          categoryId ? `&categoryId=${categoryId}` : ""
        }`;

        const result = await axios.get(url);
        if (result.status === 200) {
          setEmails(result.data?.emails || []);
          setTotalPages(result.data?.totalPages || 1);
        } else {
          toast("Failed to fetch emails");
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
        toast("Something went wrong while fetching emails.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [workspaceId, page, categoryId, searchQuery]);

  const getEmailStatus = (createdAt: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (days <= 1) return "active";
    if (days <= 7) return "pending";
    return "inactive";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEmailSelect = (id: string) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = (checked: boolean) => {
    const currentIds = emails.map((e) => e.id);
    if (checked) {
      setSelectedEmails((prev) => [...new Set([...prev, ...currentIds])]);
    } else {
      setSelectedEmails((prev) => prev.filter((id) => !currentIds.includes(id)));
    }
  };

  const isAllSelected =
    emails.length > 0 &&
    emails.every((email) => selectedEmails.includes(email.id));

  const handleSendInvitations = async () => {
    if (selectedEmails.length === 0) {
      toast("Please select at least one email.");
      return;
    }

    if (topic == null) {
      toast("missing topic id please select one");
      return;
    }

    if(workspaceId == null){
      return;
    }

    try {
      const formData = new FormData();

      formData.append("topicId", topic);

      formData.append("workspaceId", workspaceId)

      selectedEmails.forEach((val) => formData.append("emailIds", val));

  const sendInviteResponse = await axios.post("/api/invitation",formData,{headers:{
    "Content-Type":"multipart/form-data"
  }});

      if (sendInviteResponse.status == 200) {
        console.log(sendInviteResponse);
        toast(`Invitations sent to ${selectedEmails.length} emails.`);
        setSelectedEmails([]);
      }
    } catch (error) {
      toast(`error happend while sending invites ${error}`, );
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryId(null);
    setPage(1);
  };

  const getEmailDomain = (email: string) => email.split("@")[1] || "";

  if(loading){
    return <SkeletonCard></SkeletonCard>
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-l-blue-500 bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-600">Total Emails</p>
            <p className="text-2xl font-bold">{emails.length}</p>
          </div>
          <div className="border-l-4 border-l-green-500 bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-600">Selected</p>
            <p className="text-2xl font-bold">{selectedEmails.length}</p>
          </div>
          <div className="border-l-4 border-l-purple-500 bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-600">Page</p>
            <p className="text-2xl font-bold">{page}</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Email List</h2>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select onValueChange={(val) => setCategoryId(val)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      categoryId
                        ? categoryArray.find((c) => c.id === categoryId)?.name
                        : "Select Category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categoryArray.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setPage(1)}>Filter</Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAllCurrentPage}
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.length > 0 ? (
                  emails.map((email) => {
                    const status = getEmailStatus(email.createdAt);
                    return (
                      <TableRow key={email.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEmails.includes(email.id)}
                            onCheckedChange={() => handleEmailSelect(email.id)}
                          />
                        </TableCell>
                        <TableCell>{email.email}</TableCell>
                        <TableCell>{getEmailDomain(email.email)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(email.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <Mail className="w-6 h-6 mx-auto text-gray-400" />
                      <p>No emails found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              {selectedEmails.length > 0 ? (
                <>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedEmails.length} selected
                  </Badge>
                  <span> ready for invitation</span>
                </>
              ) : (
                "No emails selected"
              )}
            </div>
               <Select onValueChange={(val) => selectTopic(val)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      categoryId
                        ? topicArray.find((c) => c.id === categoryId)?.title
                        : "Select topic"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {topicArray.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            <Button
              onClick={handleSendInvitations}
              disabled={selectedEmails.length === 0 || topic === null}
              className="bg-blue-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Invitations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
