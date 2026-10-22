"use client";

import { Battle } from "@/components/Battle";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex flex-col items-center min-w-100vw min-h-dvh bg-slate-700 p-6">
        <div className="w-full max-w-80 rounded-2xl bg-slate-900 p-8 text-center shadow-lg">
          <h1 className="mb-6 text-xl font-bold text-gray-100">
            Counter
          </h1>

          <p className="mb-8 text-4xl font-extrabold text-gray-100">
            {count}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCount((prev) => prev - 1)}
              className="rounded-lg text-sm bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600 active:scale-95"
            >
              −
            </button>

            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="rounded-lg text-sm bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setCount(0)}
            className="mt-5 text-sm text-gray-500 underline hover:text-gray-800"
          >
            Reset
          </button>
        
      </div>
      {/* Uncomment the line below to show the current state of the battle sim. It's a react component so you can put it wherever you want by moving <Battle/> aroudn as if it were an html element */}
      {/* <Battle/>*/} 
    </main>
  );
}