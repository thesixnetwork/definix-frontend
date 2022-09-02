import { InputHTMLAttributes } from "react";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch: (keyword: string) => any;
  onReset: () => any;
}
