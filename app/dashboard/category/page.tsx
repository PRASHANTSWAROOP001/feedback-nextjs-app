import { Button } from "@/components/ui/button"
import SearchInput from "@/components/category/seachbar"
import CategoryPageDisplay from "@/components/category/categoryResult"

export default function CategoryPage() {
  return (
    <main className="w-full h-screen relative">
      {/* Fixed Title */}

      <div>
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 text-4xl z-10">
        <h1>Categories</h1>
      </div>

      {/* Fixed Button */}
      <aside className="fixed md:top-4 top-16 right-4 z-20">
        <Button>Category +</Button>
      </aside>
      </div>
 

      {/* Centered Search Input with Gap */}
<div className="fixed md:top-32 top-36  left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xl">
  <SearchInput />
</div>
<div>
  <CategoryPageDisplay></CategoryPageDisplay>
</div>

    </main>
  )
}