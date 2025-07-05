import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export const size = {
  width: 600,
  height: 400,
}
 
export const contentType = 'image/png'

// Load fonts
const ryeFontData = fetch(
  'https://images.kasra.codes/Rye-Regular.ttf'
).then(res => {
  if (!res.ok) throw new Error(`Rye font fetch failed: ${res.status} ${res.statusText}`);
  return res.arrayBuffer();
}).catch(err => {
  console.error('Rye font loading error:', err);
  throw err;
});

const libreBaskervilleFontData = fetch(
  'https://images.kasra.codes/LibreBaskerville-Regular.ttf'
).then(res => {
  if (!res.ok) throw new Error(`LibreBaskerville font fetch failed: ${res.status} ${res.statusText}`);
  return res.arrayBuffer();
}).catch(err => {
  console.error('LibreBaskerville font loading error:', err);
  throw err;
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const score = searchParams.get('score');
    
    const scoreValue = parseInt(score || 0);
    const passed = scoreValue >= 6;
    
    // Wait for fonts to load
    const [ryeFont, libreBaskervilleFont] = await Promise.all([
      ryeFontData,
      libreBaskervilleFontData
    ]);
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            fontFamily: 'LibreBaskerville',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Angled stripes background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `#002868`,
            opacity: passed ? 0.8 : 0.3,
            display: 'flex'
          }} />
          
          {/* Content overlay */}
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 40,
            borderRadius: 20
          }}>
            {passed ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 20,
                backgroundColor: passed ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.7)',
                borderRadius: 20
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  fontFamily: 'Rye',
                  marginBottom: '15px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                   US CITIZENSHIP TEST
                </div>
                {/* Success emoji */}
                <div style={{
                  display: 'flex',
                  fontSize: '40px',
                  marginBottom: '15px'
                }}>
                  🦅🇺🇸🦅
                </div>
                
                {/* CERTIFIED */}
                <div style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  fontFamily: 'Rye',
                  marginBottom: '8px'
                }}>
                  Certified
                </div>
                
                {/* RED-BLOODED AMERICAN */}
                <div style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: '900',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  fontFamily: 'Rye',
                  marginBottom: '15px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Red-Blooded American
                </div>
                
                {/* Score */}
                <div style={{
                  display: 'flex',
                  fontSize: '24px',
                  color: '#FFFFFF',
                  fontFamily: 'LibreBaskerville',
                  marginBottom: '10px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Score: {scoreValue}/10
                </div>
                
                {/* HU-RAH */}
                <div style={{
                  display: 'flex',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  letterSpacing: '2px',
                  alignItems: 'center',
                  fontFamily: 'LibreBaskerville',
                  gap: '8px'
                }}>
                  🎆 HU-RAH! 🎆
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  fontFamily: 'Rye',
                  marginBottom: '15px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  US CITIZENSHIP TEST
                </div>
                {/* Sad emoji */}
                <div style={{
                  display: 'flex',
                  fontSize: '40px',
                  marginBottom: '15px'
                }}>
                  😔
                </div>
                
                {/* NOT YET PATRIOT */}
                <div style={{
                  display: 'flex',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#FF6B6B',
                  fontFamily: 'Rye',
                  marginBottom: '15px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  NOT YET, PATRIOT!
                </div>
                
                {/* Score */}
                <div style={{
                  display: 'flex',
                  fontSize: '24px',
                  color: '#FFFFFF',
                  fontFamily: 'LibreBaskerville',
                  marginBottom: '15px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  Score: {scoreValue}/10
                </div>
                
                {/* Time to study */}
                <div style={{
                  display: 'flex',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#4ECDC4',
                  textTransform: 'uppercase',
                  fontFamily: 'Rye',
                  marginBottom: '10px'
                }}>
                  Time to Study 'MURICAH
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
        fonts: [
          {
            name: 'Rye',
            data: ryeFont,
            style: 'normal',
          },
          {
            name: 'LibreBaskerville',
            data: libreBaskervilleFont,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e) {
    console.error('OG Route: Error occurred:', e);
    console.error('OG Route: Error stack:', e.stack);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}