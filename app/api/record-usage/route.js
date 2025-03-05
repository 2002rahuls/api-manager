import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { apiKeyId } = await request.json();

    if (!apiKeyId) {
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Check if there's already a record for today
    const { data: existingRecord } = await supabase
      .from("api_usage")
      .select("*")
      .eq("api_key_id", apiKeyId)
      .eq("date", today)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from("api_usage")
        .update({ usage_count: existingRecord.usage_count + 1 })
        .eq("id", existingRecord.id);

      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase.from("api_usage").insert([
        {
          api_key_id: apiKeyId,
          usage_count: 1,
          date: today,
        },
      ]);

      if (error) throw error;
    }

    // Update the total usage in the api_keys table
    const { error: updateError } = await supabase.rpc(
      "increment_api_key_usage",
      {
        key_id: apiKeyId,
      }
    );

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording API usage:", error);
    return NextResponse.json(
      { error: "Failed to record API usage" },
      { status: 500 }
    );
  }
}
