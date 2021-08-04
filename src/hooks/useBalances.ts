// import { useMemo } from 'react'
// import erc20 from 'config/abi/erc20.json'
// import multicall from 'utils/multicall'
// import { getAddress } from 'utils/addressHelpers'
// import contracts from 'config/constants/contracts'
// import BigNumber from 'bignumber.js'
// 
// const { wklay } = contracts
// 
// const useBalances = (account: string, addresses: string[] | undefined) => {
//   const addressesWithoutMain = addresses.filter(address => address.toLowerCase() !== getAddress(wklay).toLowerCase())
//   const addressMain = addresses.find(address => address.toLowerCase() === getAddress(wklay).toLowerCase())
//   const calls = addressesWithoutMain.map(address => {
//     return address === getAddress(wklay)
//       ? {}
//       : {
//           address,
//           name: 'balanceOf',
//           params: [account],
//         }
//   })
// 
//   const withoutMainBalances = await multicall(erc20, calls)
//   const mainBalance = addressMain ? await multicallEth(addressMain) : new BigNumber(0)
//   return useMemo(
//     () =>
//       addresses?.map(address => {
//         if (!account || !address) return undefined
//         if (address.toLowerCase() === getAddress(wklay).toLowerCase()) return mainBalance
//         if (address) return withoutMainBalances[addressesWithoutMain.indexOf(address)]
//         return undefined
//       }) ?? [],
//     [account, addresses, mainBalance, withoutMainBalances, addressesWithoutMain],
//   )
// }
// 
// export default useBalances
const useBalances = () => {

}
export default useBalances
