type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams; // <- await here

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Admin login</h1>

      {error && (
        <p className="mb-3 text-sm text-red-600">
          Invalid username or password.
        </p>
      )}

      <form action="/api/admin/login" method="post" className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Username</label>
          <input
            name="username"
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-cyan-700 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-800"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
