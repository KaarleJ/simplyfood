import Link from 'next/link';
import { useState } from 'react';
import { Menu as MenuIcon } from '@styled-icons/entypo';
import { Session } from 'next-auth';

interface MenuProps {
  session: Session | null;
}

// This component will be rendered in NavBar if the screen is small.
// It renders a list of links that are hidden by default. When the user clicks the MenuIcon, the list of links will be displayed.
const Menu = ({ session }: MenuProps) => {
  const [expand, setExpand] = useState(false);

  return (
    <div className="relative z-20">
      <button
        className="text-off-white font-bold text-xl hover:text-cyan-400 transition-color"
        onClick={() => setExpand(!expand)}
      >
        <MenuIcon className="h-10" />
      </button>
      <ul
        className={`shadow-2xl absolute text-stone-700 right-0 transition-opacity ${
          expand ? 'opacity-100' : 'opacity-0'
        } overflow-hidden bg-stone-100 rounded p-2`}
      >
        <li className="hover:text-cyan-400 transition-color">
          <Link href="/" onClick={() => setExpand(false)}>
            Home
          </Link>
        </li>
        <li className="hover:text-cyan-400 transition-color">
          <Link href="/recipes" onClick={() => setExpand(false)}>
            Recipes
          </Link>
        </li>
        {session ? (
          <>
            <li className="hover:text-cyan-400 transition-color">
              <Link href="/profile" onClick={() => setExpand(false)}>
                Profile
              </Link>
            </li>
            <li className="hover:text-cyan-400 transition-color">
              <Link href="/create" onClick={() => setExpand(false)}>
                Create
              </Link>
            </li>
            <li className="hover:text-cyan-400 transition-color">
              <Link href="/api/auth/signout" onClick={() => setExpand(false)}>
                SignOut
              </Link>
            </li>
          </>
        ) : (
          <li className="hover:text-cyan-400 transition-color">
            <Link href="/api/auth/signin" onClick={() => setExpand(false)}>
              SignIn
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
