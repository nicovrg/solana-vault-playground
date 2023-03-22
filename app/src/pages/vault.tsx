import type { NextPage } from "next";
import Head from "next/head";
import { VaultView } from "../views";

const Vault: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <VaultView />
    </div>
  );
};

export default Vault;
