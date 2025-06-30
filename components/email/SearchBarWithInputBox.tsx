'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useWorkspaceStore } from "@/store/useWorkspaceStore"
import { toast } from "sonner"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card"
import { Label } from "../ui/label"

type UploadEmailProp = {
  selectCategory: {
    id: string;
    category: string;
  }[];
};

export default function SearchBarWithInput({ selectCategory }: UploadEmailProp) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { workspaceId } = useWorkspaceStore()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get("categoryId"))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspaceId) {
      toast("missing workspaceId")
      return
    }

    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (categoryId) params.set("categoryId", categoryId)
    params.set("workspaceId", workspaceId)
    params.set("page", "1")
    router.push(`/dashboard/email?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    if (!workspaceId) {
      toast("missing workspaceId")
      return
    }

    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (value) params.set("categoryId", value)
    params.set("workspaceId", workspaceId)
    params.set("page", "1")
    router.push(`/dashboard/email?${params.toString()}`)
  }

  return (
    <Card className="w-full md:w-[350px] border-2 h-[350px] border-orange-400 flex flex-col justify-between">
      <CardHeader className="text-center">
        <Label className="text-sm">Search Emails</Label>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search email..."
          className="w-full"
        />

        <Select onValueChange={handleCategoryChange} defaultValue={categoryId || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            {selectCategory.map((value) => (
              <SelectItem key={value.id} value={value.id}>
                {value.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>

      <CardFooter className="px-6">
        <Button type="submit" onClick={handleSearch} className="w-full">
          Search
        </Button>
      </CardFooter>
    </Card>
  )
}
