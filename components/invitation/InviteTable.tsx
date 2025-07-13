"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Topic } from "@/app/generated/prisma";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SkeletonCard } from "../shared/SkeltonCard";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface InvitationData {
  id: string;
  used: boolean;
  sentAt: Date;
  submittedAt?: Date;
  expiresAt?: Date;
  emailEntryId: string;
  inviteStatus: "SENT" | "FAILED" | "PENDING";
}

type InviteTableProp = {
  topicArray: Topic[];
};

export default function InviteTable({ topicArray }: InviteTableProp) {
  const [inviteData, setInviteData] = useState<InvitationData[]>([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  console.log(inviteData)

  useEffect(() => {
    const fetchInvites = async () => {
      if (selectedTopic === null) {
        toast("Please select a topic");
        return;
      }
      setLoading(true);
      try {
        const result = await axios.get(
          `/api/invitation?topicId=${selectedTopic}&page=${page}&limit=10`
        );

        console.log(result);
        setInviteData(result.data?.data || []);
        setTotalPages(result?.data?.data?.totalPages || 1);
      } catch (err) {
        toast("Error fetching invites");
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, [selectedTopic, page]);

  const handleInviteSelect = (id: string) => {
    setSelectedInviteIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((inv) => inv !== id)
        : [...prev, id];

      const qParam = newSelection.join(",");
      router.replace(`?q=${qParam}`, { scroll: false });

      return newSelection;
    });
  };

  if (loading) return <SkeletonCard />;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Topic Selector */}
        <div className="flex items-center gap-4">
          <Select
            onValueChange={(val) => {
              setSelectedTopic(val);
              setPage(1); // reset page on topic change
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              {topicArray.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline">Selected: {selectedInviteIds.length}</Badge>
        </div>

        {/* Invite Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Select</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Email ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteData.length > 0 ? (
                inviteData.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <Checkbox
                        className="py-1"
                        checked={selectedInviteIds.includes(invite.id)}
                        onCheckedChange={() => handleInviteSelect(invite.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {invite.used ? (
                        <Badge className="bg-green-100 text-green-800">
                          Yes
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(invite.sentAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {invite.submittedAt
                        ? new Date(invite.submittedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {invite.expiresAt
                        ? new Date(invite.expiresAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{invite.emailEntryId}</TableCell>
                    <TableCell>
                      {invite.inviteStatus === "SENT" ? (
                        <Badge className="bg-green-100 text-green-800">
                          SENT
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          FAILED/PENDING
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No invites found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
