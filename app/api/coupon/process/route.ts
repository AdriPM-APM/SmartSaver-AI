// app/api/coupon/process/route.ts
import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // 1. Extract data using Gemini-Flash 1.5
    const couponData = await callOpenRouter('EXTRACT', text);
    
    // 2. Score validity using Claude-3 Haiku
    const validation = await callOpenRouter('SCORE', JSON.stringify(couponData));

    // 3. Save to Database (New Logic)
    // Find or create the store first
    const store = await prisma.store.upsert({
      where: { slug: couponData.store.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: couponData.store,
        slug: couponData.store.toLowerCase().replace(/\s+/g, '-'),
        url: '#', // Placeholder
      },
    });

    // Save the coupon with AI confidence and status
    const newCoupon = await prisma.coupon.create({
      data: {
        store_id: store.id,
        code: couponData.code,
        title: `${couponData.discount} Off at ${couponData.store}`,
        discount_type: 'PERCENTAGE', // Simplified for extraction
        source_type: 'USER',
        ai_confidence: validation.confidence,
        status: validation.status,
        description: validation.reason,
      },
    });

    return NextResponse.json({ 
      data: couponData, 
      validation,
      savedId: newCoupon.id 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process coupon' }, { status: 500 });
  }
      }
