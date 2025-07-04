// src/app/page.tsx
import Link from 'next/link';
import { getAllPosts } from '../lib/wordpress';
import RecipeCarousel from './components/RecipeCarousel';
import './page.css';

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <main className="home-container">
      <div className="screen">
        <h1 className="title">Receitas do James</h1>
        <div className="search-wrapper">
          <div className="search-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 56.966 56.966"
              className="search-icon"
              fill="currentColor"
            >
              <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" />
            </svg>
            <div className="input-group">
              <input
                type="text"
                id="search"
                placeholder=" "
                className="search-input"
              />
              <label htmlFor="search" className="search-label">
                Buscar receitas
              </label>
            </div>
          </div>
        </div>
        <RecipeCarousel recipes={posts} />
      </div>
    </main>
  );
}
