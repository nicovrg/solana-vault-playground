import { FC, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { Program, AnchorProvider, utils, web3, BN } from "@project-serum/anchor"
import idl from "./vault.json"

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const program_id = new PublicKey(idl.metadata.address)

export const Vault: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const [vaults, setVaults] = useState([]);
  
  const getProvider = () => {
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return provider;
  }
  
  const createVault = async () => {
    const provider = getProvider();
    const program = new Program(idl_object, program_id, provider);
    
    try {
      const [vault] = await PublicKey.findProgramAddressSync([
        utils.bytes.utf8.encode("vaultaccount"),
        provider.wallet.publicKey.toBuffer()
      ], program_id);
      
      await program.rpc.create("vault1", {
        accounts: {
          vault,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });
      
      console.log("vault created" + vault.toString());
    } catch (error) {
      console.log("error while creating vault:", error);
    }
  }
  
  const getVaults = async () => {
    const provider = getProvider();
    const program = new Program(idl_object, program_id, provider);
    
    try {
      Promise.all((await connection.getProgramAccounts(program_id)).map(async vault => ({
        ... (await program.account.vault.fetch(vault.pubkey)),
        pubkey: vault.pubkey
      }))).then(vaults => {
        setVaults(vaults);
        console.log("vaults:", vaults);
      });
    } catch (error) {
      console.log("error while retrieving vaults:", error);
    }
    
  }
  
  const depositToVault = async (publicKey) => {
    const provider = getProvider();
    const program = new Program(idl_object, program_id, provider);
    
    try {
      await program.rpc.deposit(new BN(0.1 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          vault: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });
      console.log("deposited:", vaults);
    } catch (error) {
      console.log("error while depositing to vault:", error);
    }
  }
  
  const withdrawFromVault = async (publicKey) => {
    const provider = getProvider();
    const program = new Program(idl_object, program_id, provider);
    
    try {
      await program.rpc.withdraw(new BN(0.1 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          vault: publicKey,
          user: provider.wallet.publicKey
        }
      });
      console.log("withdraw:", vaults);
    } catch (error) {
      console.log("error while withdrawing from vault:", error);
    }
  }

  return (
    <>
      {
        vaults.map((vault, id) => {
          return (
            <div className="md:hero-content flex flex-col" key={id} >
              <h1>{vault.name.toString()}</h1>
              <span>{vault.balance.toString()}</span>
              <button className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white" onClick={() => depositToVault(vault.pubkey)}>
                <span>Deposit To Vault</span>
              </button>
            </div>
            )
        })
      }
      <div className="flex flex-row justify-center">
        <div className="relative group items-center">
          <div className="m-1 -inset-0.5 bg-gradient-to-r group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt">
            
            <button className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500" onClick={createVault}>
              <span className="block group-disabled:hidden">Create Vault</span>
            </button>
            
            <button className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500" onClick={getVaults}>
              <span className="block group-disabled:hidden">Fetch Vaults</span>
            </button>

            <button className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500" onClick={withdrawFromVault}>
              <span className="block group-disabled:hidden">Withdraw From Vault</span>
            </button>

            </div>
        </div>
      </div>
    </>
  );
};
    