import React, { useMemo } from 'react';

interface Props {
  text: string;
  start: number;
  end?: number;
}
const EllipsisText: React.FC<Props> = ({ start, end = 0, text }) => {
  const str = useMemo(() => {
    const { length } = text;
    const input = start + end;
    if (length <= input) return text;
    const pre = text.substring(0, start);
    const sub = end > 0 && input < length ? text.substring(length - end) : '';
    return `${pre}...${sub}`;
  }, [start, end, text]);

  return <span>{str}</span>;
};

EllipsisText.defaultProps = {
  end: 0,
};

export default EllipsisText;
