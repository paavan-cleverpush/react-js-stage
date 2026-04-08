import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const TOP_NAV = [
  { to: '/', id: 'home', label: 'Home', match: 'home' },
  { to: '/catalog', id: 'catalog', label: 'All products', match: 'catalog-all' },
  {
    to: '/catalog?category=Electronics',
    id: 'elec',
    label: 'Electronics',
    match: 'elec',
  },
  {
    to: '/catalog?category=Fashion',
    id: 'fash',
    label: 'Fashion',
    match: 'fash',
  },
  {
    to: '/catalog?category=Home',
    id: 'homecat',
    label: 'Home & Kitchen',
    match: 'homecat',
  },
  {
    to: '/catalog?category=Sports',
    id: 'sport',
    label: 'Sports',
    match: 'sport',
  },
];

function activeMatch(location) {
  const { pathname, search } = location;
  const q = new URLSearchParams(search);
  const cat = q.get('category') || '';

  if (pathname === '/') return 'home';
  if (pathname.startsWith('/product/')) return null;
  if (pathname === '/catalog') {
    if (cat === 'Electronics') return 'elec';
    if (cat === 'Fashion') return 'fash';
    if (cat === 'Home') return 'homecat';
    if (cat === 'Sports') return 'sport';
    return 'catalog-all';
  }
  return null;
}

function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const { cartCount } = useCart();
  const current = activeMatch(location);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    const el = searchInputRef.current;
    if (el && document.activeElement !== el) el.value = q;
  }, [location.pathname, location.search]);

  function onSearch(e) {
    e.preventDefault();
    const q = (searchInputRef.current?.value || '').trim();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    navigate('/catalog' + (params.toString() ? `?${params}` : ''));
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-inner wrap">
          <span className="top-bar-msg">
            Ships to <strong>Germany &amp; EU</strong> · Free delivery from €29
          </span>
          <span className="top-bar-msg">
            <Link to="/shipping">Shipping</Link> · <Link to="/returns">Returns</Link>{' '}
            · <Link to="/contact">Help</Link>
          </span>
        </div>
      </div>
      <div className="main-header wrap">
        <Link to="/" className="logo">
          <span className="logo-mark">P</span>
          <span className="logo-text">aavan</span>
        </Link>
        <form className="search-bar" role="search" onSubmit={onSearch}>
          <input
            ref={searchInputRef}
            type="search"
            name="q"
            placeholder="Search fashion, electronics, home…"
            aria-label="Search products"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
        <div className="header-actions">
          <Link to="/cart" className="cart-link" aria-label="Shopping cart">
            <span className="cart-icon" aria-hidden="true">
              🛒
            </span>{' '}
            <span>Cart</span>
            {cartCount > 0 ? (
              <span className="cart-badge">{cartCount}</span>
            ) : null}
          </Link>
        </div>
      </div>
      <nav className="category-nav wrap" aria-label="Product categories">
        {TOP_NAV.map((item) => {
          const isActive = current === item.match;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={'nav-cat' + (isActive ? ' is-active' : '')}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default SiteHeader;
