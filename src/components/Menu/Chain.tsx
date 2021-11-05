import React, { useState } from "react";
import { useMatchBreakpoints, ChainToggle, ChainToggleItem, ChainBscIcon, ChainKlaytnIcon } from "definixswap-uikit";

const Chain: React.FC = () => {
  const { isMobile } = useMatchBreakpoints();
  const [chainIndex, setChainIndex] = useState(0);
  return (
    <div>
      <ChainToggle toggleScale={isMobile ? "sm" : "md"} activeIndex={chainIndex} onItemClick={setChainIndex}>
        <ChainToggleItem as="a" href="#d" startIcon={<ChainBscIcon />}>
          {isMobile ? "bsc" : "Binance smart chain"}
        </ChainToggleItem>
        <ChainToggleItem as="a" href="#a" startIcon={<ChainKlaytnIcon />}>
          Klaytn chain
        </ChainToggleItem>
      </ChainToggle>
    </div>
  );
};

export default React.memo(Chain);
