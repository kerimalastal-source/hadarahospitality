// Vercel Edge Middleware: detects a first-time visitor's browser language and
// redirects them to the matching localized section of the site (ar/fr/ru),
// without ever forcing the switch more than once. English (no prefix) is the
// default and is never redirected away from once a visitor has been checked.
//
// This is the one small piece of "server" logic in an otherwise fully static
// site — it only ever issues a redirect, never renders or stores anything.

const SUPPORTED_LOCALES = ['ar', 'fr', 'ru'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const REDIRECT_COOKIE = 'hadara_lang_checked';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function isAssetPath(pathname: string): boolean {
  if (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/technical-sheets/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/search-index.json' ||
    pathname === '/site.webmanifest'
  ) {
    return true;
  }
  // Pages are clean URLs with no extension; anything with a dot in the last
  // segment (css, js, images, xml, json, ...) is a static asset, not a page.
  const lastSegment = pathname.split('/').pop() ?? '';
  return lastSegment.includes('.');
}

function preferredLocale(acceptLanguage: string): SupportedLocale | null {
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, qPart] = part.trim().split(';q=');
      return { tag: tag.trim().toLowerCase().split('-')[0], q: qPart ? parseFloat(qPart) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    if ((SUPPORTED_LOCALES as readonly string[]).includes(tag)) return tag as SupportedLocale;
  }
  return null;
}

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url);
  const { pathname } = url;

  if (isAssetPath(pathname)) return undefined;

  const firstSegment = pathname.split('/').filter(Boolean)[0];
  const alreadyLocalized = (SUPPORTED_LOCALES as readonly string[]).includes(firstSegment);
  if (alreadyLocalized) return undefined;

  const cookieHeader = request.headers.get('cookie') ?? '';
  const alreadyChecked = new RegExp(`(?:^|;\\s*)${REDIRECT_COOKIE}=1(?:;|$)`).test(cookieHeader);
  if (alreadyChecked) return undefined;

  const locale = preferredLocale(request.headers.get('accept-language') ?? '');
  const setCookieHeader = `${REDIRECT_COOKIE}=1; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;

  if (!locale) {
    // English-preferring (or unrecognized) visitor: nothing to redirect, but
    // there is no response to attach the "checked" cookie to here, so this
    // check simply runs again next time — harmless, since it stays a no-op.
    return undefined;
  }

  const localizedPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  const redirectUrl = new URL(`${localizedPath}${url.search}`, url);
  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectUrl.toString(),
      'Set-Cookie': setCookieHeader,
    },
  });
}
