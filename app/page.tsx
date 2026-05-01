'use server';

import { auth } from '@/lib/auth/server';
import Link from 'next/link';
import { signout } from './auth/sign-out/actions';

async function handleSignout(formData: FormData) {
  'use server';
  await signout(null, formData);
}

// export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
        <h1 className="mb-4 text-4xl">
          Logged in as <span className="font-bold underline">{session.user.name}</span>
        </h1>
        <form action={handleSignout}>
          <button
            type="submit"
            className="inline-flex text-lg text-indigo-400 hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
        <Link
          href="/auth/sign-up"
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-up
        </Link>
        <Link
          href="/auth/sign-in"
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-in
        </Link>
      </div>
    </div>
  );
}