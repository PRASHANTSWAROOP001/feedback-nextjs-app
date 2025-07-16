"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "../ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import DeleteWorkspacePopover from "../dashboard/DeleteWorkspacepop";
import { deleteEmail, updateEmail } from "@/app/action/email/emailActions";
import EditWorkspacePopover from "../dashboard/WorkspaceEditPop";

interface EmailData{
  id:string,
  email:string,
  createdAt:Date,
  updatedAt: Date|null
}


export default function EmailTable() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const workspaceId = searchParams.get("workspaceId");
  const categoryId = searchParams.get("categoryId");
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<EmailData[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

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
          setEmail(result.data?.emails || []);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  console.log("emails at useState", email);

  return (
    <div className="flex justify-center items-center  mt-20 p-4">
      <div className="w-full max-w-4xl overflow-x-auto border rounded-2xl shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {email.length > 0 ? (
              email.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditWorkspacePopover currentName={item.email} editAttribute="Email" id={item.id} handleEdit={updateEmail}></EditWorkspacePopover>
                    <DeleteWorkspacePopover id={item.id} handleDelete={deleteEmail}></DeleteWorkspacePopover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No emails found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex justify-center py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={
                            page <= 1 ? "pointer-events-none opacity-50" : ""
                          }
                          onClick={() => {
                            if (page > 1) {
                              const newPage = page - 1;
                              const params = new URLSearchParams(
                                searchParams.toString()
                              );
                              params.set("page", String(newPage));
                              window.history.pushState(
                                {},
                                "",
                                `?${params.toString()}`
                              );
                            }
                          }}
                        />
                      </PaginationItem>
                      <div className="px-4 text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </div>
                      <PaginationItem>
                        <PaginationNext
                          className={
                            page >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                          onClick={() => {
                            if (page < totalPages) {
                              const newPage = page + 1;
                              const params = new URLSearchParams(
                                searchParams.toString()
                              );
                              params.set("page", String(newPage));
                              window.history.pushState(
                                {},
                                "",
                                `?${params.toString()}`
                              );
                            }
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
