import { auth } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export default async function middleware(request: NextRequest) {
    const session = await auth();
    const origin = request.nextUrl.origin;
    if (!session) return NextResponse.redirect(`${origin}/signin`);
    return NextResponse.next();
}
 
export const config = {
  matcher: ['/dashboard/:path*'],
}