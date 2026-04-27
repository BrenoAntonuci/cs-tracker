import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function POST(request: Request) {
  // Forward logout to backend to clear the httpOnly cookie there
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { cookie: request.headers.get('cookie') || '' },
    credentials: 'include',
  }).catch(() => {})

  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.delete('token')
  return response
}
