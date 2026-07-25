"use client";

import { useState } from 'react';
import { toggleLike } from '@/actions/forum';

export default function LikeButton({ topicId, initialCount, initialLiked }: { topicId: string, initialCount: number, initialLiked: boolean }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLike() {
    if (isPending) return;
    setIsPending(true);
    setErrorMsg('');
    
    // Store previous state for safe revert
    const previousLiked = isLiked;
    const previousCount = count;
    
    // Optimistic UI update
    setIsLiked(!previousLiked);
    setCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const result = await toggleLike(topicId);
      
      if (!result.success) {
        // Revert exactly to previous state if error
        setIsLiked(previousLiked);
        setCount(previousCount);
        setErrorMsg(result.error || 'تعذر تسجيل الإعجاب');
      } else {
        // Trust the server's exact displayed count
        setIsLiked(result.liked as boolean);
        setCount(result.displayedCount as number);
      }
    } catch (err) {
      console.error(err);
      setIsLiked(previousLiked);
      setCount(previousCount);
      setErrorMsg('خطأ غير متوقع');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleLike}
        disabled={isPending}
        className={`text-sm flex items-center transition ${isLiked ? 'text-red-500 font-bold' : 'text-gray-500 hover:text-red-500'} disabled:opacity-50`}
      >
        <span className="mr-1">{isLiked ? '❤️' : '🤍'}</span> 
        <span className="mr-1" dir="ltr">{count}</span> إعجاب
      </button>
      {errorMsg && <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">{errorMsg}</span>}
    </div>
  );
}
