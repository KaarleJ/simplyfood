import Link from 'next/link';
import { useState } from 'react';
import { Menu as MenuIcon } from '@styled-icons/entypo';

const Menu = () => {
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
        <li className="hover:text-cyan-400 transition-color">
          <Link href="/api/auth/signin" onClick={() => setExpand(false)}>
            SignIn
          </Link>
        </li>
        <li className="hover:text-cyan-400 transition-color">
          <Link href="/api/auth/signout" onClick={() => setExpand(false)}>
            SignOut
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
