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

/**
 * Primary navigation. Items are either a leaf link (`href`) or a parent with a `children`
 * submenu (rendered as a dropdown on desktop and an accordion in the mobile drawer). Active
 * highlighting: a leaf matches its own `href`; a parent is active when any child route is.
 */
export type NavLeaf = { label: string; href: string };
export type NavItem = NavLeaf | { label: string; children: NavLeaf[] };

export const NAV: NavItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Videos', href: '/videos' },
  { label: 'New to Mule', href: '/mulesoft-from-start' },
  { label: 'Learn ACB', href: '/learn-acb' },
  { label: 'MuleSoft + AI', href: '/mulesoft-ai' },
  {
    label: 'Community',
    children: [
      { label: 'Blogs', href: '/community/blogs' },
      { label: 'Books', href: '/community/books' },
      { label: 'Channels', href: '/community/channels' },
      { label: 'Resources', href: '/community/resources' },
    ],
  },
];

/** Official MuleSoft Ambassadors roster — linked wherever the site highlights ambassador status. */
export const AMBASSADORS_URL = 'https://www.mulesoft.com/community/ambassadors';

export const SOCIAL = {
  youtube: 'https://www.youtube.com/@prostdev',
  github: 'https://github.com/prostdev',
  linkedin: 'https://www.linkedin.com/company/prostdev',
  vscode: 'https://marketplace.visualstudio.com/publishers/ProstDev',
};
