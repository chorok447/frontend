import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navStyle: React.CSSProperties = {
  marginBottom: 24,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const linkStyle: React.CSSProperties = {
  marginRight: 16,
  padding: '6px 12px',
  borderRadius: 6,
  textDecoration: 'none',
  color: '#222',
  fontWeight: 500,
  transition: 'background 0.2s',
};

const activeStyle: React.CSSProperties = {
  ...linkStyle,
  background: '#e3f2fd',
  color: '#1976d2',
  fontWeight: 700,
};

const menus = [
  { href: '/', label: 'Home' },
  { href: '/duties', label: 'Duty List' },
  { href: '/duties/new', label: 'Add Duty' },
  { href: '/user', label: 'User Management' },
  { href: '/schedule', label: 'Schedule' },
];

const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <nav style={navStyle} aria-label="메인 메뉴">
      <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 20, marginRight: 24 }}>Duty Scheduler</span>
      {menus.map(menu => (
        <Link
          key={menu.href}
          href={menu.href}
          style={isActive(menu.href) ? activeStyle : linkStyle}
        >
          {menu.label}
        </Link>
      ))}
    </nav>
  );
};

export default Header;