"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  const handleSearch = useCallback(
    (term: string) => {
      setValue(term);
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set("search", term);
      else params.delete("search");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name, email or course..."
        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
