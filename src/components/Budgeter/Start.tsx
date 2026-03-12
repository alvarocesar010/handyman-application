import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";

export default function Start() {
  const [, dispatch] = useContext(BudgeterContext);

  return (
    <div>
      {/* <p>Click on button to start your quote</p> */}
      <button onClick={() => dispatch({ type: "NEXT_STAGE" })}></button>
    </div>
  );
}
