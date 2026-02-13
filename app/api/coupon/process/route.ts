// app/api/coupon/process/route.ts
import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/ai';

export async function POST(req: Request) {
  const { text } = await req.json();

  // 1. Extract
  const couponData = await callOpenRouter('EXTRACT', text);
  
  // 2. Score
  const validation = await callOpenRouter('SCORE', JSON.stringify(couponData));

  return NextResponse.json({ 
    data: couponData, 
    validation 
  });
}
