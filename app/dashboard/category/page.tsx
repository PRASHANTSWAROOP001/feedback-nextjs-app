import { Button } from "@/components/ui/button"
import SearchInput from "@/components/category/seachbar"
import CategoryPageDisplay from "@/components/category/categoryResult"
import createCategory from "@/app/action/createCategory"
import ReusablePopover from "@/components/dashboard/AddCategory"
export default function CategoryPage() {
  return (
    <main className="w-full min-h-screen relative">
      {/* Fixed Title */}
      <div>
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 text-4xl z-10">
          <h1>Categories</h1>
        </div>

        {/* Fixed Button */}
        <aside className="fixed md:top-4 top-16 right-4 z-20">
          <ReusablePopover actionHanlder={createCategory} action_button="Save"></ReusablePopover>
        </aside>
      </div>

      {/* Fixed Search Input */}
      <div className="fixed md:top-32 top-36 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-10">
        <SearchInput />
      </div>

      {/* Main Content should have top padding to avoid overlapping */}
      <div className="pt-45 px-4"> {/* Adjust pt (padding-top) as needed */}
        <CategoryPageDisplay />
      </div>
    </main>
  )
}
