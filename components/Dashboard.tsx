'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';

type User = { email?: string | null; name?: string | null; id?: string };
type Counts = { email: number; slack: number; github: number };

export default function Dashboard({ user }: { user: User }) {
  const [activePlatform, setActivePlatform] = useState('all');
  const [counts, setCounts] = useState<Counts>({ email: 0, slack: 0, github: 0 });

  return (
    <div className="flex h-full w-full bg-[#080b14]">
      <Sidebar
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
        user={user}
        counts={counts}
      />
      <MainPanel
        activePlatform={activePlatform}
        onCountsChange={setCounts}
      />
    </div>
  );
}
