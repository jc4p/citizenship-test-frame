import { NextResponse } from 'next/server';
import { uploadToR2, isCloudflareR2Configured } from '@/lib/r2';

export async function POST(request) {
  try {
    const body = await request.json();
    const { score, results } = body;

    if (score === undefined || !results) {
      return NextResponse.json({ error: 'Missing required parameters: score, results' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL is not configured.' }, { status: 500 });
    }

    const sharePageUrl = new URL(appUrl);
    
    let generatedImageR2Url = null;
    let imageFileName = null;

    if (isCloudflareR2Configured()) {
      try {
        const ogImageUrl = new URL(`${appUrl}/api/og`);
        ogImageUrl.searchParams.set('score', score);

        const imageResponse = await fetch(ogImageUrl.toString());
        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.warn('Failed to generate OG image for R2 upload:', errorText);
        } else {
          const imageBuffer = await imageResponse.arrayBuffer();

          const timestamp = Date.now();
          imageFileName = `share-image-${timestamp}.png`;
          const r2FileName = `citizenship-test/${imageFileName}`;
          
          generatedImageR2Url = await uploadToR2(Buffer.from(imageBuffer), r2FileName, 'image/png');

          sharePageUrl.searchParams.set('image', imageFileName);
        }
      } catch (r2Error) {
        console.warn('R2 upload failed, sharing without image:', r2Error.message);
      }
    }

    return NextResponse.json({
      generatedImageR2Url,
      shareablePageUrl: sharePageUrl.toString(),
      imageFileName,
      hasCustomImage: !!generatedImageR2Url
    });

  } catch (error) {
    console.error('Error in create-share-link:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}