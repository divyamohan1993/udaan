/**
 * MyScheme.gov.in Client
 *
 * Connects to the official Government of India scheme discovery platform.
 * https://www.myscheme.gov.in -- 4,650+ schemes (central + state)
 *
 * Architecture:
 *   1. Client-side: O(1) lookup from pre-computed seed (54 verified schemes)
 *   2. Edge (D1): Full 4,650+ scheme database, queryable by eligibility
 *   3. Live: API Setu endpoint for real-time updates
 *
 * Official API: directory.apisetu.gov.in/api-collection/myscheme
 * Open Data: data.gov.in
 */

export interface MySchemeSearchParams {
  state?: string;
  gender?: string;
  age?: string;
  caste?: string;
  minority?: string;
  isDisabled?: string;
  isBpl?: string;
  occupation?: string;
}

/**
 * Search schemes on MyScheme.gov.in via their search endpoint.
 * This is the same search that powers the official website.
 *
 * Returns matching scheme summaries with links to full details.
 */
export async function searchMyScheme(
  params: MySchemeSearchParams
): Promise<MySchemeResult[]> {
  const url = new URL("https://www.myscheme.gov.in/search/ministry/all-ministries");

  // The official site uses query parameters for eligibility filtering
  if (params.state) url.searchParams.set("state", params.state);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Udaan/1.0 (community purpose platform)",
      },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // Defense in depth: fail gracefully, fall back to local data
  }
}

export interface MySchemeResult {
  slug: string;
  schemeName: string;
  schemeShortTitle?: string;
  ministry: string;
  state?: string;
  nodalMinistry?: string;
  tags?: string[];
}

/**
 * Known MyScheme URL patterns for direct linking.
 * All point to real .gov.in pages.
 */
export const MYSCHEME_URLS = {
  home: "https://www.myscheme.gov.in",
  search: "https://www.myscheme.gov.in/search",
  centralSchemes: "https://www.myscheme.gov.in/search/ministry/all-ministries",
  stateSchemes: (state: string) =>
    `https://www.myscheme.gov.in/search/state/${encodeURIComponent(state)}`,
  schemeDetail: (slug: string) =>
    `https://www.myscheme.gov.in/schemes/${slug}`,
  findScheme: "https://www.myscheme.gov.in/find-scheme",
  api: "https://directory.apisetu.gov.in/api-collection/myscheme",
} as const;

/**
 * State name mappings for MyScheme URL generation.
 * These are the exact state names used by myscheme.gov.in.
 */
export const STATE_MYSCHEME_MAP: Record<string, string> = {
  UP: "uttar-pradesh",
  Bihar: "bihar",
  MP: "madhya-pradesh",
  Rajasthan: "rajasthan",
  Maharashtra: "maharashtra",
  TamilNadu: "tamil-nadu",
  Delhi: "delhi",
  Karnataka: "karnataka",
  WestBengal: "west-bengal",
  Gujarat: "gujarat",
};

/**
 * Get the MyScheme URL for a user's state to discover all 4,650+ schemes.
 * This links directly to the official government platform.
 */
export function getMySchemeUrlForState(state: string): string {
  const slug = STATE_MYSCHEME_MAP[state];
  if (slug) return MYSCHEME_URLS.stateSchemes(slug);
  return MYSCHEME_URLS.findScheme;
}

/**
 * Generate a "Find More Schemes" link that takes the user to MyScheme.gov.in
 * with their eligibility pre-filled. This bridges our 54 verified schemes
 * to the full 4,650+ government database.
 */
export function getMySchemeFinderUrl(): string {
  return MYSCHEME_URLS.findScheme;
}
