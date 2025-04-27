import { Filter } from "@shopify/hydrogen-react/storefront-api-types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface DropdownContext {
  dropdownOpen: boolean;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  filter: Filter | "sort" | undefined;
  setFilter: Dispatch<SetStateAction<Filter | "sort" | undefined>>;
  position: { x: number; y: number; height: number } | undefined;
  setPosition: Dispatch<SetStateAction<any>>;
}

export const DropdownContext = createContext<DropdownContext>({
  dropdownOpen: false,
  setDropdownOpen: () => {},
  filter: undefined,
  setFilter: () => {},
  position: undefined,
  setPosition: () => {},
});

export default function DropdownProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [position, setPosition] = useState();
  const [filter, setFilter] = useState<Filter | "sort" | undefined>();

  return (
    <DropdownContext.Provider
      value={{
        dropdownOpen,
        setDropdownOpen,
        position,
        setPosition,
        filter,
        setFilter,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}
