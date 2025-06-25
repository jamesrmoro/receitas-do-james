import { NextResponse } from 'next/server';

const API_BASE = process.env.WP_API_BASE;
const AUTH_HEADER = {
  Authorization: `Bearer ${process.env.WORDPRESS_JWT_TOKEN}`,
};

export async function POST(req: Request) {
  try {
    const { postId, rating } = await req.json();

    if (
      !postId ||
      typeof rating !== 'number' ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { success: false, message: 'Avaliação inválida.' },
        { status: 400 }
      );
    }

    // Buscar post atual
    const resGet = await fetch(`${API_BASE}/posts/${postId}`, {
      headers: AUTH_HEADER,
    });

    if (!resGet.ok) {
      return NextResponse.json(
        { success: false, message: 'Post não encontrado.' },
        { status: 404 }
      );
    }

    const post = await resGet.json();
    const acf = post.acf || {};

    // Valores atuais
    const count = parseInt(acf.rate_count) || 0;
    const mediaAnterior = parseFloat(acf.rate_media) || 0;

    // Novo cálculo incremental
    const novaCount = count + 1;
    const novaMedia = (mediaAnterior * count + rating) / novaCount;

    // Atualizar campos
    const resUpdate = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AUTH_HEADER,
      },
      body: JSON.stringify({
        acf: {
          rate_count: novaCount,
          rate_media: novaMedia.toFixed(1),
        },
      }),
    });

    if (!resUpdate.ok) {
      const errorBody = await resUpdate.text();
      console.error('Erro ao atualizar post:', errorBody);
      return NextResponse.json(
        { success: false, message: 'Erro ao salvar dados.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      media: novaMedia.toFixed(1),
      count: novaCount,
    });
  } catch (err) {
    console.error('Erro no endpoint /api/rate:', err);
    return NextResponse.json(
      { success: false, message: 'Erro interno' },
      { status: 500 }
    );
  }
}
