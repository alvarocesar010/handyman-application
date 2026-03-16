"use client";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type Stage = "Start" | "Category" | "ProductDetails" | "Quote";

interface BudgetState {
  quoteStage: Stage;
}

type Action = { type: string; payload?: string };

const STAGES: Stage[] = ["Start", "Category", "ProductDetails", "Quote"];

const initialState: BudgetState = {
  quoteStage: STAGES[0],
};

const budgeterReducer = (state: BudgetState, action: Action) => {
  switch (action.type) {
    case "NEXT_STAGE":
      return {
        ...state,
        quoteStage: STAGES[1],
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
