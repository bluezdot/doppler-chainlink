import { Address } from 'viem';

/**
 * Vesting schedule configuration
 * @property yearlyMintCap Annual minting cap
 * @property vestingDuration Duration of vesting period
 * @property recipients Array of recipient addresses
 * @property amounts Corresponding vesting amounts
 */
export interface VestingConfig {
    yearlyMintRate: bigint;
    vestingDuration: bigint;
    recipients: Address[];
    amounts: bigint[];
}