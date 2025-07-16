"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OrderStatus } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonCard } from "../shared/SkeltonCard";

interface OrderResponse{
  status:OrderStatus,
  razorPayOrderId:string,
  currency:string,
  amount:number,
  createdAt:Date,
  pricing:{
    name:string
  },
  payments:{
    isVerified:boolean,
    failureReason:string,
  }[]

}

const FILTERS = ["CREATED", "PAID", "PENDING"];

function renderPayments(payments?: {
  isVerified: boolean;
  failureReason: string | null;
}): string {
  if (!payments) {
    return "Payment Abandoned";
  }

  if (payments.isVerified) {
    return "Paid";
  }

  return payments.failureReason || "Payment Failed";
}

export default function OrderTable() {
  const [order, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const url = `/api/order?orderId=${searchQuery}&page=${page}&limit=10&status=${selectedFilter}`

        const result = await axios.get(url);
        console.log(result)
        if (result.status === 200) {
         setOrders(result.data?.orderData || []);
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

    fetchOrders();
  }, [searchQuery, page, selectedFilter]);

  if(loading){
    return <SkeletonCard></SkeletonCard>
  }
  
  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                onClick={() => {
                  setSelectedFilter(filter);
                  setPage(1);
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Selected Plan</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.length > 0 ? (
                order.map((orderValues) => (
                  <TableRow key={orderValues.razorPayOrderId}>
                    <TableCell>{orderValues.razorPayOrderId}</TableCell>
                    <TableCell>{orderValues.status}</TableCell>
                    <TableCell>
                      {new Date(orderValues.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {(orderValues.amount)/100}/{orderValues.currency}
                    </TableCell>
                    <TableCell>
                      {orderValues.pricing.name}
                    </TableCell>
                    <TableCell>
                      {renderPayments(orderValues.payments[0])}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No emails found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setPage(1)} disabled={page === 1}>
                First
              </Button>
              <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                Prev
              </Button>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
              <Button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
