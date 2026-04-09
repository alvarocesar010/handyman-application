"use client";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type Stage = string;

type SelectedSupply = {
  _id: string;
  name: string;
  price: number;
  photo?: string;
};

interface BudgetState {
  quoteStage: Stage;
  selectedSupply?: SelectedSupply;
}

type Action =
  | { type: "TYPE_OF_SERVICES" }
  | { type: "SUP_FIT" }
  | { type: "CLOSE_TAB" }
  | { type: "PREVIOUS" }
  | {
      type: "SELECT_SUPPLY";
      payload: SelectedSupply;
    }|
    {type: "NEXT_STAGE"}

const STAGES: Stage[] = [
  "Start",
  "TypeOfService",
  "SuppliedFitted",
  "ProductDetails",
  "Quote",
];

const initialState: BudgetState = {
  quoteStage: STAGES[0],
};

const budgeterReducer = (state: BudgetState, action: Action) => {
  switch (action.type) {
    case "TYPE_OF_SERVICES":
      return {
        ...state,
        quoteStage: STAGES[1],
      };

    case "SUP_FIT":
      return {
        ...state,
        quoteStage: STAGES[2],
      };

    case "CLOSE_TAB":
      return {
        ...state,
        quoteStage: STAGES[0],
      };

    case "PREVIOUS":
      const currentIndex = STAGES.indexOf(state.quoteStage);

      const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      return {
        ...state,
        quoteStage: STAGES[prevIndex],
      };
    default:
      return state;
  }
};

export const BudgeterContext = createContext<[BudgetState, Dispatch<Action>]>([
  initialState,
  () => null,
]);

export const BudgeterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(budgeterReducer, initialState);
  return (
    <BudgeterContext.Provider value={[state, dispatch]}>
      {children}
    </BudgeterContext.Provider>
  );
};
