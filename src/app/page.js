import { Quiz } from '@/components/Quiz';

export async function generateMetadata({ searchParams }) {
  const image = (await searchParams)?.image;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const imageUrl = image 
    ? `${process.env.R2_PUBLIC_URL}/citizenship-test/${image}`
    : "https://cover-art.kasra.codes/citizenship_test_rectangle.png";

  return {
    title: 'Can You Pass The US Citizenship Test?',
    description: 'A quiz to test your knowledge of US civics.',
    other: {
      'fc:frame': JSON.stringify({
        version: "next",
        imageUrl,
        button: {
          title: "Test Your USA Knowledge",
          action: {
            type: "launch_frame",
            name: "US Citizenship Test",
            url: baseUrl,
            splashImageUrl: "https://cover-art.kasra.codes/citizenship_test_square.png",
            splashBackgroundColor: "#002868"
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
