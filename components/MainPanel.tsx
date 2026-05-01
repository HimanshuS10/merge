'use client';

const messages = [
  {
    id: 1,
    platform: 'slack',
    sender: 'Sarah Chen',
    avatar: 'SC',
    avatarColor: 'from-pink-500 to-rose-500',
    preview: 'Hey, can you review the PR I just pushed? It fixes the auth bug we discussed.',
    time: '2m ago',
    unread: true,
    platformColor: 'bg-[#E01E5A]',
  },
  {
    id: 2,
    platform: 'github',
    sender: 'GitHub',
    avatar: 'GH',
    avatarColor: 'from-gray-600 to-gray-800',
    preview: 'alex-dev opened a pull request: "feat: add notification batching"',
    time: '14m ago',
    unread: true,
    platformColor: 'bg-white',
  },
  {
    id: 3,
    platform: 'whatsapp',
    sender: 'Design Team',
    avatar: 'DT',
    avatarColor: 'from-emerald-500 to-teal-500',
    preview: 'New Figma frames are ready for review. Check the link in the channel.',
    time: '1h ago',
    unread: false,
    platformColor: 'bg-[#25D366]',
  },
  {
    id: 4,
    platform: 'email',
    sender: 'Liam Torres',
    avatar: 'LT',
    avatarColor: 'from-sky-500 to-blue-600',
    preview: 'Following up on the Q3 roadmap deck — do you have any feedback before Friday?',
    time: '2h ago',
    unread: false,
    platformColor: 'bg-sky-500',
  },
  {
    id: 5,
    platform: 'discord',
    sender: 'Engineering',
    avatar: 'EN',
    avatarColor: 'from-violet-500 to-indigo-600',
    preview: 'Standup in 10 minutes — link in #general. Don\'t forget to share your blockers.',
    time: '3h ago',
    unread: false,
    platformColor: 'bg-[#5865F2]',
  },
];

const platformIconMap: Record<string, React.ReactNode> = {
  slack: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  ),
  github: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  whatsapp: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  email: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  discord: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  ),
};

export default function MainPanel() {
  return (
    <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 h-16 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-white font-semibold text-base">All Messages</h1>
          <p className="text-white/35 text-xs mt-0.5">24 unread across 5 platforms</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.07] rounded-lg px-3 py-1.5 w-52">
            <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-white/30 text-sm">Search messages…</span>
          </div>

          {/* Compose */}
          <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-3 py-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Compose
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Message list */}
        <div className="w-80 border-r border-white/[0.06] flex flex-col overflow-y-auto">
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/25">Recent</span>
            <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Mark all read</button>
          </div>

          {messages.map((msg) => (
            <button
              key={msg.id}
              className={`flex items-start gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors text-left border-b border-white/[0.04] ${msg.id === 1 ? 'bg-white/[0.06]' : ''}`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${msg.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                  {msg.avatar}
                </div>
                {/* Platform badge */}
                <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${msg.platformColor} flex items-center justify-center text-white`}>
                  {platformIconMap[msg.platform]}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-sm font-medium truncate ${msg.unread ? 'text-white' : 'text-white/60'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[11px] text-white/25 shrink-0">{msg.time}</span>
                </div>
                <p className={`text-xs truncate ${msg.unread ? 'text-white/60' : 'text-white/30'}`}>
                  {msg.preview}
                </p>
              </div>

              {/* Unread dot */}
              {msg.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2" />
              )}
            </button>
          ))}
        </div>

        {/* Empty state / conversation view */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          {/* Dot grid background */}
          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px'}} />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 mx-auto">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <h2 className="text-white/50 font-medium text-base">Select a conversation</h2>
            <p className="text-white/25 text-sm mt-1 max-w-xs">
              Pick a message from the list to start reading, or compose a new one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
