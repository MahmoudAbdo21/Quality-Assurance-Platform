"use client";

import { useState } from 'react';
import { toggleLike } from '@/actions/forum';

export default function LikeButton({ topicId, initialCount, initialLiked }: { topicId: string, initialCount: number, initialLiked: boolean }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  async function handleLike() {
    if (isPending) return;
    setIsPending(true);
    
    // Optimistic UI update
    setIsLiked(!isLiked);
    setCount(prev => isLiked ? prev - 1 : prev + 1);

    const result = await toggleLike(topicId);
    
    if (result.error) {
      // Revert if error
      setIsLiked(isLiked);
      setCount(initialCount);
      alert(result.error);
    }
    
    setIsPending(false);
  }

  return (
    <button 
      onClick={handleLike}
      disabled={isPending}
      className={`text-sm flex items-center transition ${isLiked ? 'text-red-500 font-bold' : 'text-gray-500 hover:text-red-500'}`}
    >
      <span className="mr-1">{isLiked ? '❤️' : '🤍'}</span> 
      <span className="mr-1" dir="ltr">{count}</span> إعجاب
    </button>
  );
}
