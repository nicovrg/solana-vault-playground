use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("8HgHuULD1mrHTmtLVQuuvimcEVkswoeFZn2iNz7A22w5");

#[program]
pub mod vault_playground {
    use super::*;

    pub fn create(ctx: Context<Create>, name: String) -> ProgramResult {
        let vault = &mut ctx.accounts.vault;
        vault.name = name;
        vault.balance = 0;
        vault.owner = *ctx.accounts.user.key;
        Ok({})
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> ProgramResult {
        let txn = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            amount
        );
        anchor_lang::solana_program::program::invoke(
            &txn,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info()
            ],
        )?;
        (&mut ctx.accounts.vault).balance += amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
        let vault = &mut ctx.accounts.vault;
        let user = &mut ctx.accounts.user;
        if vault.owner != user.key() {
            return Err(ProgramError::IncorrectProgramId);
        }
        let rent = Rent::get()?.minimum_balance(vault.to_account_info().data_len());
        if **vault.to_account_info().lamports.borrow() - rent < amount {
            return Err(ProgramError::InsufficientFunds);
        }
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer=user, space=5000, seeds=[b"vaultaccount", user.key().as_ref()], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Vault {
    pub name: String,
    pub balance: u64,
    pub owner: Pubkey,
}

#[derive(Accounts)]
pub struct Deposit<'info>{
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info>{
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
}