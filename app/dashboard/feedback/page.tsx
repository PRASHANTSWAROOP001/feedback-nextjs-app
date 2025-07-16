import { getAllTopics } from "@/app/action/topic/topicActions"
import { Topic } from "@prisma/client"
import FeedbackAdminPage from "@/components/feedback/FeedbackDisplay"

export default async function FeedbackPage(){
    const topicResponse  = await getAllTopics()
    const topicArray:Topic[]|undefined = topicResponse.data
    return <main className="w-full h-screen">

        <section className="py-5">
            <FeedbackAdminPage topicArray={topicArray && topicArray.length ? topicArray : []}></FeedbackAdminPage>
        </section>

    </main>
}
