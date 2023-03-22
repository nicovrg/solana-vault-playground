# Testing Vaults

## Front

```sh
cd app
yarn && yarn dev
```
require to have phantom in browser, dev settings and activate testnet mode on devnet

## Program

```sh
cd programs
anchor build && anchor deploy
```

create the address
```sh
solana-keygen new -o id.json
solana balance --keypair id.json --url https://api.devnet.solana.com
```

get the address
```sh
solana-keygen pubkey ./id.json
```

airdrop the address
```sh
solana airdrop 2 <address> --url https://api.devnet.solana.com
```

replace the program id everywhere (ctrl+maj+f -> find & replace all occurences [old id -> new id])
now build with new id
```sh
anchor build && anchor deploy
```