// src/app/posts/[slug]/page.tsx

import { getPostBySlug } from '../../../lib/wordpress';
import StarRating from '../../components/StarRating';

type PageProps = {
  params: { slug: string };
};

export default async function Page({ params }: PageProps) {
  const slug = params.slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <main>
        <h1>Post não encontrado</h1>
        <p>Verifique se o link está correto ou aguarde enquanto o conteúdo é atualizado.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '1rem' }}>
      <h1>{post.title.rendered}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <StarRating postId={post.id} />
    </main>
  );
}
