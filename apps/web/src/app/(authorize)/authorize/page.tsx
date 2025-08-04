import { SearchParams } from "nuqs/server";
import { searchParamsCache } from "./search-params";
import { notFound } from "next/navigation";
import { Apporve } from "./_components/approve";

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
      <Apporve apiKeyId={apiKey} />
    </div>
  );
}
