import { FrameInit } from '@/components/FrameInit';
import './globals.css';

export const metadata = {
  title: 'Can You Pass The US Citizenship Test?',
  description: 'A quiz to test your knowledge of US civics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>
          {children}
          <FrameInit />
        </div>
      </body>
    </html>
  );
}
