import { Quiz } from '@/components/Quiz';

export async function generateMetadata({ searchParams }) {
  const image = (await searchParams)?.image;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const imageUrl = image 
    ? `${process.env.R2_PUBLIC_URL}/${image}`
    : "https://placehold.co/600x400/1d3557/ffffff/png?text=US+Citizenship+Test";

  console.log('Returning fc:frame with imageUrl:', imageUrl);

  return {
    title: 'Can You Pass The US Citizenship Test?',
    description: 'A quiz to test your knowledge of US civics.',
    other: {
      'fc:frame': JSON.stringify({
        version: "next",
        imageUrl,
        button: {
          title: "Try now!",
          action: {
            type: "launch_frame",
            name: "citizenship-test",
            url: baseUrl,
            splashImageUrl: "https://placehold.co/200x200/1d3557/ffffff/png?text=Loading...",
            splashBackgroundColor: "#1d3557"
          }
        }
      })
    }
  };
}

export default function Home() {
  return (
    <main>
      <Quiz />
    </main>
  );
}
