import { Button } from "@/components/ui/button"
import SearchInput from "@/components/category/seachbar"
import CategoryPageDisplay from "@/components/category/categoryResult"
import createCategory from "@/app/action/createCategory"
import ReusablePopover from "@/components/dashboard/AddCategory"
export default function CategoryPage() {
  return (
    <main className="w-full min-h-screen relative">
      {/* Fixed Title */}
      <div className="sticky top-0 z-20 bg-white  pb-4">
        <div className="flex justify-between items-center px-4 pt-4">
          <h1 className="text-3xl font-bold">Categories</h1>
          <ReusablePopover actionHanlder={createCategory} action_button="Save" />
        </div>
        <div className="px-4 mt-4 max-w-xl mx-auto">
          <SearchInput />
        </div>
      </div>

      {/* Scrollable Area With Enough Padding */}
      <div className="px-4">
        <CategoryPageDisplay />
      </div>
    </main>
  )
}

