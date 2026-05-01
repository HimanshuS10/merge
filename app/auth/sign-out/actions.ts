'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signout(
  _prevState: { error: string } | null,
  formData: FormData
) {
  await auth.signOut();
  redirect('/auth/sign-in');
}  

