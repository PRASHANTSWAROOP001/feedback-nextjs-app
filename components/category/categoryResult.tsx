// app/dashboard/category/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useWorkspaceStore } from "@/store/useWorkspaceStore"
import { toast } from "sonner"
import deleteCategory from "@/app/action/category/deleteCategory"
import editCategory from "@/app/action/category/editCategory"
import EditCategoryPopover from "./editCategoryPopover"
import DeleteCategoryPopover from "./deleteCategoryPopover"

export default function CategoryPageDisplay() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const { workspaceId } = useWorkspaceStore()

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        if (!workspaceId) {
          toast("Missing workspace ID")
          return
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
    <div className="p-4 max-w-3xl mx-auto w-full">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat: any) => (
            <li
              key={cat.id}
              className="p-4 rounded border border-gray-300 shadow-sm flex justify-between items-center flex-wrap gap-y-2"
            >
              <span className="text-lg font-medium text-gray-800">{cat.name}</span>

              <div className="flex gap-x-2">
                <EditCategoryPopover
                  currentName={cat.name}
                  handleEdit={editCategory}
                  id={cat.id}
                />
                <DeleteCategoryPopover
                  handleDelete={deleteCategory}
                  id={cat.id}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
