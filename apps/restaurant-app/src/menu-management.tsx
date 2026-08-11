import { useEffect, useMemo, useState, type FormEvent } from "react";
import "./menu-management.css";

type DishStatus = "Available" | "Out of Stock" | "Unavailable";
type DishType = "Single" | "Combo" | "Add-on";

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
  requiresBase: boolean;
  baseOptions: string;
  proteinOptions: string;
  ingredients: string;
  showOnMenu: boolean;
  featured: boolean;
};

const categories = ["Starters", "Mains", "Sides", "Soups", "Drinks", "Desserts"];
const dietaryTags = ["Spicy", "High Protein", "Gluten Free", "Vegetarian", "Vegan"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  requiresBase: false,
  baseOptions: "",
  proteinOptions: "",
  ingredients: "",
  showOnMenu: true,
  featured: false,
};

const initialDishes: Dish[] = [
  { id: "egusi-soup", name: "Egusi Soup", description: "Melon seeds, spinach and assorted meat cooked in a rich broth.", category: "Soups", price: 5500, status: "Available", tags: ["Spicy", "High Protein"], image: images.okra, ...defaults, requiresBase: true, baseOptions: "Pounded Yam, Eba, Semo", proteinOptions: "Goat Meat, Beef, Chicken", ingredients: "Melon Seeds, Spinach, Palm Oil, Beef, Crayfish, Seasoning, Onions" },
  { id: "jollof-rice", name: "Jollof Rice", description: "Nigerian party jollof rice with smoked pepper and herbs.", category: "Mains", price: 4000, status: "Available", tags: ["Gluten Free"], image: images.jollof, ...defaults },
  { id: "grilled-catfish", name: "Grilled Catfish", description: "Charcoal-grilled catfish served with plantain.", category: "Mains", price: 6500, status: "Available", tags: ["High Protein", "Gluten Free"], image: images.ribeye, ...defaults },
  { id: "fried-rice", name: "Fried Rice", description: "Mixed vegetables, aromatics and warming spices.", category: "Mains", price: 3800, status: "Available", tags: ["Vegetarian"], image: images.jollof, ...defaults },
  { id: "peppered-gizzard", name: "Peppered Gizzard", description: "Spicy sautéed gizzard with sweet peppers.", category: "Starters", price: 3500, status: "Out of Stock", tags: ["Spicy", "High Protein"], image: images.snails, ...defaults },
  { id: "moi-moi", name: "Moi Moi", description: "Steamed bean pudding with pepper and aromatics.", category: "Sides", price: 1500, status: "Available", tags: ["Vegetarian"], image: images.okra, ...defaults },
  { id: "pounded-yam", name: "Pounded Yam", description: "Soft and smooth pounded yam.", category: "Sides", price: 1200, status: "Available", tags: [], image: images.jollof, ...defaults },
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
    return Array.isArray(parsed) && parsed.every((dish) =>
      dish && typeof dish === "object" &&
      typeof dish.name === "string" &&
      typeof dish.price === "number" &&
      Array.isArray(dish.tags) &&
      Array.isArray(dish.days)
    ) ? parsed as Dish[] : initialDishes;
  } catch {
    return initialDishes;
  }
}

function DishEditor({ dish, isNew, onClose, onSave }: {
  dish: Dish;
  isNew: boolean;
  onClose: () => void;
  onSave: (dish: Dish) => void;
}) {
  const [draft, setDraft] = useState(dish);
  const [error, setError] = useState("");
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (previewing) setPreviewing(false);
      else onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, previewing]);

  function update<K extends keyof Dish>(key: K, value: Dish[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.category || draft.price <= 0) {
      setError("Add a dish name, category and valid price before saving.");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), description: draft.description.trim() });
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
              {(["Single", "Combo", "Add-on"] as DishType[]).map((type) => <label key={type}><input type="radio" name="dish-type" checked={draft.dishType === type} onChange={() => update("dishType", type)} /><span><strong>{type}</strong><small>{type === "Single" ? "Regular dish" : type === "Combo" ? "Dish with sides" : "Extra to a main dish"}</small></span></label>)}
            </div>
          </fieldset>

          <fieldset>
            <legend>Customisation</legend>
            <label className="dish-switch-line"><span><strong>Requires base selection</strong><small>Guests must choose a base for this dish.</small></span><input type="checkbox" checked={draft.requiresBase} onChange={(event) => update("requiresBase", event.target.checked)} /></label>
            {draft.requiresBase && <div className="dish-field-grid"><label><span>Base options</span><input value={draft.baseOptions} onChange={(event) => update("baseOptions", event.target.value)} placeholder="Pounded Yam, Eba, Semo" /><small>Separate options with commas.</small></label><label><span>Protein options</span><input value={draft.proteinOptions} onChange={(event) => update("proteinOptions", event.target.value)} placeholder="Goat Meat, Beef, Chicken" /><small>Separate options with commas.</small></label></div>}
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
    setMessage(`${dish.name} ${isNew ? "was added" : "was updated"}.`);
  }

  return (
    <section className={`menu-management${editing ? " editing" : ""}`}>
      <div className="menu-management-list">
        <header className="menu-management-heading">
          <div><h1>Menu Management</h1><p>Create and manage your dishes, categories and modifiers.</p></div>
          <div className="menu-management-actions">
            <label><Icon name="search" /><span className="sr-only">Search dishes</span><input type="search" placeholder="Search dishes…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <button type="button" onClick={cycleStatus}><Icon name="filter" />{status === "All" ? "Filters" : status}</button>
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
          <div><label>Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name (A–Z)</option><option value="price-high">Price (high–low)</option><option value="price-low">Price (low–high)</option></select></label><span><button type="button" className={view === "list" ? "active" : ""} aria-label="List view" onClick={() => setView("list")}><Icon name="list" /></button><button type="button" className={view === "grid" ? "active" : ""} aria-label="Grid view" onClick={() => setView("grid")}><Icon name="grid" /></button></span></div>
        </div>

        <div className="menu-dish-list" data-view={view}>
          {view === "list" && <div className="menu-dish-head"><span>Dish</span><span>Category</span><span>Price</span><span>Status</span><span>Dietary tags</span><span>Availability</span><span>Actions</span></div>}
          {filteredDishes.map((dish) => <article key={dish.id} className={editing?.id === dish.id ? "selected" : ""}>
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
      </div>

      {editing && <DishEditor key={editing.id} dish={editing} isNew={isNew} onClose={() => { setEditing(undefined); setIsNew(false); }} onSave={saveDish} />}
    </section>
  );
}
