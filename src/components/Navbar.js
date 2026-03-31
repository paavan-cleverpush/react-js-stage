import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main">
      <NavLink className="navbar-link" to="/" end>
        Home
      </NavLink>
      <NavLink className="navbar-link" to="/about">
        About
      </NavLink>
      <NavLink className="navbar-link" to="/contact">
        Contact Us
      </NavLink>
    </nav>
  );
}

export default Navbar;
