'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';

export default function Dashboard() {
  const [activePlatform, setActivePlatform] = useState('all');

  return (
    <div className="flex min-h-screen w-full bg-[#080b14]">
      <Sidebar activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
      <MainPanel activePlatform={activePlatform} />
    </div>
  );
}
