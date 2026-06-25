export const BRAND_NAME = "Otesha";
export const BRAND_PORTAL_SUBTITLE = "Corporate Portal";
export const BRAND_FULL_TITLE = `${BRAND_NAME} — ${BRAND_PORTAL_SUBTITLE}`;
export const BRAND_PORTAL_LABEL = `${BRAND_NAME} Corporate Portal`;
export const BRAND_PROJECTS_LABEL = `${BRAND_NAME} Projects`;

/** Replace legacy Panda branding in user-visible API or stored text. */
export function displayBrand(text: string): string {
  return text.replace(/panda tree/gi, BRAND_NAME).replace(/\bpanda\b/gi, BRAND_NAME);
}
