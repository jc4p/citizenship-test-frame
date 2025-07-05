
import { NextResponse } from 'next/server';
import { scoreQuiz } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const score = await scoreQuiz(body);
    return NextResponse.json(score);
  } catch (error) {
    console.error('Error in /api/score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
