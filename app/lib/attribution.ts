const STORAGE_KEY = "loan-v2-attribution";

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

type AttributionKey = (typeof attributionKeys)[number];

export type AttributionData = Record<AttributionKey, string> & {
  landing_page: string;
  referrer: string;
};

function emptyAttribution(): AttributionData {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    fbclid: "",
    gclid: "",
    landing_page: "",
    referrer: "",
  };
}

function cleanStoredValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getAttributionMaxLength(key: AttributionKey) {
  return key === "fbclid" || key === "gclid" ? 500 : 300;
}

function readStoredAttribution(): AttributionData {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return emptyAttribution();
    }

    const parsed = JSON.parse(stored) as Record<string, unknown>;
    const result = emptyAttribution();

    for (const key of attributionKeys) {
      result[key] = cleanStoredValue(parsed[key], getAttributionMaxLength(key));
    }

    result.landing_page = cleanStoredValue(parsed.landing_page, 1_000);
    result.referrer = cleanStoredValue(parsed.referrer, 1_000);
    return result;
  } catch {
    return emptyAttribution();
  }
}

function getLandingPageUrl() {
  try {
    const currentUrl = new URL(window.location.href);
    const trackingParams = new URLSearchParams();

    for (const key of attributionKeys) {
      const value = currentUrl.searchParams.get(key)?.trim();
      if (value) {
        trackingParams.set(key, value.slice(0, getAttributionMaxLength(key)));
      }
    }

    currentUrl.search = trackingParams.toString();
    currentUrl.hash = "";
    return currentUrl.toString().slice(0, 1_000);
  } catch {
    return "";
  }
}

function getReferrerUrl() {
  if (!document.referrer) {
    return "";
  }

  try {
    const referrerUrl = new URL(document.referrer);
    if (referrerUrl.protocol !== "http:" && referrerUrl.protocol !== "https:") {
      return "";
    }
    referrerUrl.search = "";
    referrerUrl.hash = "";
    return referrerUrl.toString().slice(0, 1_000);
  } catch {
    return "";
  }
}

export function getSessionAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return emptyAttribution();
  }

  const stored = readStoredAttribution();
  const params = new URLSearchParams(window.location.search);
  const result = { ...stored };

  for (const key of attributionKeys) {
    if (!result[key]) {
      result[key] =
        params.get(key)?.trim().slice(0, getAttributionMaxLength(key)) ?? "";
    }
  }

  if (!result.landing_page) {
    result.landing_page = getLandingPageUrl();
  }

  if (!result.referrer) {
    result.referrer = getReferrerUrl();
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Storage may be disabled. The caller still receives this page's values.
  }

  return result;
}
