import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import GoogleTranslate from '@/components/GoogleTranslate';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import "./globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
 
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let prefLang = "en";
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.sub) {
        const client = await clientPromise;
        const db = client.db("agrivest_db");
        const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.sub) });
        if (user && user.preferred_language) {
          prefLang = user.preferred_language;
        }
      }
    }
  } catch (err) {}

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <GoogleTranslate preferredLanguage={prefLang} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}