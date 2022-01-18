export enum ROUTES {
  HOME = '/',
  POOL = '/pool',
  FARM = '/farm',
  SWAP = '/swap',
  SWAP_REDIRECT_A = '/swap/:currencyIdA',
  SWAP_REDIRECT_AB = '/swap/:currencyIdA/:currencyIdB',
  LIQUIDITY = '/liquidity',
  LIQUIDITY_ADD = '/liquidity/add',
  LIQUIDITY_ADD_REDIRECT_A = '/liquidity/add/:currencyIdA',
  LIQUIDITY_ADD_REDIRECT_AB = '/liquidity/add/:currencyIdA/:currencyIdB',
  LIQUIDITY_LIST = '/liquidity/list',
  LIQUIDITY_REMOVE = '/liquidity/remove',
  LIQUIDITY_REMOVE_REDIRECT_AB = '/liquidity/remove/:currencyIdA/:currencyIdB',
  LIQUIDITY_REMOVE_REDIRECT_TOKENS = '/liquidity/remove/:tokens',
  LIQUIDITY_POOL_FINDER = '/liquidity/poolfinder',
  REBALANCING = '/rebalancing',
  MY_INVESTMENT = '/my',
  LONG_TERM_STAKE = '/long-term-stake',
  SUPER_STAKE = '/long-term-stake/super',
  BRIDGE = '/bridge',
  VOTING = '/voting'
}

export default null;