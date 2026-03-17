import { useContext, useEffect, useState } from "react";
import { BudgeterContext } from "@/context/budgeter";
import Image from "next/image";

type Supply = {
  _id: string;
  name: string;
  price: number;
  category: string;
  categorySlug: string;
  photos: string[];
  createdAt: string;
};

export default function Items() {
  const [, dispatch] = useContext(BudgeterContext);
  const [items, setItems] = useState<Supply[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/supplies?category=internal-doors");
      const data: Supply[] = await res.json();

      // Sort example (by price ASC)
      const sorted = data.sort((a, b) => a.price - b.price);

      setItems(sorted);
    }

    fetchData();
  }, []);

  return (
    <>
      {items.map((item) => (
        <div key={item._id} style={{ marginBottom: "20px" }}>
          <h3>{item.name}</h3>
          <p>€{item.price}</p>
          {item.photos?.[0] && (
            <Image
              src={item.photos[0]}
              alt={item.name}
              width={200}
              height={200}
            />
          )}
        </div>
      ))}
      <div className="flex justify-between">
        <button
          className="bg-slate-400 py-2 px-4 rounded-2xl"
          onClick={() => dispatch({ type: "TYPE_OF_SERVICES" })}
        >
          Next
        </button>
        <button
          className="bg-slate-400 py-2 px-4 rounded-2xl"
          onClick={() => dispatch({ type: "TYPE_OF_SERVICES" })}
        >
          Back
        </button>
      </div>
    </>
  );
}
