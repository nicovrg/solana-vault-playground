use anchor_lang::prelude::*;

declare_id!("8HgHuULD1mrHTmtLVQuuvimcEVkswoeFZn2iNz7A22w5");

#[program]
pub mod vault_playground {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
