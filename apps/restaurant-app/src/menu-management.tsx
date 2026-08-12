import { useEffect, useMemo, useState, type FormEvent } from "react";
import "./menu-management.css";

type DishStatus = "Available" | "Out of Stock" | "Unavailable";
type DishType = "Single" | "Combo" | "Add-on";
type CustomisationCategory = "Base" | "Protein" | "Side" | "Sauce" | "Topping" | "Drink" | "Portion" | "Other";

type CustomisationGroup = {
  id: string;
  category: CustomisationCategory;
  required: boolean;
  selection: "one" | "multiple";
  options: Array<{ menuItemId: string; priceAdjustment: number }>;
};

type Dish = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  status: DishStatus;
  tags: string[];
  image: string;
  availableFrom: string;
  availableUntil: string;
  days: string[];
  dishType: DishType;
  customisations: CustomisationGroup[];
  ingredients: string;
  showOnMenu: boolean;
  featured: boolean;
};

const categories = ["Starters", "Mains", "Sides", "Soups", "Drinks", "Desserts"];
const dietaryTags = ["Spicy", "High Protein", "Gluten Free", "Vegetarian", "Vegan"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const customisationCategories: CustomisationCategory[] = ["Base", "Protein", "Side", "Sauce", "Topping", "Drink", "Portion", "Other"];
const dishTypeCopy: Record<DishType, string> = {
  Single: "Regular menu item",
  Combo: "Dish with multiple components or sides",
  "Add-on": "An item intended to be added to another dish",
};

const images = {
  jollof: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb9LRFQXl1oxTTz1PeIrjECAjksdT3DXDvNdGVXro7gI2Wn5WChITdQgWWbPrM46VyDyE7FgGpnTr02ngNbx4zTJcM9NC-gX1NABI-80zpN16U2NbVnra8o61SpBCpC97qV3DJm221nC8dfm7Mj7UfiN4ty7TPRbHgDX6kDBBk-XIBTJTnWKw0lHDSx3bxo1l0ZmnBTI9qkzNwSHes-eGcAhehhxn10Rws5K-0c7qoStDTx9HxpP4y",
  ribeye: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuNcwv6McsnfxZqwnFeuvWlorAYi4vyDMAwwp2T2XR4aFJ-GgpRQVXiwSCBHvwvjyBG6fXR4uKU5X1joSIM2_In5XpxLQElWuxWTUB4lEk5OQvmrc1GYnEDQVCcYyWNx21tQ0NAPO3b2EJkr8mCKdWjJOcSHVTLQ3eMOG3-UqUL2nf6KZNIoBjEa7L-1be-OLrU6JZmxpTnmH0lYld1w2ooZ-CRZMYjU1p5z4iQMbAxG94tS0zkoUc",
  okra: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPJ4s6ipPmxRJmrbyxbDuWxJe6U8LVqNC5kENzghWCMtHx1i2Wj08OQD2zIRvDJPQl9QCoSbrRUn1TpiVYiWT3qkuc1LRncdS6PNiRN3tyfafVZCCzQFg5zBwHKScjX_e3HVIyVTiQNbcUH5hMu0jLF0QNEkdX1PBJY0n5uqPvuPvetvY28LxmbIWRY2kAGCzmUdZ8NPhYUi9bXBUma3C9yJCGDvtxA2ydaA7Y1ulPzAi5aZVDIUb0",
  snails: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUQRNeenCUr8ELjv83KZLeRvmgVdF5yNBKD9CKHFokrfheP19rCD3XnlvlI-QF9cxkN1PvwDg6uj3OJjU1zz41eLJlfnIIIMsEjJN6xJ9xAVjb2rdjFQU7YtGd9XAs6A2tp1KCg594f8Iy_X_7mjOnDHhZ2U_EQmnittnOGvqzaIcaETE_ZJ30li4TbCLeXQilw5JueAzfHtOpE8nzFAt0neWR6rcX0gcrv-EDEwhWK8Cy6jy6OGmX",
};

const defaults = {
  availableFrom: "09:00",
  availableUntil: "22:00",
  days: weekdays.slice(0, 6),
  dishType: "Single" as DishType,
  customisations: [] as CustomisationGroup[],
  ingredients: "",
  showOnMenu: true,
  featured: false,
};

const initialDishes: Dish[] = [
  { id: "egusi-soup", name: "Egusi Soup", description: "Melon seeds, spinach and assorted meat cooked in a rich broth.", category: "Soups", price: 5500, status: "Available", tags: ["Spicy", "High Protein"], image: images.okra, ...defaults, customisations: [
    { id: "egusi-base", category: "Base", required: true, selection: "one", options: [{ menuItemId: "eba", priceAdjustment: 0 }, { menuItemId: "semo", priceAdjustment: 200 }, { menuItemId: "pounded-yam", priceAdjustment: 500 }] },
    { id: "egusi-protein", category: "Protein", required: true, selection: "one", options: [{ menuItemId: "goat-meat", priceAdjustment: 0 }, { menuItemId: "beef", priceAdjustment: 0 }, { menuItemId: "chicken", priceAdjustment: 0 }] },
  ], ingredients: "Melon Seeds, Spinach, Palm Oil, Beef, Crayfish, Seasoning, Onions" },
  { id: "jollof-rice", name: "Jollof Rice", description: "Nigerian party jollof rice with smoked pepper and herbs.", category: "Mains", price: 4000, status: "Available", tags: ["Gluten Free"], image: images.jollof, ...defaults },
  { id: "grilled-catfish", name: "Grilled Catfish", description: "Charcoal-grilled catfish served with plantain.", category: "Mains", price: 6500, status: "Available", tags: ["High Protein", "Gluten Free"], image: images.ribeye, ...defaults },
  { id: "fried-rice", name: "Fried Rice", description: "Mixed vegetables, aromatics and warming spices.", category: "Mains", price: 3800, status: "Available", tags: ["Vegetarian"], image: images.jollof, ...defaults },
  { id: "peppered-gizzard", name: "Peppered Gizzard", description: "Spicy sautéed gizzard with sweet peppers.", category: "Starters", price: 3500, status: "Out of Stock", tags: ["Spicy", "High Protein"], image: images.snails, ...defaults },
  { id: "moi-moi", name: "Moi Moi", description: "Steamed bean pudding with pepper and aromatics.", category: "Sides", price: 1500, status: "Available", tags: ["Vegetarian"], image: images.okra, ...defaults },
  { id: "pounded-yam", name: "Pounded Yam", description: "Soft and smooth pounded yam.", category: "Sides", price: 1500, status: "Available", tags: ["Vegetarian"], image: images.jollof, ...defaults },
  { id: "eba", name: "Eba", description: "Smooth cassava meal, served as a traditional soup accompaniment.", category: "Sides", price: 1000, status: "Available", tags: ["Vegan"], image: images.jollof, ...defaults },
  { id: "semo", name: "Semo", description: "Soft semolina swallow for Nigerian soups.", category: "Sides", price: 1200, status: "Available", tags: ["Vegetarian"], image: images.jollof, ...defaults },
  { id: "amala", name: "Amala", description: "Smooth yam flour swallow with a deep earthy flavour.", category: "Sides", price: 1000, status: "Available", tags: ["Vegan"], image: images.jollof, ...defaults },
  { id: "goat-meat", name: "Goat Meat", description: "Slow-cooked seasoned goat meat portion.", category: "Mains", price: 2000, status: "Available", tags: ["High Protein"], image: images.ribeye, ...defaults, dishType: "Add-on" },
  { id: "beef", name: "Beef", description: "Tender seasoned beef portion.", category: "Mains", price: 1500, status: "Available", tags: ["High Protein"], image: images.ribeye, ...defaults, dishType: "Add-on" },
  { id: "chicken", name: "Chicken", description: "Seasoned chicken portion.", category: "Mains", price: 1500, status: "Available", tags: ["High Protein"], image: images.ribeye, ...defaults, dishType: "Add-on" },
  { id: "chapman", name: "Chapman", description: "Classic non-alcoholic Nigerian cocktail.", category: "Drinks", price: 1800, status: "Unavailable", tags: ["Vegan"], image: images.snails, ...defaults, showOnMenu: false },
  { id: "suya-ribeye", name: "Suya Spiced Ribeye", description: "Prime ribeye with house-blended yaji spice.", category: "Mains", price: 18500, status: "Available", tags: ["Spicy", "High Protein", "Gluten Free"], image: images.ribeye, ...defaults, featured: true },
  { id: "jollof-bites", name: "Crisp Jollof Bites", description: "Golden jollof croquettes with pepper sauce.", category: "Starters", price: 6800, status: "Available", tags: ["Vegetarian"], image: images.jollof, ...defaults },
  { id: "seafood-okra", name: "Seafood Okra", description: "Okra cooked with prawns, croaker and calamari.", category: "Soups", price: 14200, status: "Available", tags: ["High Protein"], image: images.okra, ...defaults },
  { id: "ginger-fizz", name: "Ginger Citrus Fizz", description: "Fresh ginger, orange, lime and sparkling water.", category: "Drinks", price: 3600, status: "Available", tags: ["Vegan"], image: images.snails, ...defaults },
];

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function Icon({ name }: { name: "search" | "filter" | "list" | "grid" | "edit" | "upload" | "close" }) {
  const paths = {
    search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>,
    edit: <><path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z" /><path d="m14 7 3 3" /></>,
    upload: <><path d="M12 16V4m0 0L8 8m4-4 4 4" /><path d="M5 14v6h14v-6" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function emptyDish(): Dish {
  return {
    id: `dish-${Date.now()}`,
    name: "",
    description: "",
    category: "Mains",
    price: 0,
    status: "Available",
    tags: [],
    image: images.jollof,
    ...defaults,
  };
}

function readStoredDishes() {
  try {
    const stored = localStorage.getItem("tably.restaurant-menu");
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (!Array.isArray(parsed) || !parsed.every((dish) =>
      dish && typeof dish === "object" &&
      typeof dish.name === "string" &&
      typeof dish.price === "number" &&
      Array.isArray(dish.tags) &&
      Array.isArray(dish.days)
    )) return initialDishes;

    const storedDishes = parsed as Array<Dish & { customisations?: unknown }>;
    const migrated = storedDishes.map((dish) => {
      const seeded = initialDishes.find((item) => item.id === dish.id);
      const customisations = Array.isArray(dish.customisations) && dish.customisations.every((group) =>
        group && typeof group === "object" &&
        typeof group.id === "string" &&
        customisationCategories.includes(group.category as CustomisationCategory) &&
        typeof group.required === "boolean" &&
        (group.selection === "one" || group.selection === "multiple") &&
        Array.isArray(group.options) && group.options.every((option: unknown) =>
          option && typeof option === "object" &&
          typeof (option as { menuItemId?: unknown }).menuItemId === "string" &&
          typeof (option as { priceAdjustment?: unknown }).priceAdjustment === "number" &&
          Number.isFinite((option as { priceAdjustment: number }).priceAdjustment) &&
          (option as { priceAdjustment: number }).priceAdjustment >= 0
        )
      ) ? dish.customisations as CustomisationGroup[] : seeded?.customisations ?? [];
      return { ...dish, customisations };
    });
    const storedIds = new Set(migrated.map((dish) => dish.id));
    return [...migrated, ...initialDishes.filter((dish) => !storedIds.has(dish.id))];
  } catch {
    return initialDishes;
  }
}

function CustomisationDialog({ group, menuItems, currentDishId, onCancel, onSave }: {
  group?: CustomisationGroup;
  menuItems: Dish[];
  currentDishId: string;
  onCancel: () => void;
  onSave: (group: CustomisationGroup) => void;
}) {
  const [draft, setDraft] = useState<CustomisationGroup>(group ?? {
    id: `customisation-${Date.now()}`,
    category: "Base",
    required: true,
    selection: "one",
    options: [],
  });
  const [selectingOptions, setSelectingOptions] = useState(false);
  const [selectedIds, setSelectedIds] = useState(draft.options.map((option) => option.menuItemId));
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const selectableItems = menuItems
    .filter((item) => item.id !== currentDishId)
    .filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((left, right) => left.name.localeCompare(right.name));

  function applySelectedItems() {
    const existing = new Map(draft.options.map((option) => [option.menuItemId, option]));
    setDraft((current) => ({
      ...current,
      options: selectedIds.map((menuItemId) => existing.get(menuItemId) ?? { menuItemId, priceAdjustment: 0 }),
    }));
    setSelectingOptions(false);
    setQuery("");
  }

  function save() {
    if (!draft.options.length) {
      setError("Select at least one existing menu item for this customisation.");
      return;
    }
    onSave(draft);
  }

  return (
    <div className="customisation-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="customisation-dialog" role="dialog" aria-modal="true" aria-label={selectingOptions ? "Add options" : group ? `Edit ${group.category} customisation` : "Add customisation"}>
        <header>
          <div><h3>{selectingOptions ? "Add options" : group ? "Edit Customisation" : "Add Customisation"}</h3><p>{selectingOptions ? "Select existing menu items. No duplicate products will be created." : "Define what the guest needs to choose."}</p></div>
          <button type="button" onClick={onCancel} aria-label="Close customisation"><Icon name="close" /></button>
        </header>

        {selectingOptions ? <>
          <div className="customisation-selector">
            <label className="customisation-search"><Icon name="search" /><span className="sr-only">Search menu items</span><input type="search" placeholder="Search menu items…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <div className="menu-item-selector">
              {selectableItems.map((item) => <label key={item.id}>
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} />
                <img src={item.image} alt="" />
                <span><strong>{item.name}</strong><small>{item.category} · {item.status}</small></span>
                <b>{money.format(item.price)}</b>
              </label>)}
              {!selectableItems.length && <p className="customisation-empty">No menu items match your search.</p>}
            </div>
          </div>
          <footer><button type="button" onClick={() => { setSelectingOptions(false); setSelectedIds(draft.options.map((option) => option.menuItemId)); setQuery(""); }}>Cancel</button><button className="primary" type="button" onClick={applySelectedItems}>Add selected items ({selectedIds.length})</button></footer>
        </> : <>
          <div className="customisation-form">
            <label><span>Category</span><select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as CustomisationCategory }))}>{customisationCategories.map((category) => <option key={category}>{category}</option>)}</select><small>Categories describe what the guest is choosing.</small></label>

            <div className="customisation-rule-grid">
              <fieldset><legend>Selection rule</legend><label><input type="radio" name={`rule-${draft.id}`} checked={draft.required} onChange={() => setDraft((current) => ({ ...current, required: true }))} />Required</label><label><input type="radio" name={`rule-${draft.id}`} checked={!draft.required} onChange={() => setDraft((current) => ({ ...current, required: false }))} />Optional</label></fieldset>
              <fieldset><legend>Selection type</legend><label><input type="radio" name={`selection-${draft.id}`} checked={draft.selection === "one"} onChange={() => setDraft((current) => ({ ...current, selection: "one" }))} />Choose one</label><label><input type="radio" name={`selection-${draft.id}`} checked={draft.selection === "multiple"} onChange={() => setDraft((current) => ({ ...current, selection: "multiple" }))} />Choose multiple</label></fieldset>
            </div>

            <div className="customisation-options-heading"><span><strong>Options</strong><small>References to existing menu items</small></span><button type="button" onClick={() => { setSelectedIds(draft.options.map((option) => option.menuItemId)); setSelectingOptions(true); }}>+ Add menu item</button></div>
            <div className="customisation-option-editor">
              {draft.options.map((option) => {
                const item = menuItems.find((candidate) => candidate.id === option.menuItemId);
                if (!item) return null;
                return <article key={option.menuItemId}>
                  <div><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Menu price {money.format(item.price)}</small></span></div>
                  <label><span>Price adjustment</span><div><b>₦</b><input aria-label={`Price adjustment for ${item.name}`} type="number" min="0" step="100" value={option.priceAdjustment || ""} placeholder="Included" onChange={(event) => setDraft((current) => ({ ...current, options: current.options.map((candidate) => candidate.menuItemId === option.menuItemId ? { ...candidate, priceAdjustment: Number(event.target.value) } : candidate) }))} /></div><small>{option.priceAdjustment ? `Adds ${money.format(option.priceAdjustment)}` : "Included"}</small></label>
                  <button type="button" onClick={() => setDraft((current) => ({ ...current, options: current.options.filter((candidate) => candidate.menuItemId !== option.menuItemId) }))}>Remove</button>
                </article>;
              })}
              {!draft.options.length && <p className="customisation-empty">No options yet. Add existing menu items to make this group usable.</p>}
            </div>
          </div>
          {error && <p className="customisation-error" role="alert">{error}</p>}
          <footer><button type="button" onClick={onCancel}>Cancel</button><button className="primary" type="button" onClick={save}>Save customisation</button></footer>
        </>}
      </section>
    </div>
  );
}

function DishEditor({ dish, isNew, menuItems, onClose, onSave }: {
  dish: Dish;
  isNew: boolean;
  menuItems: Dish[];
  onClose: () => void;
  onSave: (dish: Dish) => void;
}) {
  const [draft, setDraft] = useState(dish);
  const [error, setError] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const [editingCustomisation, setEditingCustomisation] = useState<CustomisationGroup>();
  const [addingCustomisation, setAddingCustomisation] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (editingCustomisation || addingCustomisation) {
        setEditingCustomisation(undefined);
        setAddingCustomisation(false);
      } else if (previewing) setPreviewing(false);
      else onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [addingCustomisation, editingCustomisation, onClose, previewing]);

  function update<K extends keyof Dish>(key: K, value: Dish[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.category || draft.price <= 0) {
      setError("Add a dish name, category and valid price before saving.");
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      customisations: draft.dishType === "Add-on" ? [] : draft.customisations,
    });
  }

  function uploadImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5_000_000) {
      setError("Choose a PNG or JPG image up to 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("image", String(reader.result));
    reader.readAsDataURL(file);
  }

  function saveCustomisation(group: CustomisationGroup) {
    update("customisations", draft.customisations.some((item) => item.id === group.id)
      ? draft.customisations.map((item) => item.id === group.id ? group : item)
      : [...draft.customisations, group]);
    setEditingCustomisation(undefined);
    setAddingCustomisation(false);
  }

  return (
    <form className="dish-editor" onSubmit={submit}>
      <header className="dish-editor-header">
        <div>
          <button className="dish-editor-close" type="button" onClick={onClose} aria-label="Close dish editor"><Icon name="close" /></button>
          <div><h2>{isNew ? "Add New Dish" : "Edit Dish"}</h2><p>{isNew ? "Create a dish for your restaurant menu." : "Update dish details, pricing and availability."}</p></div>
        </div>
        <div>
          <button className="dish-editor-preview" type="button" onClick={() => setPreviewing(true)}>Preview</button>
          <button className="dish-editor-save" type="submit">{isNew ? "Add Dish" : "Save Changes"}</button>
        </div>
      </header>

      {error && <p className="dish-editor-error" role="alert">{error}</p>}

      <div className="dish-editor-body">
        <div className="dish-editor-fields">
          <fieldset>
            <legend>Basic Information</legend>
            <div className="dish-field-grid">
              <label><span>Dish name *</span><input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Egusi Soup" /></label>
              <label><span>Category *</span><select value={draft.category} onChange={(event) => update("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="dish-field-wide"><span>Short description</span><textarea maxLength={120} value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe the dish in one or two sentences." /><small>{draft.description.length}/120</small></label>
              <label><span>Status</span><select value={draft.status} onChange={(event) => update("status", event.target.value as DishStatus)}><option>Available</option><option>Out of Stock</option><option>Unavailable</option></select></label>
              <label><span>Price *</span><div className="price-input"><b>₦</b><input type="number" min="0" step="100" value={draft.price || ""} onChange={(event) => update("price", Number(event.target.value))} placeholder="5,500" /></div></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Dietary & Labels</legend>
            <span className="dish-group-label">Dietary tags</span>
            <div className="dish-tag-options">
              {dietaryTags.map((tag) => <button key={tag} type="button" aria-pressed={draft.tags.includes(tag)} onClick={() => update("tags", draft.tags.includes(tag) ? draft.tags.filter((item) => item !== tag) : [...draft.tags, tag])}>{tag}</button>)}
            </div>
            <span className="dish-group-label">Dish type</span>
            <div className="dish-type-options">
              {(["Single", "Combo", "Add-on"] as DishType[]).map((type) => <label key={type}><input type="radio" name="dish-type" checked={draft.dishType === type} onChange={() => setDraft((current) => ({ ...current, dishType: type, customisations: type === "Add-on" ? [] : current.customisations }))} /><span><strong>{type}</strong><small>{dishTypeCopy[type]}</small></span></label>)}
            </div>
          </fieldset>

          <fieldset className="dish-customisations" disabled={draft.dishType === "Add-on"}>
            <legend>Customisations</legend>
            <p>{draft.dishType === "Add-on" ? "Add-on items cannot have their own customisations." : "Categories describe what guests choose. Every option references an existing menu item."}</p>
            <div className="dish-customisation-list">
              {draft.customisations.map((group) => <article key={group.id}>
                <header><div><h3>{group.category}</h3><span>{group.required ? "Required" : "Optional"} · {group.selection === "one" ? "Choose 1" : "Choose multiple"}</span></div><strong>{group.options.length} {group.options.length === 1 ? "option" : "options"}</strong></header>
                <ul>{group.options.map((option) => {
                  const item = menuItems.find((candidate) => candidate.id === option.menuItemId);
                  return item ? <li key={option.menuItemId}><span><strong>{item.name}</strong><small>{money.format(item.price)} menu price</small></span><b>{option.priceAdjustment ? `+${money.format(option.priceAdjustment)}` : "Included"}</b></li> : null;
                })}</ul>
                <footer><button type="button" onClick={() => setEditingCustomisation(group)}>Edit</button><button type="button" onClick={() => update("customisations", draft.customisations.filter((item) => item.id !== group.id))}>Remove</button></footer>
              </article>)}
              {!draft.customisations.length && <div className="dish-customisation-empty"><strong>No customisations</strong><span>Add one when guests need to choose a base, protein, side or other component.</span></div>}
            </div>
            <button className="add-customisation-button" type="button" onClick={() => setAddingCustomisation(true)}>+ Add customisation</button>
          </fieldset>

          <fieldset>
            <legend>Ingredients</legend>
            <label><span>Ingredients</span><textarea value={draft.ingredients} onChange={(event) => update("ingredients", event.target.value)} placeholder="Melon seeds, spinach, palm oil…" /><small>Separate ingredients with commas.</small></label>
          </fieldset>
        </div>

        <aside className="dish-editor-aside">
          <fieldset>
            <legend>Dish Image</legend>
            <img src={draft.image} alt={draft.name || "Dish preview"} />
            <label className="dish-upload"><Icon name="upload" /><span><strong>Upload new image</strong><small>PNG or JPG up to 5MB</small></span><input type="file" accept="image/png,image/jpeg" onChange={(event) => uploadImage(event.target.files?.[0])} /></label>
          </fieldset>

          <fieldset>
            <legend>Availability</legend>
            <label><span>Available from</span><input type="time" value={draft.availableFrom} onChange={(event) => update("availableFrom", event.target.value)} /></label>
            <label><span>Available until</span><input type="time" value={draft.availableUntil} onChange={(event) => update("availableUntil", event.target.value)} /></label>
            <span className="dish-group-label">Days available</span>
            <div className="dish-days">{weekdays.map((day) => <label key={day}><input type="checkbox" checked={draft.days.includes(day)} onChange={() => update("days", draft.days.includes(day) ? draft.days.filter((item) => item !== day) : [...draft.days, day])} />{day}</label>)}</div>
          </fieldset>

          <fieldset>
            <legend>Display Settings</legend>
            <label className="dish-switch-line"><span><strong>Show on menu</strong><small>Guests can discover and order this dish.</small></span><input type="checkbox" checked={draft.showOnMenu} onChange={(event) => update("showOnMenu", event.target.checked)} /></label>
            <label className="dish-switch-line"><span><strong>Featured item</strong><small>Showcase this dish on the menu.</small></span><input type="checkbox" checked={draft.featured} onChange={(event) => update("featured", event.target.checked)} /></label>
          </fieldset>
        </aside>
      </div>

      {previewing && <div className="dish-preview-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPreviewing(false)}><article className="dish-preview" role="dialog" aria-modal="true" aria-label="Dish preview"><button type="button" onClick={() => setPreviewing(false)} aria-label="Close preview"><Icon name="close" /></button><img src={draft.image} alt="" /><span>{draft.category}</span><h2>{draft.name || "Untitled dish"}</h2><strong>{money.format(draft.price)}</strong><p>{draft.description || "Your dish description will appear here."}</p>{draft.tags.length > 0 && <small>{draft.tags.join(" · ")}</small>}</article></div>}
      {(addingCustomisation || editingCustomisation) && <CustomisationDialog group={editingCustomisation} menuItems={menuItems} currentDishId={draft.id} onCancel={() => { setEditingCustomisation(undefined); setAddingCustomisation(false); }} onSave={saveCustomisation} />}
    </form>
  );
}

export function MenuManagement() {
  const [dishes, setDishes] = useState<Dish[]>(readStoredDishes);
  const [category, setCategory] = useState("All Items");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DishStatus | "All">("All");
  const [sort, setSort] = useState("name");
  const [view, setView] = useState<"list" | "grid">("list");
  const [editing, setEditing] = useState<Dish>();
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    try {
      localStorage.setItem("tably.restaurant-menu", JSON.stringify(dishes));
    } catch {
      // ponytail: keep the workflow available in-session; move images to object storage when the API lands.
    }
  }, [dishes]);

  const filteredDishes = useMemo(() => dishes
    .filter((dish) => category === "All Items" || dish.category === category)
    .filter((dish) => status === "All" || dish.status === status)
    .filter((dish) => `${dish.name} ${dish.description} ${dish.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((left, right) => sort === "price-high" ? right.price - left.price : sort === "price-low" ? left.price - right.price : left.name.localeCompare(right.name)), [category, dishes, query, sort, status]);
  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedDishes = filteredDishes.slice(pageStart, pageStart + pageSize);
  const visiblePages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : currentPage <= 3 ? [2, 3] : currentPage >= totalPages - 2 ? [totalPages - 2, totalPages - 1] : [currentPage - 1, currentPage, currentPage + 1];

  useEffect(() => setPage(1), [category, pageSize, query, sort, status]);

  const counts = {
    available: dishes.filter((dish) => dish.status === "Available").length,
    out: dishes.filter((dish) => dish.status === "Out of Stock").length,
    unavailable: dishes.filter((dish) => dish.status === "Unavailable").length,
  };

  function cycleStatus() {
    setStatus((current) => current === "All" ? "Available" : current === "Available" ? "Out of Stock" : current === "Out of Stock" ? "Unavailable" : "All");
  }

  function saveDish(dish: Dish) {
    setDishes((current) => isNew ? [dish, ...current] : current.map((item) => item.id === dish.id ? dish : item));
    setEditing(undefined);
    setIsNew(false);
    setPage(1);
    setMessage(`${dish.name} ${isNew ? "was added" : "was updated"}.`);
  }

  return (
    <section className={`menu-management${editing ? " editing" : ""}`}>
      <div className="menu-management-list">
        <header className="menu-management-heading">
          <div><h1>Menu Management</h1><p>Create and manage your dishes, categories and modifiers.</p></div>
          <div className="menu-management-actions">
            <label className="menu-search"><Icon name="search" /><span className="sr-only">Search dishes</span><input type="search" placeholder="Search dishes…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <button className={status === "All" ? "menu-filter-button" : "menu-filter-button active"} type="button" aria-pressed={status !== "All"} onClick={cycleStatus}><Icon name="filter" />{status === "All" ? "Filter" : status}</button>
            {!editing && <button className="menu-add-button" type="button" onClick={() => { setEditing(emptyDish()); setIsNew(true); }}>+ Add New Dish</button>}
          </div>
        </header>

        <nav className="menu-category-tabs" aria-label="Menu categories">
          {["All Items", ...categories].map((item) => <button key={item} type="button" className={category === item ? "active" : ""} aria-current={category === item ? "page" : undefined} onClick={() => setCategory(item)}>{item}</button>)}
        </nav>

        {!editing && <section className="menu-metrics" aria-label="Menu summary">
          <article><i>◔</i><span>Total dishes<strong>{dishes.length}</strong><small>Across all categories</small></span></article>
          <article><i className="available" /><span>Available items<strong>{counts.available}</strong><small>{dishes.length ? Math.round((counts.available / dishes.length) * 100) : 0}% of all items</small></span></article>
          <article><i className="out" /><span>Out of stock<strong>{counts.out}</strong><small>Temporarily unavailable</small></span></article>
          <article><i className="unavailable" /><span>Unavailable<strong>{counts.unavailable}</strong><small>Hidden or paused</small></span></article>
          <article><i>◇</i><span>Categories<strong>{categories.length}</strong><small>Menu categories</small></span></article>
        </section>}

        <div className="menu-list-toolbar">
          <strong>{filteredDishes.length} {filteredDishes.length === 1 ? "item" : "items"}</strong>
          <div><label>Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name (A–Z)</option><option value="price-high">Price (high–low)</option><option value="price-low">Price (low–high)</option></select></label><span className="menu-view-toggle"><button type="button" className={view === "list" ? "active" : ""} aria-label="List view" onClick={() => setView("list")}><Icon name="list" /></button><button type="button" className={view === "grid" ? "active" : ""} aria-label="Grid view" onClick={() => setView("grid")}><Icon name="grid" /></button></span></div>
        </div>

        <div className="menu-dish-list" data-view={view}>
          {view === "list" && <div className="menu-dish-head"><span>Dish</span><span>Category</span><span>Price</span><span>Status</span><span>Dietary tags</span><span>Availability</span><span>Actions</span></div>}
          {paginatedDishes.map((dish) => <article key={dish.id} className={editing?.id === dish.id ? "selected" : ""}>
            <div className="menu-dish-identity"><img src={dish.image} alt="" /><span><strong>{dish.name}</strong><small>{dish.description}</small></span></div>
            <span className="menu-category-label">{dish.category}</span>
            <strong className="menu-dish-price">{money.format(dish.price)}</strong>
            <span className={`menu-status ${dish.status.toLowerCase().replaceAll(" ", "-")}`}>{dish.status}</span>
            <span className="menu-tags">{dish.tags.slice(0, 2).map((tag) => <small key={tag}>{tag}</small>)}{dish.tags.length > 2 && <small>+{dish.tags.length - 2}</small>}</span>
            <span className="menu-availability"><i className={dish.status.toLowerCase().replaceAll(" ", "-")} /><span>{dish.status === "Available" ? "Today" : dish.status}<small>{dish.status === "Available" ? `${dish.availableFrom} – ${dish.availableUntil}` : dish.status === "Out of Stock" ? "Will be back soon" : "Temporarily unavailable"}</small></span></span>
            <button className="menu-edit-button" type="button" aria-label={`Edit ${dish.name}`} onClick={() => { setEditing(dish); setIsNew(false); }}><Icon name="edit" /></button>
          </article>)}
          {filteredDishes.length === 0 && <div className="menu-empty"><strong>No dishes found</strong><p>Try another search, category or status filter.</p><button type="button" onClick={() => { setQuery(""); setCategory("All Items"); setStatus("All"); }}>Clear filters</button></div>}
        </div>
        <p className="menu-save-message" aria-live="polite">{message}</p>
        {filteredDishes.length > 0 && <nav className="menu-pagination app-pagination-footer" aria-label="Menu pagination">
          <span className="menu-pagination-summary">Showing {pageStart + 1} to {Math.min(pageStart + pageSize, filteredDishes.length)} of {filteredDishes.length} items</span>
          <div className="menu-pagination-pages">
            <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>
            {totalPages > 5 && <button className={currentPage === 1 ? "active" : ""} type="button" aria-current={currentPage === 1 ? "page" : undefined} onClick={() => setPage(1)}>1</button>}
            {totalPages > 5 && currentPage > 3 && <span aria-hidden="true">…</span>}
            {visiblePages.map((pageNumber) => <button key={pageNumber} className={currentPage === pageNumber ? "active" : ""} type="button" aria-current={currentPage === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}
            {totalPages > 5 && currentPage < totalPages - 2 && <span aria-hidden="true">…</span>}
            {totalPages > 5 && <button className={currentPage === totalPages ? "active" : ""} type="button" aria-current={currentPage === totalPages ? "page" : undefined} onClick={() => setPage(totalPages)}>{totalPages}</button>}
            <button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>›</button>
          </div>
          <label className="menu-page-size"><span>Items per page</span><select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}><option value="8">8</option><option value="10">10</option><option value="20">20</option></select></label>
        </nav>}
      </div>

      {editing && <DishEditor key={editing.id} dish={editing} isNew={isNew} menuItems={dishes} onClose={() => { setEditing(undefined); setIsNew(false); }} onSave={saveDish} />}
    </section>
  );
}
