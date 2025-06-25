// src/lib/wordpress.ts

const WP_API_BASE = 'https://jamesrmoro.me/receitas-do-james/wp-json/wp/v2';

export async function getAllPosts() {
  const res = await fetch(`${WP_API_BASE}/posts?_embed`, { next: { revalidate: 60 } });
  return res.json();
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(`${WP_API_BASE}/posts?slug=${slug}&_embed`);
  const posts = await res.json();
  return posts.length > 0 ? posts[0] : null;
}
