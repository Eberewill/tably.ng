import { useState } from "react";
import { formatNaira } from "./currency";
import type { MenuItem } from "./types";

export function DishDetail({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (selections: string[]) => void;
}) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const options = item.customizations ?? [];
  const ready = options.every(
    (group) => !group.required || selections[group.name],
  );
  const selectedOptions = () =>
    options
      .map((group) => selections[group.name])
      .filter((selection): selection is string => Boolean(selection));

  return (
    <main className="dish-detail">
      <img className="dish-detail-image" src={item.image} alt={item.name} />
      <section className="dish-detail-copy">
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <b>{formatNaira(item.price)}</b>
      </section>
      {options.length > 0 && (
        <form
          className="customizations"
          onSubmit={(event) => {
            event.preventDefault();
            if (ready) onAdd(selectedOptions());
          }}
        >
          {options.map((group) => (
            <fieldset key={group.name}>
              <legend>{group.name}</legend>
              {group.required && <span>Required</span>}
              <div>
                {group.options.map((option) => (
                  <label key={option}>
                    <span>{option}</span>
                    <input
                      type="radio"
                      name={group.name}
                      value={option}
                      checked={selections[group.name] === option}
                      onChange={() =>
                        setSelections((current) => ({
                          ...current,
                          [group.name]: option,
                        }))
                      }
                      required={group.required}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </form>
      )}
      <div className="detail-action">
        <button disabled={!ready} onClick={() => onAdd(selectedOptions())}>
          <span>Add to order</span>
          <b>{formatNaira(item.price)}</b>
        </button>
      </div>
    </main>
  );
}
