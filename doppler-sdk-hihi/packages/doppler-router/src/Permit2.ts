import {
  Address,
  Hex,
  parseAbi,
  PublicClient,
  TypedData,
  WalletClient,
} from 'viem';

export type PermitDetails = {
  token: Address;
  amount: bigint;
  expiration: bigint;
  nonce: bigint;
};

export type PermitSingle = {
  details: PermitDetails;
  spender: Address;
  sigDeadline: bigint;
};

export type PermitBatch = {
  details: PermitDetails[];
  spender: Address;
  sigDeadline: bigint;
};

export type TransferDetail = {
  from: Address;
  to: Address;
  amount: bigint;
  token: Address;
};

const PERMIT2_PERMIT_TYPE: TypedData = {
  PermitDetails: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' },
  ],
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
};

const PERMIT2_PERMIT_BATCH_TYPE: TypedData = {
  PermitDetails: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' },
  ],
  PermitBatch: [
    { name: 'details', type: 'PermitDetails[]' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
};

// allow to call permit2.allowance(address user, address token, address spender)
const permit2Abi = parseAbi([
  'function allowance(address user, address token, address spender) external view returns (uint160 amount, uint48 expiration, uint48 nonce)',
]);

function getEip712Domain(chainId: number, verifyingContract: Address) {
  return {
    name: 'Permit2',
    chainId,
    verifyingContract,
  };
}

export async function getNonce(
  userAddress: Address,
  tokenAddress: Address,
  spenderAddress: Address,
  publicClient: PublicClient,
  permit2Address: Address
) {
  const [, , nonce] = await publicClient.readContract({
    address: permit2Address,
    abi: permit2Abi,
    functionName: 'allowance',
    args: [userAddress, tokenAddress, spenderAddress],
  });

  return nonce;
}

export async function signPermit(
  permit: PermitSingle,
  walletClient: WalletClient,
  chainId: number,
  permit2Address: Address
): Promise<Hex> {
  const signature = await walletClient.signTypedData({
    account: walletClient.account!,
    domain: getEip712Domain(chainId, permit2Address),
    types: PERMIT2_PERMIT_TYPE,
    primaryType: 'PermitSingle',
    message: permit,
  });

  return signature;
}

export async function getPermitSignature(
  permit: PermitSingle,
  chainId: number,
  permit2Address: Address,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<Hex> {
  const nonce = await getNonce(
    walletClient.account!.address,
    permit.details.token,
    permit2Address,
    publicClient,
    permit2Address
  );
  permit.details.nonce = BigInt(nonce);
  return signPermit(permit, walletClient, chainId, permit2Address);
}

export async function getPermitBatchSignature(
  permit: PermitBatch,
  walletClient: WalletClient,
  chainId: number,
  permit2Address: Address,
  publicClient: PublicClient
): Promise<Hex> {
  for (const detail of permit.details) {
    const nonce = await getNonce(
      walletClient.account!.address,
      detail.token,
      permit2Address,
      publicClient,
      permit2Address
    );
    detail.nonce = BigInt(nonce);
  }

  return signPermitBatch(permit, walletClient, chainId, permit2Address);
}

export async function signPermitBatch(
  permit: PermitBatch,
  walletClient: WalletClient,
  chainId: number,
  permit2Address: Address
): Promise<Hex> {
  const signature = await walletClient.signTypedData({
    account: walletClient.account!,
    domain: getEip712Domain(chainId, permit2Address),
    types: PERMIT2_PERMIT_BATCH_TYPE,
    primaryType: 'PermitBatch',
    message: permit,
  });

  return signature;
}
