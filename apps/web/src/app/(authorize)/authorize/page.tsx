import { SearchParams } from "nuqs/server";
import { searchParamsCache } from "./search-params";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // get the search parameters from the cache
  const { apiKey } = await searchParamsCache(searchParams);
  // if no apiKey is provided, return a 404 not found
  if (!apiKey) {
    return notFound();
  }
  return (
    <div>
      <h1>
        Authorize
        {apiKey ? ` - ${apiKey}` : ""}
      </h1>
    </div>
  );
}
