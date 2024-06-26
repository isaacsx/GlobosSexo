import type { APIRoute } from 'astro';
import { createCanvas, loadImage } from '@napi-rs/canvas';

export const GET: APIRoute = async ({ request }) => 
{
  const urlParam = request.url.split('?url=')[1]; 

  try {
    const image = await loadImage(urlParam);
    const overlay = await loadImage('public/Bubble.svg');  

    const overlayHeight = image.height * 0.3;
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(overlay, 0, 0, image.width, overlayHeight);

    return new Response(canvas.toBuffer('image/png'), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="bubble.png"'
      },
    });
  } catch (error) {
    return new Response('Error processing image', { status: 500 });
  }
};
