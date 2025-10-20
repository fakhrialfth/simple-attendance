/// <reference types="vite/client" />

declare global {
  interface Window {
    Ziggy?: any;
  }

  function route(name: string, params?: any, absolute?: boolean): string;
}

export {};
