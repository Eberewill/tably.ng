import type { SVGProps } from "react";

type IconName =
  | "account"
  | "arrowLeft"
  | "bag"
  | "cart"
  | "check"
  | "clear"
  | "cutlery"
  | "download"
  | "location"
  | "menu"
  | "orders"
  | "search"
  | "water"
  | "waiter";

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths = {
    arrowLeft: <path d="m14.5 5-7 7 7 7M8 12h11" />,
    check: <path d="m7 12 3.2 3.2L17.5 8" />,
    clear: (
      <>
        <path d="M5 18.5h14M7.5 15.5h9M9.5 12.5h5" />
        <path d="m6 8 1.5-2.5h9L18 8" />
      </>
    ),
    cutlery: (
      <>
        <path d="M7 4v7M4.5 4v4.5A2.5 2.5 0 0 0 7 11h0a2.5 2.5 0 0 0 2.5-2.5V4M7 11v9" />
        <path d="M16.5 4v16M13.5 4v6h3" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v11" />
        <path d="m8 11 4 4 4-4M5 20h14" />
      </>
    ),
    account: (
      <>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 20c.8-3.1 3-4.7 6.5-4.7s5.7 1.6 6.5 4.7" />
      </>
    ),
    bag: (
      <>
        <path d="M5.5 8.5h13l-1 12h-11z" />
        <path d="M9 9V6.75a3 3 0 0 1 6 0V9" />
      </>
    ),
    cart: (
      <>
        <path d="M3.5 4.5h2l1.9 10.1h9.8l2-7H7.1" />
        <circle cx="9" cy="19.5" r="1" />
        <circle cx="17" cy="19.5" r="1" />
      </>
    ),
    location: (
      <>
        <path d="M18.5 10c0 4.5-6.5 9.5-6.5 9.5S5.5 14.5 5.5 10a6.5 6.5 0 1 1 13 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    menu: (
      <>
        <path d="M5 5.5h14v13H5z" />
        <path d="M8 9h8M8 12h8M8 15h5" />
      </>
    ),
    orders: (
      <>
        <path d="M6 4.5h12v15H6z" />
        <path d="M9 8h6M9 11h6M9 14h4" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 4 4" />
      </>
    ),
    waiter: (
      <>
        <path d="M4.5 17.5h15M6.5 17.5a5.5 5.5 0 0 1 11 0M12 5.5v3M8.5 8.5h7" />
      </>
    ),
    water: (
      <path d="M12 3.5S6.5 10 6.5 14a5.5 5.5 0 0 0 11 0c0-4-5.5-10.5-5.5-10.5Z" />
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
