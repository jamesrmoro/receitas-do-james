'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import './RecipeCarousel.css';

const LikeButton = dynamic(() => import('./LikeButton'), { ssr: false });

type Recipe = {
  id: number;
  title: { rendered: string };
  _embedded: {
    author: { name: string }[];
    'wp:featuredmedia': { source_url: string }[];
  };
  slug: string;
  date: string;
  content: { rendered: string };
  excerpt: { rendered: string };
  acf?: {
    time?: string;
  };
};

export default function RecipeCarousel({ recipes }: { recipes: Recipe[] }) {
  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2>Trending Now🔥</h2>
        <a href="#">See all →</a>
      </div>

      <div className="carousel-container">
        <Swiper spaceBetween={16} slidesPerView={'auto'} grabCursor>
          {recipes.map((recipe) => {
            const image = recipe._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default.png';
            const author = recipe._embedded?.author?.[0]?.name ?? 'Unknown';
            const avatar = recipe._embedded?.author?.[0]?.avatar_urls?.['24'];

            return (
              <SwiperSlide key={recipe.id} style={{ width: 280 }}>
                <a href={`/posts/${recipe.slug}`} className="recipe-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="recipe-card">
                    <div className="recipe-image">
                      {image && (
                        <Image
                          src={image}
                          alt={recipe.title.rendered}
                          width={280}
                          height={160}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      )}
                      <span>⭐ 4,8</span>

                    </div>
                    <div className="recipe-body">
                      <div className="recipe-meta">
                        <div className="recipe-group">
                          <p className="prep-time">⏱️ {recipe.acf?.time}</p>
                          <LikeButton postId={recipe.id} />
                        </div>
                      </div>

                      <h3>{recipe.title.rendered}</h3>
                      <div className="recipe-author">
                        <img src={avatar} alt={author} />
                        <span>{author}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
