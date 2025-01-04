export interface WindowWithEthereum extends Window {
  ethereum: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    isMetaMask?: boolean;
  }
}

export interface ErrorDetails {
  message: string;
  data?: unknown;
  code?: string | number;
} 