"use client"

import { Topic, Feedback } from "@prisma/client"
import { useState, useEffect } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ChevronLeft, ChevronRight, Star, MessageSquare, Calendar, User,
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

type FeedbackProp = {
  topicArray: Topic[]
}

const ITEMS_PER_PAGE = 5

interface FeedbackWithEmail extends Feedback{
  invitation:{
    emailEntry:{
      email:string
    }
  }
}

export default function FeedbackAdminPage({ topicArray }: FeedbackProp) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topicArray[0]?.id ?? "")
  const [currentPage, setCurrentPage] = useState(1)
  const [feedbackData, setFeedbackData] = useState<FeedbackWithEmail[]>([])
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!selectedTopicId) return

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/feedback?topicId=${selectedTopicId}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`)
        if (res.status === 200) {
          toast.success("Feedback loaded")
          setFeedbackData(res.data.data)
          setTotalFeedbackCount(res.data.total)
          setTotalPages(res.data.totalPage)
        }
      } catch (err) {
        toast.error("Failed to fetch feedback", {
          description: `${err}`
        })
      }
    }

    fetchData()
  }, [selectedTopicId, currentPage])

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId)
    setCurrentPage(1)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "bg-gray-100 text-gray-600"
    if (rating >= 8) return "bg-green-100 text-green-700"
    if (rating >= 6) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  const getTopicTitle = (topicId: string) => {
    const topic = topicArray.find((t) => t.id === topicId)
    return topic?.title || "Unknown Topic"
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback Management</h1>
        <p className="text-muted-foreground">Review and manage customer feedback across different topics</p>
      </div>

      {/* Topic Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Filter by Topic
          </CardTitle>
          <CardDescription>Select a topic to view related feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedTopicId} onValueChange={handleTopicChange}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {topicArray.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{totalFeedbackCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">
                  {feedbackData.length > 0
                    ? (
                        feedbackData.reduce((acc, f) => acc + (f.rating || 0), 0) /
                        feedbackData.filter((f) => f.rating).length
                      ).toFixed(1)
                    : "N/A"}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anonymous</p>
                <p className="text-2xl font-bold">{feedbackData.filter((f) => f.isAnonymous).length}</p>
              </div>
              <User className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4 mb-6">
        {feedbackData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
              <p className="text-muted-foreground">
                No feedback found for the selected topic: {getTopicTitle(selectedTopicId)}
              </p>
            </CardContent>
          </Card>
        ) : (
          feedbackData.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{feedback.isAnonymous ? "?" : feedback.invitation.emailEntry.email[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {feedback.isAnonymous ? "Anonymous User" : `${feedback.invitation.emailEntry.email}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(feedback.submittedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getTopicTitle(feedback.topicId)}</Badge>
                    {feedback.rating && (
                      <Badge className={getRatingColor(feedback.rating)}>
                        <Star className="h-3 w-3 mr-1" />
                        {feedback.rating}/10
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
