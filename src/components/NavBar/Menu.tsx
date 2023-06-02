import Link from 'next/link';
import { useState } from 'react';

const Menu = () => {
  const [expand, setExpand] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-off-white font-bold text-xl transition delay-150 duration-300 ease-in-out"
        onClick={() => setExpand(!expand)}
      >
        Menu
      </button>
      <ul
        className={`shadow-2xl absolute text-dark-gray right-0 transition-all duration-300 ease-in-out ${
          expand ? 'h-auto opacity-100' : 'h-0 opacity-0'
        } overflow-hidden bg-light-gray rounded p-1`}
      >
        <li className="hover:text-blue">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-blue">
          <Link href="/recipes">Recipes</Link>
        </li>
        <li className="hover:text-blue">
          <Link href="/api/auth/signin">SignIn</Link>
        </li>
        <li className="hover:text-blue">
          <Link href="/api/auth/signout">SignOut</Link>
        </li>
      </ul>
    </div>
  );
};


export default Menu