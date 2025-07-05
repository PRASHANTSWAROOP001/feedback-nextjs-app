'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


interface TokenData {
  id: string;
  token: string;
  topicId: string;
  used: boolean;
}

const ratingEmojis = [
  { value: 1, emoji: '😡', label: 'Terrible' },
  { value: 2, emoji: '😞', label: 'Poor' },
  { value: 3, emoji: '😐', label: 'Fair' },
  { value: 4, emoji: '😕', label: 'Below Average' },
  { value: 5, emoji: '😌', label: 'Average' },
  { value: 6, emoji: '🙂', label: 'Good' },
  { value: 7, emoji: '😊', label: 'Very Good' },
  { value: 8, emoji: '😄', label: 'Great' },
  { value: 9, emoji: '🤩', label: 'Excellent' },
  { value: 10, emoji: '🥳', label: 'Outstanding' }
];

export default function FeedbackPage() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const token = searchParam.get("token")

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string>('');
  
  const [content, setContent] = useState('');
  const [rating, setRating] = useState([7]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {

    if(!token){
      toast("missing token data")
      return;
    }
    try {
      const response = await fetch(`/api/validate/?token=${token}`);
      const data = await response.json();

      console.log(data)
      
      if (data.success) {
        setIsValid(true);
        setTokenData(data.data);
      } else {
        setError(data.message || 'Invalid token');
        setIsValid(false);
      }
    } catch (err) {
      setError('Failed to validate token');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenData || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('inviteId', tokenData.id);
      formData.append('rating', rating[0].toString());

      const response = await fetch(`/api/validate/`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentEmoji = ratingEmojis.find(e => e.value === rating[0]) || ratingEmojis[6];

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Validating your invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 text-center">Your feedback has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Send className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Share Your Feedback
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            We'd love to hear your thoughts and experiences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Content Textarea */}
            <div className="space-y-3">
              <label htmlFor="content" className="text-sm font-medium text-gray-700 block">
                Your Feedback
              </label>
              <Textarea
                id="content"
                placeholder="Tell us about your experience..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Rating Slider */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Rate Your Experience
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-4xl" role="img" aria-label={currentEmoji.label}>
                    {currentEmoji.emoji}
                  </span>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{rating[0]}</div>
                    <div className="text-sm text-gray-500">{currentEmoji.label}</div>
                  </div>
                </div>
              </div>
              
              <div className="px-4">
                <Slider
                  value={rating}
                  onValueChange={setRating}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Emoji Scale */}
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {ratingEmojis.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRating([item.value])}
                    className={cn(
                      "p-2 rounded-lg text-2xl transition-all hover:scale-110",
                      rating[0] === item.value
                        ? "bg-blue-100 ring-2 ring-blue-500"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}