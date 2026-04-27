'use client';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Kyra Admin
        </h1>

        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Operations console for the Kyra mobility platform — driver onboarding,
          live ride monitoring, incident response, and fleet management.
        </p>

        <button
          type="button"
          onClick={() => console.log('Sign in pressed')}
          className="mt-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign in
        </button>
      </div>
    </main>
  );
}
