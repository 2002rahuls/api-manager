export async function recordApiUsage(apiKeyId) {
  try {
    const response = await fetch("/api/record-usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKeyId }),
    });

    if (!response.ok) {
      throw new Error("Failed to record API usage");
    }

    return await response.json();
  } catch (error) {
    console.error("Error recording API usage:", error);
    throw error;
  }
}
