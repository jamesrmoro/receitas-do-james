export async function POST(request: Request) {
  try {
    const body = await request.json();
    const postId = body.postId;
    console.log('🔵 postId recebido:', postId);

    const WP_USER = process.env.WP_USER;
    const WP_PASS = process.env.WP_PASS;

    if (!WP_USER || !WP_PASS) {
      console.error('❌ Usuário ou senha não definidos nas variáveis de ambiente.');
      return new Response(JSON.stringify({ error: 'Credenciais não definidas' }), { status: 500 });
    }

    const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

    const res = await fetch(`https://jamesrmoro.me/receitas-do-james/wp-json/wp/v2/posts/${postId}`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    console.log('🔵 Status do fetch:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Erro no fetch:', errorText);
      return new Response(JSON.stringify({ error: errorText }), { status: res.status });
    }

    const post = await res.json();
    const currentLikes = parseInt(post.meta.like || 0, 10);
    const updatedLikes = currentLikes + 1;

    const updateRes = await fetch(`https://jamesrmoro.me/receitas-do-james/wp-json/wp/v2/posts/${postId}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: {
          like: updatedLikes,
        },
      }),
    });

    if (!updateRes.ok) {
      const updateError = await updateRes.text();
      console.error('❌ Erro ao atualizar likes:', updateError);
      return new Response(JSON.stringify({ error: updateError }), { status: updateRes.status });
    }

    return new Response(JSON.stringify({ success: true, likes: updatedLikes }));
  } catch (err: any) {
    console.error('🔥 Erro geral na API /api/like:', err.message);
    return new Response(JSON.stringify({ error: 'Erro interno no servidor' }), { status: 500 });
  }
}
