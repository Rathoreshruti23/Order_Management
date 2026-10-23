import { BRAND_NAME } from '../config';

// Placeholder copy. Replace the privacy and terms text with legally reviewed content before launch.
const PAGES = {
  about: {
    title: 'About Us',
    body: [`${BRAND_NAME} designs women's clothing for work, weekends and celebrations. We focus on fabric, fit and fair prices.`],
  },
  contact: {
    title: 'Contact',
    body: ['Questions about an order or a fit? Email hello@shrunity.example and we will reply within two working days.'],
  },
  privacy: {
    title: 'Privacy Policy',
    body: ['We collect only the details needed to process your orders and run your account. This page is a placeholder: add your full privacy policy here.'],
  },
  terms: {
    title: 'Terms of Use',
    body: ['By creating an account or placing an order you agree to these terms. This page is a placeholder: add your full terms here.'],
  },
};

export default function InfoPage({ page }) {
  const { title, body } = PAGES[page];
  return (
    <div className="container-page max-w-2xl py-14">
      <h1 className="section-title">{title}</h1>
      <div className="mt-6 space-y-4 text-lg text-ink-soft">{body.map((p) => <p key={p}>{p}</p>)}</div>
    </div>
  );
}
