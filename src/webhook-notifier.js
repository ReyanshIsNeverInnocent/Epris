export async function notifyComparison(tool, firstName, secondName, result) {
  const response = await fetch(`/api/${tool}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, secondName, result }),
  });

  if (!response.ok) {
    throw new Error(`Webhook API returned HTTP ${response.status}.`);
  }
}
