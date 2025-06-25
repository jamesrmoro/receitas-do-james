'use client';

import { useEffect, useState } from 'react';
import './StarRating.css';

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_BASE || 'https://jamesrmoro.me/receitas-do-james/wp-json/wp/v2';

export default function StarRating({ postId }: { postId: number }) {
  const [media, setMedia] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [clickedRating, setClickedRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`${WP_API_BASE}/posts/${postId}`);
        const data = await res.json();

        if (data?.acf?.rate_media) setMedia(parseFloat(data.acf.rate_media));
        if (data?.acf?.rate_count) setCount(parseInt(data.acf.rate_count));
      } catch (err) {
        console.error('Erro ao buscar média:', err);
      }
    };

    fetchMedia();
  }, [postId]);

  const handleClick = async (value: number) => {
    setClickedRating(value);

    try {
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, rating: value }),
      });

      const result = await res.json();
      if (result.media) setMedia(parseFloat(result.media));
      if (result.count) setCount(parseInt(result.count));
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    }
  };

  const visualRating = clickedRating ?? (media ?? 0);

  return (
    <div className="star-rating">
      <p>O que achou deste post?</p>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= Math.floor(visualRating);
          const isHalf = !isFilled && value - visualRating <= 0.5;
          return (
            <button
              key={value}
              onClick={() => handleClick(value)}
              className={`star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
              aria-label={`${value} estrelas`}
            >
              ★
            </button>
          );
        })}
      </div>

      {media !== null && (
        <p className="media">
          Média atual: {media.toFixed(1)} ★ ({count ?? 0} avaliações)
        </p>
      )}
    </div>
  );
}
