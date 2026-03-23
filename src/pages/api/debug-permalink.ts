export const prerender = false;
import { query } from "../../lib/db";

export async function GET({ url }: { url: URL }) {
  const testPermalink = "shop-by-boat/capri-18/electrical/rg-213-coax-cable-for-marine-vhf-radios-gt50-runs/";
  const testPermalinkNoSlash = testPermalink.replace(/\/$/, "");

  const [withSlash, withoutSlash] = await Promise.all([
    query("SELECT Product_ID, Name, Permalink FROM Products WHERE Permalink = @p AND Display=1", { p: testPermalink }),
    query("SELECT Product_ID, Name, Permalink FROM Products WHERE Permalink = @p AND Display=1", { p: testPermalinkNoSlash }),
  ]);

  return new Response(JSON.stringify({ withSlash, withoutSlash }, null, 2), {
    headers: { "content-type": "application/json" }
  });
}
