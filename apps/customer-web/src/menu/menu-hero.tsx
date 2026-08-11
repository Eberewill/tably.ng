import { restaurant } from "./data";
import { Icon } from "./icons";

export function MenuHero() {
  return (
    <>
      <section className="restaurant-heading">
        <h1>{restaurant.name}</h1>
        <p>
          <Icon name="location" /> {restaurant.location}
          <span>·</span>
          <b>Open</b>
        </p>
      </section>
      <section className="signature-dish">
        <img
          src={restaurant.signature.image}
          alt="Smoky Party Jollof with grilled chicken and plantain"
        />
        <div className="signature-copy">
          <span>Signature</span>
          <h2>{restaurant.signature.name}</h2>
          <p>{restaurant.signature.description}</p>
        </div>
      </section>
    </>
  );
}
