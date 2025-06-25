// src/app/posts/[slug]/page.tsx
import { getPostBySlug } from '../../../lib/wordpress';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return <div className="p-4 text-center">Post não encontrado</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title.rendered}</h1>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </main>
  );
}
