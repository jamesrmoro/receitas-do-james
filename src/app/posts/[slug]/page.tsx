import { getPostBySlug } from '../../../lib/wordpress';
import StarRating from '../../components/StarRating';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  let post = null;

  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error('Erro ao buscar o post:', error);
    return (
      <main>
        <h1>Serviço temporariamente indisponível</h1>
        <p>O site de conteúdo está fora do ar no momento. Por favor, tente novamente mais tarde.</p>
      </main>
    );
  }

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
