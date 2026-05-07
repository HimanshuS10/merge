'use client';

import Image from 'next/image';
import { signout } from '@/app/auth/sign-out/actions';

const platforms = [
  {
    id: 'all',
    label: 'All',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    color: 'text-sky-400',
  },
  {
    id: 'slack',
    label: 'Slack',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    color: 'text-[#E01E5A]',
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: 'text-white',
  },

];


type User = { email?: string | null; name?: string | null; id?: string };
type Counts = { email: number; slack: number; github: number };

export default function Sidebar({
  activePlatform,
  onPlatformChange,
  user,
  counts,
}: {
  activePlatform: string;
  onPlatformChange: (id: string) => void;
  user: User;
  counts: Counts;
}) {
  const displayName = user.name || user.email || 'My Workspace';
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase() ?? '')
    .join('');
  const countMap: Record<string, number> = {
    email: counts.email,
    slack: counts.slack,
    github: counts.github,
    all: counts.email + counts.slack + counts.github,
  };

  return (
    <aside className="flex flex-col w-64 h-full bg-[#0c0f1a] border-r border-white/[0.06] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center px-5 h-16 border-b border-white/[0.06] shrink-0">
        <Image
          src="/LogoMain.png"
          alt="Merge"
          width={150}
          height={0}
          sizes="100vw"
          style={{ width: '55%', height: 'auto' }} 
          className="object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-2 mb-1">Inbox</p>

        {platforms.map((platform) => {
          const isActive = activePlatform === platform.id;
          const count = countMap[platform.id] ?? 0;

          return (
            <button
              key={platform.id}
              onClick={() => onPlatformChange(platform.id)}
              className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:cursor-pointer ${isActive
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
                }`}
            >
              <span className={`shrink-0 transition-colors ${isActive ? (platform.color ?? 'text-white') : (platform.color ? `${platform.color} opacity-60` : 'text-white/40 group-hover:text-white/60')}`}>
                {platform.icon}
              </span>
              <span className="flex-1 text-left">{platform.label}</span>
              {count ? (
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none ${isActive ? 'bg-white/20 text-white' : 'bg-white/[0.07] text-white/40'
                  }`}>
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3 space-y-1">


        <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-[#0C0F1A] shrink-0 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            {user.name && (
              <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
            )}
            {user.email && (
              <p className="text-[11px] text-white/35 truncate">{user.email}</p>
            )}
          </div>
          <form action={signout}>
            <button
              type="submit"
              title="Sign out"
              className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.07] transition-colors hover:cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
