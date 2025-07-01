// components/PaginatedList.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { toast } from "sonner";

type PaginatedListProps<T> = {
  queryKey: string; // e.g., "category", "email"
  fetchUrl: string; // URL to fetch, will include ?q=&page=...
  renderItem: (item: T) => React.ReactNode; // How each item is rendered
};

export default function PaginatedList<T>({
  queryKey,
  fetchUrl,
  renderItem,
}: PaginatedListProps<T>) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const {workspaceId} = useWorkspaceStore()
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if(!workspaceId){
        toast("missing workspaceId")
        return;
      }
      try {
        const res = await fetch(
          `${fetchUrl}?q=${query}&page=${page}&limit=10&workspaceId=${workspaceId}`
        );
        const data = await res.json();
        setItems(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(`Failed to fetch ${queryKey}`, err);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) fetchData();
  }, [query, page, workspaceId, fetchUrl, queryKey]);

  const handlePageChange = (pageNo: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", pageNo.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto w-full">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No {queryKey}s found.</p>
      ) : (
        <ul className="space-y-4">{items.map(renderItem)}</ul>
      )}

      <div className="mt-2">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (page > 1) handlePageChange(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (page < totalPages) handlePageChange(page + 1);
                  }}
                  className={
                    page >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
