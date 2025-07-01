
import TopicPopover from "@/components/dashboard/TopicPopOver"
import createTopic from "@/app/action/createTopic"
import SearchInput from "@/components/category/seachbar"
export default function TopicMainPage(){
    return(
        <main className="w-full min-h-screen relative">
                  <div className="sticky top-0 z-20 bg-white  pb-4">
        <div className="flex justify-between items-center px-4 pt-4">
          <h1 className="text-3xl font-bold text-center">Topic Management</h1>
          <TopicPopover actionHanlder={createTopic} action_button="Save" ></TopicPopover>
        </div>
        <div className="px-4 mt-4 max-w-xl mx-auto">
            <SearchInput baseUrl="/dashboard/topic" placeholder="Search Topic ..." ></SearchInput>
        </div>
      </div>
        </main>
    )
}