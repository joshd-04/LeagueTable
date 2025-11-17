'use client';
import { Button, Link } from '@heroui/react';

// app/not-found.tsx  → 404 page
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p>This page doesn’t exist. Check the URL or go back home.</p>
      <Button as={Link} href="/">
        Go home
      </Button>
    </div>
  );
}
