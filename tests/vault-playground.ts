import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { VaultPlayground } from "../target/types/vault_playground";

describe("vault-playground", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VaultPlayground as Program<VaultPlayground>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
