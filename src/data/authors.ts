/**
 * Shared author registry for the community showcase + resources catalog.
 *
 * Several people appear across BOTH the /community pages (src/data/community.ts) and the /resources
 * catalog (src/data/resources.ts), and some appear more than once within a file — Jitendra Bafna
 * authors a Medium blog AND a YouTube academy; Sravan Nerella has a Medium blog AND the Mule XML
 * Formatter; Patryk Bandurski has the Flow State newsletter AND Integration Trails. Define each
 * person ONCE here and reference them by key (see AUTHORS below), so a name or profile-URL change is
 * a single edit that propagates to every card.
 *
 * HOW TO USE:
 *   - Reference an existing author: `authors: [AUTHORS['jitendra-bafna']]` (list more than one to
 *     credit co-creators: `authors: [AUTHORS['alex-martinez'], AUTHORS['naveen-namachivayam']]`).
 *   - Add a new author: add a kebab-case entry below (alphabetical by key), then reference it.
 *     `url` is the profile link (LinkedIn/GitHub/etc.); omit it for entities with no profile page.
 */
export interface Author {
  name: string;
  /** Profile URL (LinkedIn, GitHub, etc.). Omit for entities with no profile page (e.g. MuleSoft). */
  url?: string;
  /**
   * True when this person is on the MuleSoft Ambassadors roster (current OR alumni) —
   * https://www.mulesoft.com/community/ambassadors. This is the SINGLE source of truth for the
   * "MuleSoft Ambassador" highlight badge: a community card or resource derives its badge from
   * whether ANY of its authors is flagged here (see communityIsAmbassador / resourceIsAmbassador),
   * so a person's roster status lives in one place instead of per-card.
   */
  isAmbassador?: boolean;
}

/** Keyed by a stable kebab-case slug. Ordered alphabetically by key. */
export const AUTHORS = {
  'akshata-sawant': {
    name: 'Akshata Sawant',
    url: 'https://www.linkedin.com/in/akshatasawant02/',
    isAmbassador: true,
  },
  'alex-martinez': {
    name: 'Alex Martinez',
    url: 'https://www.linkedin.com/in/alexandra-n-martinez/',
    isAmbassador: true,
  },
  'alexander-deroui-villar': {
    name: 'Alexander Deroui Villar',
    url: 'https://www.linkedin.com/in/alexander-deroui-villar-66297ba7/',
  },
  'ashish-pardhi': {
    name: 'Ashish Pardhi',
    url: 'https://www.linkedin.com/in/ashishpardhi/',
    isAmbassador: true,
  },
  'arul-christhuraj-alphonse': {
    name: 'Arul Christhuraj Alphonse',
    url: 'https://www.linkedin.com/in/arulchristhuraj/',
  },
  'ashutosh-vijay': { name: 'Ashutosh Vijay', url: 'https://www.linkedin.com/in/ashutosh-vijay/' },
  'bighnesh-kumar-sahoo': { name: 'Bighnesh Kumar Sahoo', url: 'https://www.linkedin.com/in/bighnesh18/' },
  'darvesh-lodhi': { name: 'Darvesh Lodhi', url: 'https://www.linkedin.com/in/darvesh-lodhi/' },
  'edgar-moran': {
    name: 'Edgar Moran',
    url: 'https://www.linkedin.com/in/yucelmoran/',
    isAmbassador: true,
  },
  'farhan-modjdehi': { name: 'Farhan Modjdehi', url: 'https://www.linkedin.com/in/farhan-modjdehi/' },
  'florencia-cattelani': {
    name: 'Florencia Cattelani',
    url: 'https://www.linkedin.com/in/florenciacattelani/',
    isAmbassador: true,
  },
  'indresh-gupta': { name: 'Indresh Gupta', url: 'https://www.linkedin.com/in/indresh-gupta-788253118/' },
  'ismeet-kaur': {
    name: 'Ismeet Kaur',
    url: 'https://www.linkedin.com/in/ismeet-kaur-712b19108/',
    isAmbassador: true,
  },
  'itzel-andrea-moo': {
    name: 'Itzel Andrea Moo',
    url: 'https://www.linkedin.com/in/itzelmoo/',
    isAmbassador: true,
  },
  'jim-andrews': { name: 'Jim Andrews', url: 'https://www.linkedin.com/in/jdaconsulting/' },
  'jitendra-bafna': {
    name: 'Jitendra Bafna',
    url: 'https://www.linkedin.com/in/jitendra-bafna-jacky/',
    isAmbassador: true,
  },
  'juan-cruz-basso': {
    name: 'Juan Cruz Basso',
    url: 'https://www.linkedin.com/in/jcbasso/',
    isAmbassador: true,
  },
  'kancharla-sandeep-sai-kumar': {
    name: 'Kancharla Sandeep Sai Kumar',
    url: 'https://www.linkedin.com/in/kancharla-sandeep-sai-kumar-867120179/',
  },
  'karol-skrzymowski': { name: 'Karol Skrzymowski', url: 'https://www.linkedin.com/in/karolskrzymowski/' },
  'kseniia-tarantsova': {
    name: 'Kseniia Tarantsova',
    url: 'https://www.linkedin.com/in/kseniia-tarantsova/',
    isAmbassador: true,
  },
  'lukasz-skowronek': { name: 'Lukasz Skowronek', url: 'https://www.linkedin.com/in/lukaszskowronek/' },
  'manik-magar': {
    name: 'Manik Magar',
    url: 'https://www.linkedin.com/in/manikmagar/',
    isAmbassador: true,
  },
  'manisha-patil': {
    name: 'Manisha Patil',
    url: 'https://www.linkedin.com/in/manisha-patil-338078a0/',
    isAmbassador: true,
  },
  'matt-pocock': { name: 'Matt Pocock', url: 'https://www.linkedin.com/in/mapocock/' },
  'matthias-transier': {
    name: 'Matthias Transier',
    url: 'https://www.linkedin.com/in/transier/',
    isAmbassador: true,
  },
  'mehak-garg': { name: 'Mehak Garg', url: 'https://www.linkedin.com/in/mehakgarg911/' },
  mulesoft: { name: 'MuleSoft' },
  'naseem-khan': { name: 'Naseem Khan', url: 'https://www.linkedin.com/in/naseem-khan-788a0724/' },
  'naveen-namachivayam': {
    name: 'NaveenKumar Namachivayam',
    url: 'https://www.linkedin.com/in/naveenkumarn/',
  },
  'patryk-bandurski': {
    name: 'Patryk Bandurski',
    url: 'https://www.linkedin.com/in/patryk-bandurski/',
    isAmbassador: true,
  },
  'philipp-schone': { name: 'Philipp Schöne', url: 'https://www.linkedin.com/in/pschoene/' },
  'pranav-davar': {
    name: 'Pranav Davar',
    url: 'https://www.linkedin.com/in/pranavdavar/',
    isAmbassador: true,
  },
  'priyanshu-dhawan': { name: 'Priyanshu Dhawan', url: 'https://www.linkedin.com/in/priyanshuthe1/' },
  'rahul-kumar': { name: 'Rahul Kumar', url: 'https://www.linkedin.com/in/rahulkumar16/' },
  'ronald-vega': { name: 'Ronald Vega', url: 'https://www.linkedin.com/in/ronald-vega/' },
  'shubham-kalsi': {
    name: 'Shubham Kalsi',
    url: 'https://www.linkedin.com/in/shubhamkalsi/',
    isAmbassador: true,
  },
  'sravan-lingam': {
    name: 'Sravan Lingam',
    url: 'https://www.linkedin.com/in/sravanlingam/',
    isAmbassador: true,
  },
  'sravan-nerella': {
    name: 'Sravan Nerella',
    url: 'https://www.linkedin.com/in/sravan-nerella/',
    isAmbassador: true,
  },
  'stuti-tank': {
    name: 'Stuti Tank',
    url: 'https://www.linkedin.com/in/stuti-tank-9864a252/',
    isAmbassador: true,
  },
  'suman-chatterjee': {
    name: 'Suman Chatterjee',
    url: 'https://www.linkedin.com/in/sumanchatterjee84/',
    isAmbassador: true,
  },
  'upendra-thunuguntla': {
    name: 'Upendra Thunuguntla',
    url: 'https://www.linkedin.com/in/upendra-thunuguntla/',
  },
  'vikas-sharma': {
    name: 'Vikas Sharma',
    url: 'https://www.linkedin.com/in/vikas-sharma-50b391a5/',
    isAmbassador: true,
  },
} as const satisfies Record<string, Author>;

/** True when any author in the list is on the MuleSoft Ambassadors roster. */
export function hasAmbassador(authors: readonly Author[] | undefined): boolean {
  return !!authors?.some((a) => a.isAmbassador);
}
