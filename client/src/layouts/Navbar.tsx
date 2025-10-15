import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <NavLink to="/">Home</NavLink>
      <br />
      <NavLink to="/dashboard">Dashboard</NavLink>
      <br />
      <NavLink to="/marketplace">Marketplace</NavLink>
    </>
  );
}
