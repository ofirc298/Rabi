import '@/styles.css';

export const metadata = {
  title: 'אהל ישעיה — עמותת חסד וסיוע',
  description: 'עמותת חסד וסיוע הממשיכה את דרכו של רבי ישעיה מקרסטיר. אריזת סלי מזון וחלוקה למשפחות נזקקות, בסתר ובכבוד.',
  openGraph: {
    title: 'אהל ישעיה — עמותת חסד וסיוע',
    description: 'עמותת חסד וסיוע הממשיכה את דרכו של רבי ישעיה מקרסטיר.',
    type: 'website',
    locale: 'he_IL',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=David+Libre:wght@400;700&family=Noto+Serif+Hebrew:wght@400;700&family=Bellefair&family=Heebo:wght@300;400;500;600;700&family=Assistant:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&family=Noto+Sans+Hebrew:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
