'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

type SearchInputProp = {
  baseUrl:string,
  placeholder:string
}

export default function SearchInput({baseUrl, placeholder}:SearchInputProp) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`${baseUrl}?q=${query}&page=1`)
  }

  return (
    <form onSubmit={handleSearch} className=" w-full flex items-center justify-center gap-3 ">
      <Input
        value={query}
        className="w-1/2  focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}