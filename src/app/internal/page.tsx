'use client';

import { useEffect } from 'react';

export default function Internal() {
  useEffect(() => {
    document.cookie =
      'traffic_type=internal; path=/; max-age=31536000';
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Internal traffic activated</h1>
      <p>This device is now excluded from GA.</p>
    </div>
  );
}
