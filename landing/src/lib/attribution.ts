const supportedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

export function carryAttribution(target: URL, source: URL) {
  for (const name of supportedParams) {
    const value = source.searchParams.get(name);
    if (value) target.searchParams.set(name, value);
  }
  return target;
}
