import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { init, Web3OnboardProvider } from "@web3-onboard/react";
import { onboardConfig } from "@/Providers";

const wen3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  ...onboardConfig,
});


const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <main className={inter.className}>
      <Web3OnboardProvider web3Onboard={wen3Onboard}>
        <Component {...pageProps} />
      </Web3OnboardProvider>
    </main>
  );
}

export default App;
