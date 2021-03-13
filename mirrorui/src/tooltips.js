import UIUtils from "./util/UIUtils";

export default {
  home: {
    mcap: UIUtils.getTip("mAsset market cap in UST"),
    totalValueLocked: UIUtils.getTip("Total value locked (UST) in Mirror Protocol by $MIR stakers & liquidity providers"),
    collateralRatio: UIUtils.getTip("Net collateral ratio - overall collateral at network level for minting mAssets"),
    govApr: UIUtils.getTip("Staking APR for $MIR governance. $MIR stakers earn rewards from CDP closures. Rewards are automatically re-staked."),
    latest24hActiveUsers: UIUtils.getTip("Active users in last 24 hours that used Mirror Protocol"),
    latest24hFeeVolume: UIUtils.getTip("Total transaction Fee (UST) from last 24 hours of Mirror Protocol usage"),
    latest24hMirVolume: UIUtils.getTip("MIR volume (UST) from last 24 hours of Mirror Protocol usage"),
    latest24hTransactions: UIUtils.getTip("Total transaction count from last 24 hours of Mirror Protocol usage"),
    latest24hVolume: UIUtils.getTip("Total volume (UST) from last 24 hours of Mirror Protocol usage"),
    mirCirculatingSupply: UIUtils.getTip("Current circulating supply of $MIR is: $value1"),
    mirTotalSupply: UIUtils.getTip("Total supply of $MIR is: $value1"),
    nextMirAirdrop: UIUtils.getTip("$value1 - the anticipated time left for next $MIR airdrop snapshot. Actual airdrop happens 3-5 hours after that."),
  },
  homeCharts: {
    tvl: UIUtils.getTip("Growth of total value locked (UST). Latest date data is partial. All dates are in GMT."),
    mAssetMcap: UIUtils.getTip("Growth of mAsset market cap (UST) over time. Latest date data is partial. All dates are in GMT."),
    volume: UIUtils.getTip("Daily Mirror protocol volume in UST. Latest date data is partial. All dates are in GMT."),
    fee: UIUtils.getTip("Daily transaction fee collected in the protocol in UST. Latest date data is partial. All dates are in GMT."),
    activeUsers: UIUtils.getTip("Daily active users of the protocol. Latest date data is partial. All dates are in GMT."),
    txCount: UIUtils.getTip("Number of daily transactions in the protocol. Latest date data is partial. All dates are in GMT."),
    apr: UIUtils.getTip("Change in staking apr for $MIR using governance staking. Latest date data is partial. All dates are in GMT."),
    collateralRatio: UIUtils.getTip("Net collateral ratio - overall collateral at network level for minting mAssets. Latest date data is partial. All dates are in GMT."),
  }
};
