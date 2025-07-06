'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '../styles/components.css';

export default function BackNavigator() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return ( 
    <div className="backNavigator">
      <Image
        src="/images/backNavigator.webp"
        alt="뒤로가기"
        width={12}
        height={24}
        priority
        onClick={handleBack}
      />
    </div>
  );
}
