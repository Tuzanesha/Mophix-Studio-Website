export function getBackendOriginFromReactAppApiUrl() {
  const raw = process.env.REACT_APP_API_URL || '';
  // Example: http://localhost:5000/api/v1
  try {
    const u = new URL(raw);
    return u.origin; // http://localhost:5000
  } catch {
    return '';
  }
}

export function getBackendAssetUrl(pathOrUrl) {
  if (!pathOrUrl) return '';

  // Already absolute URL
  if (typeof pathOrUrl === 'string' && pathOrUrl.startsWith('http')) {
    return pathOrUrl;
  }

  const origin = getBackendOriginFromReactAppApiUrl();

  // If it starts with '/', treat as same-origin path.
  // Your backend serves uploads at /uploads/*.
  // Because the frontend dev server proxies /api/v1 only, we must keep /uploads/* as-is.
  if (pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }


  // Relative path (no leading slash)
  return origin ? `${origin}/${pathOrUrl}` : pathOrUrl;
}

