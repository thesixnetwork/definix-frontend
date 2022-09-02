import { SpaceProps } from "styled-system";

import {
  ImgTokenAda,
  ImgTokenBtcb,
  ImgTokenBusd,
  ImgTokenFavor,
  ImgTokenFinix,
  ImgTokenKbnb,
  ImgTokenKdai,
  ImgTokenKeth,
  ImgTokenKlay,
  ImgTokenKsp,
  ImgTokenKusdt,
  ImgTokenKwbtc,
  ImgTokenSix,
  ImgTokenUnselect,
  ImgTokenVfinix,
  ImgTokenXrp,
} from "./Symbol";

export enum COIN_SYMBOL {
  ADA = "ADA",
  BTCB = "BTCB",
  BUSD = "BUSD",
  FINIX = "FINIX",
  OBNB = "OBNB",
  KDAI = "KDAI",
  OETH = "OETH",
  KLAY = "KLAY",
  WKLAY = "WKLAY",
  KSP = "KSP",
  OUSDT = "OUSDT",
  OWBTC = "OWBTC",
  SIX = "SIX",
  UNSELECT = "UNSELECT",
  VFINIX = "VFINIX",
  OXRP = "OXRP",
  /**
   * @favor
   */
  FAVOR = "FAVOR",
}

export const COIN_SRCSET: Record<COIN_SYMBOL, string[]> = {
  [COIN_SYMBOL.ADA]: ImgTokenAda,
  [COIN_SYMBOL.BTCB]: ImgTokenBtcb,
  [COIN_SYMBOL.BUSD]: ImgTokenBusd,
  [COIN_SYMBOL.FINIX]: ImgTokenFinix,
  [COIN_SYMBOL.OBNB]: ImgTokenKbnb,
  [COIN_SYMBOL.KDAI]: ImgTokenKdai,
  [COIN_SYMBOL.OETH]: ImgTokenKeth,
  [COIN_SYMBOL.KLAY]: ImgTokenKlay,
  [COIN_SYMBOL.WKLAY]: ImgTokenKlay,
  [COIN_SYMBOL.KSP]: ImgTokenKsp,
  [COIN_SYMBOL.OUSDT]: ImgTokenKusdt,
  [COIN_SYMBOL.OWBTC]: ImgTokenKwbtc,
  [COIN_SYMBOL.SIX]: ImgTokenSix,
  [COIN_SYMBOL.UNSELECT]: ImgTokenUnselect,
  [COIN_SYMBOL.VFINIX]: ImgTokenVfinix,
  [COIN_SYMBOL.OXRP]: ImgTokenXrp,
  [COIN_SYMBOL.FAVOR]: ImgTokenFavor,
};

export interface CoinProps extends SpaceProps {
  symbol: COIN_SYMBOL | string;
  size?: string;
}

export interface LpProps extends SpaceProps {
  lpSymbols: string[];
  size?: string;
}
