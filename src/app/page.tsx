// 메인 홈화면

'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push('/login')}>로그인</button>
      <button onClick={() => router.push('/signup')}>회원가입</button>
      <button onClick={() => router.push('/find-id')}>아이디 찾기</button>
      <button onClick={() => router.push('/find-pw')}>비밀번호 찾기</button>
    </div>
  );
}
