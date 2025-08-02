"use client";

import { useAuthStore } from "~/store";

export default function Page() {
  const { user } = useAuthStore((state) => state);
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
