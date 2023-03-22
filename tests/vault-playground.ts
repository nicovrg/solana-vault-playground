import { BN } from "bn.js";

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { VaultPlayground } from "../target/types/vault_playground";

describe("vault-playground", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VaultPlayground as Program<VaultPlayground>;
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
  const user1: anchor.web3.Keypair = anchor.web3.Keypair.generate();

  const [Vault] = await anchor.web3.PublicKey.findProgramAddressSync([
    utf8.encode("vault"),
    publicKey.toBuffer(),
    user1.publicKey.toBuffer()
  ],
  program.programId
);


  it("bank was created!", async () => {
    const tx = await program.methods.create("wojack").accounts({
      vault: Vault,
      user: publicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      // system_program: anchor.web3.SystemProgram.programId
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});