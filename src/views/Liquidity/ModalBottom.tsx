import React from 'react';
import { Currency, CurrencyAmount, Percent, Price } from 'definixswap-sdk';
import ConfirmAddModalBottom from './ConfirmAddModalBottom';

interface IProps {
  price: Price;
  currencies: {
    CURRENCY_A?: Currency;
    CURRENCY_B?: Currency;
  };
  parsedAmounts: {
    CURRENCY_A?: CurrencyAmount;
    CURRENCY_B?: CurrencyAmount;
  };
  noLiquidity: boolean;
  onAdd: () =>  Promise<void>;
  poolTokenPercentage: Percent;
  allowedSlippage: number;
}

const ModalBottom: React.FC<IProps> = ({
  price,
  currencies,
  parsedAmounts,
  noLiquidity,
  onAdd,
  poolTokenPercentage,
  allowedSlippage
}) => {
  return (
    <></>
    // <ConfirmAddModalBottom
    //   price={price}
    //   currencies={currencies}
    //   parsedAmounts={parsedAmounts}
    //   noLiquidity={noLiquidity}
    //   onAdd={onAdd}
    //   poolTokenPercentage={poolTokenPercentage}
    //   allowedSlippage={allowedSlippage}
    // />
  )
}

export default ModalBottom;