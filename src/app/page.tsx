// 메인 홈화면
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../styles/home.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className='Home' onClick={() => router.push('/login')}>
      <Image className='logo' src="/images/jobdam.png" alt='logo' width={149.5} height={149.5}></Image>
      <div>
        <p className='intro'>
          센스있는<br />
          사회생활을 위해
        </p>
        <span className='jobdam'>
          잡담
        </span>
        <p className='Touch'>화면을 터치해주세요.</p>
      </div>
    </div>
  );
}
