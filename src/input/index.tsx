import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { InternalInput } from './Input';
import { Password } from './Password';
import { Search } from './Search';
import { TextArea } from './TextArea';
import type { InputProps } from './types';

type CompoundedInput = ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>> & {
  Password: typeof Password;
  Search: typeof Search;
  TextArea: typeof TextArea;
};

/** `Input`, with `Input.Password`, `Input.Search` and `Input.TextArea` attached (AntD API). */
export const Input = InternalInput as CompoundedInput;
Input.Password = Password;
Input.Search = Search;
Input.TextArea = TextArea;

export { Password, Search, TextArea };
export type {
  AllowClear,
  AutoSizeType,
  InputProps,
  InputSize,
  InputStatus,
  InputVariant,
  PasswordProps,
  SearchProps,
  TextAreaProps,
} from './types';
