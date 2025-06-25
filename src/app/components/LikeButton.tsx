'use client';

import { useEffect, useRef, useState } from 'react';
import './LikeButton.css';

export default function LikeButton({
  postId,
  initialLikes = 0,
}: {
  postId: number;
  initialLikes: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(true);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const redHeartRef = useRef<SVGSVGElement>(null);
  const firstStrokeRef = useRef<SVGCircleElement>(null);
  const secondStrokeRef = useRef<SVGCircleElement>(null);
  const timelineRef = useRef<any>(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    const storageKey = `liked-post-${postId}`;
    const stored = localStorage.getItem(storageKey) === 'true';
    if (stored) setLiked(true);

    async function fetchLikes() {
      try {
        const res = await fetch(`https://jamesrmoro.me/receitas-do-james/wp-json/wp/v2/posts/${postId}`);
        const data = await res.json();
        if (data.acf && typeof data.acf.like === 'number') {
          setLikes(data.acf.like);
        }
      } catch (err) {
        console.error('Erro ao buscar likes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLikes();
  }, [postId]);

  useEffect(() => {
    const likeButton = buttonRef.current;
    const redHeart = redHeartRef.current;
    const firstStroke = firstStrokeRef.current;
    const secondStroke = secondStrokeRef.current;

    if (!likeButton || !redHeart || !firstStroke || !secondStroke) return;

    import('@mojs/core').then((mojs) => {
      const stroke = new mojs.Tween({
        duration: 400,
        easing: 'expo.out',
        onUpdate: (progress) => {
          firstStroke.setAttribute('r', `${progress * 10 + 5}`);
          secondStroke.setAttribute('r', `${Math.max(progress - 0.5, 0) * 10 + 5}`);
        },
      });

      const scale = new mojs.Tween({
        duration: 400,
        delay: 250,
        onUpdate: (progress) => {
          const bounce = mojs.easing.elastic.out(1.005 * progress - 0.005);
          redHeart.style.transform = `scale3d(${bounce}, ${bounce}, 1)`;
        },
      });

      const burst = new mojs.Burst({
        parent: likeButton,
        delay: 350,
        duration: 600,
        shape: 'circle',
        x: '50%',
        y: '50%',
        childOptions: {
          radius: { 5: 0 },
          type: 'line',
          stroke: ['#fde36d', '#97e8f5'],
          strokeWidth: 2,
        },
        radius: { 25: 40 },
        count: 6,
        isSwirl: true,
        swirlSize: 20,
        isRunLess: true,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      });

      timelineRef.current = new mojs.Timeline().add(stroke, scale, burst);
      isReadyRef.current = true;
    });
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (liked) return;

  setLiked(true);
  localStorage.setItem(`liked-post-${postId}`, 'true');

  const playAnimation = () => {
    if (
      timelineRef.current &&
      typeof timelineRef.current.play === 'function' &&
      redHeartRef.current
    ) {
      redHeartRef.current.style.transform = `scale3d(1, 1, 1)`;
      timelineRef.current.play();
    }
  };

  if (!isReadyRef.current) {
    // Aguarda a importação de mojs
    const mojs = await import('@mojs/core');
    // Recria timeline
    const likeButton = buttonRef.current;
    const redHeart = redHeartRef.current;
    const firstStroke = firstStrokeRef.current;
    const secondStroke = secondStrokeRef.current;

    const stroke = new mojs.Tween({
      duration: 400,
      easing: 'expo.out',
      onUpdate: (progress) => {
        firstStroke!.setAttribute('r', `${progress * 10 + 5}`);
        secondStroke!.setAttribute('r', `${Math.max(progress - 0.5, 0) * 10 + 5}`);
      },
    });

    const scale = new mojs.Tween({
      duration: 400,
      delay: 250,
      onUpdate: (progress) => {
        const bounce = mojs.easing.elastic.out(1.005 * progress - 0.005);
        redHeart!.style.transform = `scale3d(${bounce}, ${bounce}, 1)`;
      },
    });

    const burst = new mojs.Burst({
      parent: likeButton!,
      delay: 350,
      duration: 600,
      shape: 'circle',
      x: '50%',
      y: '50%',
      childOptions: {
        radius: { 5: 0 },
        type: 'line',
        stroke: ['#fde36d', '#97e8f5'],
        strokeWidth: 2,
      },
      radius: { 25: 40 },
      count: 6,
      isSwirl: true,
      swirlSize: 20,
      isRunLess: true,
      easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
    });

    timelineRef.current = new mojs.Timeline().add(stroke, scale, burst);
    isReadyRef.current = true;

    playAnimation(); // chama após carregar
  } else {
    playAnimation(); // timeline já pronta
  }

  // Atualiza backend
  const res = await fetch('https://jamesrmoro.me/receitas-do-james/wp-json/receitas/v1/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, key: 'SEGREDO123' }),
  });

  const data = await res.json();
  if (data.success && typeof data.likes === 'number') {
    setLikes(data.likes);
  }
};


  if (loading) return null;

  return (
    <button
      className={`like-button ${liked ? 'liked' : ''}`}
      ref={buttonRef}
      onClick={handleClick}
      disabled={liked}
    >
      <span className="like-count">{likes}</span>
      <svg className="heart-icon stroke" viewBox="0 0 24 24">
        <defs>
          <clipPath id="mask">
            <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
          </clipPath>
        </defs>
        <circle ref={firstStrokeRef} r="0" cx="12" cy="12" clipPath="url(#mask)" />
        <circle ref={secondStrokeRef} r="0" cx="12" cy="12" clipPath="url(#mask)" />
      </svg>
      <svg className="heart-icon red" ref={redHeartRef} viewBox="0 0 24 24">
        <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
      </svg>
      <svg className="heart-icon" viewBox="0 0 24 24">
        <path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
      </svg>
    </button>
  );
}
