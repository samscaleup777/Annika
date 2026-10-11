// Centralized BazarDor API client with response-shape normalization.
const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

function listFrom(payload, names = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const key of ["data", "result", "results", ...names]) {
    if (Array.isArray(payload[key])) return payload[key];
    const nested = payload[key];
    if (nested && typeof nested === "object") {
      for (const child of ["data", "items", "products", "categories", "results"]) {
        if (Array.isArray(nested[child])) return nested[child];
      }
    }
  }
  return [];
}

async function request(path) {
  for (const base of BASE_URLS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(base + path, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (response.ok) return await response.json();
    } catch {
      console.warn("BazarDor API request failed:", base + path);
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

export async function getAllProducts() {
  return listFrom(await request("/products"), ["products", "items"]);
}

export async function getAllCategories() {
  return listFrom(await request("/categories"), ["categories", "items"]);
}

export async function getProductsByCategory(slug) {
  if (!slug) return [];
  const payload = await request("/products?category=" + encodeURIComponent(slug));
  const filtered = listFrom(payload, ["products", "items"]);
  if (filtered.length) return filtered;
  const all = await getAllProducts();
  return all.filter((p) =>
    [p.category, p.categorySlug, p.categoryId, p.category_id]
      .some((v) => String(v ?? "").toLowerCase() === String(slug).toLowerCase())
  );
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase();
  const all = await getAllProducts();
  const found = all.find((p) =>
    [p.slug, p.id, p._id, p.productId, p.product_id, p.name, p.nameBn]
      .some((v) => String(v ?? "").toLowerCase() === normalized)
  );
  if (found) return found;
  const payload = await request("/products/" + encodeURIComponent(slug));
  if (payload && typeof payload === "object") {
    if (payload.product && typeof payload.product === "object") return payload.product;
    if (payload.data && !Array.isArray(payload.data) && typeof payload.data === "object") return payload.data;
    if (!Array.isArray(payload) && (payload.id != null || payload.slug != null)) return payload;
  }
  return null;
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase();
  const categories = await getAllCategories();
  return categories.find((c) =>
    [c.slug, c.id, c._id, c.name, c.nameBn, c.category]
      .some((v) => String(v ?? "").toLowerCase() === normalized)
  ) || null;
}

export async function getTopRisers(limit = 6) {
  return (await getAllProducts())
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => Number(b.change?.pct || 0) - Number(a.change?.pct || 0))
    .slice(0, limit);
}

export async function getTopFallers(limit = 6) {
  return (await getAllProducts())
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => Number(a.change?.pct || 0) - Number(b.change?.pct || 0))
    .slice(0, limit);
}
