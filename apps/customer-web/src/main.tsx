import { createRoot } from "react-dom/client";
import "@tably/ui/tokens.css";
import { RestaurantMenu } from "./menu/restaurant-menu";
import "./style.css";

createRoot(document.getElementById("root")!).render(<RestaurantMenu />);
