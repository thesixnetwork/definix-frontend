import React, { useState } from "react";
import { ChainToggle, ChainToggleItem, ChainBscIcon, ChainKlaytnIcon } from "definixswap-uikit";

interface Props {
  toggleScale?: "sm" | "md";
}

const Chain: React.FC<Props> = ({ toggleScale }) => {
  const [chainIndex, setChainIndex] = useState(0);
  return (
    <div>
      <ChainToggle toggleScale={toggleScale} activeIndex={chainIndex} onItemClick={setChainIndex}>
        <ChainToggleItem
          as="a"
          href="#d"
          startIcon={<ChainBscIcon />}
          label={toggleScale === "sm" ? "bsc" : "Binance smart chain"}
        />
        <ChainToggleItem as="a" href="#a" startIcon={<ChainKlaytnIcon />} label="Klaytn chain" />
      </ChainToggle>
    </div>
  );
};

export default React.memo(Chain);
