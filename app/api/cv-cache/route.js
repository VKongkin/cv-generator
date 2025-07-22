const cache = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export async function POST(req) {
  const data = await req.json();
  const id = generateId();
  cache.set(id, { data, created: Date.now() });
  // Optionally, clean up old entries (e.g., older than 10 minutes)
  for (const [key, value] of cache.entries()) {
    if (Date.now() - value.created > 10 * 60 * 1000) cache.delete(key);
  }
  return new Response(JSON.stringify({ id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id || !cache.has(id)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(JSON.stringify(cache.get(id).data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
