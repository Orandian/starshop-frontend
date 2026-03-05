"use server";


import { LoginUser } from '@/types/fc';
import { cookies } from 'next/headers';

/**
 * logout
 */
export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user');
}

/**
 * Tokenを設定する
 * @param token token
 */
export const setToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });
}

/**
 * Tokenを取得する
 * @returns token
 */
export const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

/**
 * Userを設定する
 * @param user user
 */
export const setUser = async (user: LoginUser) => {
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });
}

/**
 * Userを取得する
 * @returns user
 */
export const getUser = async () => {
  const cookieStore = await cookies();
  return JSON.parse(cookieStore.get('user')?.value || '{}');
}

