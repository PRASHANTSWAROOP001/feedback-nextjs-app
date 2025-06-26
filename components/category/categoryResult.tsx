// app/dashboard/category/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useWorkspaceStore } from "@/store/useWorkspaceStore"
import { toast } from "sonner"

export default function CategoryPageDisplay() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const {workspaceId} = useWorkspaceStore()

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        if(!workspaceId){
            toast("missing workspace id")
            return;
        }
        
        const res = await fetch(
          `/api/category?q=${query}&page=${page}&limit=10&workspaceId=${workspaceId}`
        )
        const data = await res.json()
        setCategories(data.data || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [query, page, workspaceId])

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Categories</h1>

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat: any) => (
            <li
              key={cat.id}
              className="p-3 rounded border border-gray-300 shadow-sm"
            >
              {cat.name}
            </li>
          ))}
        </ul>
      )}

      {/* Optional: Add pagination controls */}
    </div>
  )
}
