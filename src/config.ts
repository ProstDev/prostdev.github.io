/** Site-wide configuration and shared constants. */

export const SITE = {
  name: 'ProstDev',
  tagline: 'learn MuleSoft',
  url: 'https://prostdev.com',
  description:
    'ProstDev — where MuleSoft mastery meets fun. Easy-to-follow video tutorials, AI experiments, and deep-dive articles on MuleSoft, DataWeave, Anypoint Code Builder, and integration.',
  author: 'Alex Martinez',
  email: 'alex@prostdev.com',
  locale: 'en_US',
};

/** Primary navigation. `match` is used to highlight the active link. */
export const NAV: { label: string; href: string }[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Skills', href: '/skills' },
  { label: 'Videos', href: '/videos' },
  { label: 'New to Mule', href: '/mulesoft-from-start' },
  { label: 'Learn ACB', href: '/learn-acb' },
  { label: 'MuleSoft + AI', href: '/mulesoft-ai' },
];

export const SOCIAL = {
  youtube: 'https://www.youtube.com/@prostdev',
  github: 'https://github.com/prostdev',
  linkedin: 'https://www.linkedin.com/company/prostdev',
  vscode: 'https://marketplace.visualstudio.com/publishers/ProstDev',
};
