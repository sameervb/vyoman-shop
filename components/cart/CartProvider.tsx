"use client";

// CartProvider wraps the app to ensure the Zustand cart store
// (which uses localStorage) is only accessed on the client.
// No context provider needed — Zustand handles this natively.
// This component exists only to mark the subtree as "use client".

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
