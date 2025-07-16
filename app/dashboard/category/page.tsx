"use client"
import SearchInput from "@/components/category/seachbar"
import createCategory from "@/app/action/createCategory"
import ReusablePopover from "@/components/dashboard/AddCategory"
import PaginatedList from "@/components/category/PaginatedList"
import EditCategoryPopover from "@/components/category/editCategoryPopover"
import DeleteCategoryPopover from "@/components/category/deleteCategoryPopover"
import deleteCategory from "@/app/action/category/deleteCategory"
import editCategory from "@/app/action/category/editCategory"

interface CategoryData{
  id:string,
  name:string
}

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
          <SearchInput baseUrl="/dashboard/category" placeholder="Search Category ..." />
        </div>
      </div>

      {/* Scrollable Area With Enough Padding */}
      <div className="px-4">
        <PaginatedList  fetchUrl="/api/category"  queryKey="category"   renderItem={(cat:CategoryData) => (
        <li
          key={cat.id}
          className="p-4 rounded border border-gray-300 shadow-sm flex justify-between items-center flex-wrap gap-y-2"
        >
          <span className="text-lg font-medium text-gray-800">
            {cat.name}
          </span>
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
      )}
    />
      </div>
    </main>
  )
}

