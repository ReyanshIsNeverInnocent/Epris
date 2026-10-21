export async function notifyComparison(tool, firstName, secondName, result) {
  const response = await fetch(`/api/${tool}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, secondName, result }),
  });

  if (!response.ok) {
    let message = `Webhook API returned HTTP ${response.status}.`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // Keep the HTTP status message when the server returned a non-JSON response.
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('The webhook API is not available on this deployment.');
  }

  const body = await response.json();
  if (body.ok !== true) {
    throw new Error(body.error || 'The webhook API could not confirm delivery.');
  }
}
