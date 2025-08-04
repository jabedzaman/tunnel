"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";

export const Apporve = ({ apiKeyId }: { apiKeyId: string }) => {
  const mutation = useMutation({
    mutationFn: async () => api.apiKey.approve({ apiKeyId }),
  });

  React.useEffect(() => {
    // start after 1 second
    setTimeout(() => {
      mutation.mutate();
    }, 1000);
  }, [apiKeyId]);

  return (
    <div>
      <h1>Approving API Key: {apiKeyId}</h1>
      {mutation.isPending && <p>Loading...</p>}
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Success!</p>}
    </div>
  );
};
