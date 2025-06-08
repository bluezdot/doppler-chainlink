import { Address } from "viem";
import { DopplerV3Addresses } from "./types";

export const DOPPLER_V3_ADDRESSES: { [chainId: number]: DopplerV3Addresses } = {
  // unichain sepolia
  1301: {
    airlock: "0x651ab94B4777e2e4cdf96082d90C65bd947b73A4" as Address,
    tokenFactory: "0xC5E5a19a2ee32831Fcb8a81546979AF43936EbaA" as Address,
    v3Initializer: "0x7Fb9a622186B4660A5988C223ebb9d3690dD5007" as Address,
    governanceFactory: "0x1E4332EEfAE9e4967C2D186f7b2d439D778e81cC" as Address,
    liquidityMigrator: "0x44C448E38A2C3D206c9132E7f645510dFbBC946b" as Address,
    universalRouter: "0xf70536B3bcC1bD1a972dc186A2cf84cC6da6Be5D" as Address,
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as Address,
    quoterV2: "0x6Dd37329A1A225a6Fca658265D460423DCafBF89" as Address,
    univ2Router02: "0x284f11109359a7e1306c3e447ef14d38400063ff" as Address,
    bundler: "0x63f8C8F9beFaab2FaCD7Ece0b0242f78B920Ee90" as Address,
  },
  // unichain
  130: {
    airlock: "0x77EbfBAE15AD200758E9E2E61597c0B07d731254" as Address,
    tokenFactory: "0x43d0D97EC9241A8F05A264f94B82A1d2E600f2B3" as Address,
    v3Initializer: "0x9F4e56be80f08ba1A2445645EFa6d231E27b43ec" as Address,
    governanceFactory: "0x99C94B9Df930E1E21a4E4a2c105dBff21bF5c5aE" as Address,
    liquidityMigrator: "0xf6023127f6E937091D5B605680056A6D27524bad" as Address,
    universalRouter: "0xef740bf23acae26f6492b10de645d6b98dc8eaf3" as Address,
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as Address,
    quoterV2: "0x385A5cf5F83e99f7BB2852b6A19C3538b9FA7658" as Address,
    univ2Router02: "0x284f11109359a7e1306c3e447ef14d38400063ff" as Address,
    bundler: "0x91231cDdD8d6C86Df602070a3081478e074b97b7" as Address,
  },
  // base sepolia
  84532: {
    airlock: '0x7E6cF695a8BeA4b2bF94FbB5434a7da3f39A2f8D' as Address,
    tokenFactory: '0xAd62fc9eEbbDC2880c0d4499B0660928d13405cE' as Address,
    v3Initializer: "0xEB6E6Cd5858a87908B2914AE9CC7bbBE91e70067" as Address,
    governanceFactory: '0xff02a43A90c25941f8c5f4917eaD79EB33C3011C' as Address,
    liquidityMigrator: '0x8f4814999D2758ffA69689A37B0ce225C1eEcBFf' as Address,
    universalRouter: "0x492E6456D9528771018DeB9E87ef7750EF184104" as Address,
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as Address,
    quoterV2: "0xC5290058841028F1614F3A6F0F5816cAd0df5E27" as Address,
    univ2Router02: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602" as Address,
    bundler: "0x1B71ecBdE4A7Dc450847b0F139141392fd729F05" as Address,
  },
  // ink
  57073: {
    airlock: "0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12" as Address,
    tokenFactory: "0xFAafdE6a5b658684cC5eb0C5c2c755B00A246F45" as Address,
    v3Initializer: "0xaA47D2977d622DBdFD33eeF6a8276727c52EB4e5" as Address,
    governanceFactory: "0xb4deE32EB70A5E55f3D2d861F49Fb3D79f7a14d9" as Address,
    liquidityMigrator: "0x5F3bA43D44375286296Cb85F1EA2EBfa25dde731" as Address,
    universalRouter: "0x112908dac86e20e7241b0927479ea3bf935d1fa0" as Address,
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as Address,
    quoterV2: "0x96b572D2d880cf2Fa2563651BD23ADE6f5516652" as Address,
    univ2Router02: "0xB3FB126ACDd5AdCA2f50Ac644a7a2303745f18b4" as Address,
    bundler: "0x136191B46478cAB023cbC01a36160C4Aad81677a" as Address,
  },
  // base
  8453: {
    airlock: "0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12" as Address,
    tokenFactory: "0xFAafdE6a5b658684cC5eb0C5c2c755B00A246F45" as Address,
    v3Initializer: "0xaA47D2977d622DBdFD33eeF6a8276727c52EB4e5" as Address,
    governanceFactory: "0xb4deE32EB70A5E55f3D2d861F49Fb3D79f7a14d9" as Address,
    liquidityMigrator: "0x5F3bA43D44375286296Cb85F1EA2EBfa25dde731" as Address,
    universalRouter: "0x6ff5693b99212da76ad316178a184ab56d299b43" as Address,
    permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3" as Address,
    quoterV2: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a" as Address,
    univ2Router02: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" as Address,
    bundler: "0x136191B46478cAB023cbC01a36160C4Aad81677a" as Address,
  },
};
