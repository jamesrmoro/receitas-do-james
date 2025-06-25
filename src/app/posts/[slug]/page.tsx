import { getPostBySlug } from '../../../lib/wordpress';
import StarRating from '../../components/StarRating';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>; // params agora é uma Promise
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params; // await necessário!

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
    <main style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <StarRating postId={post.id} />
    </main>
  );
}
