import Link from 'next/link';
import { useState } from 'react';
import {Menu as MenuIcon} from '@styled-icons/entypo'


const Menu = () => {
  const [expand, setExpand] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-off-white font-bold text-xl hover:text-blue transition-color"
        onClick={() => setExpand(!expand)}
      >
        <MenuIcon className='h-10'/>
      </button>
      <ul
        className={`shadow-2xl absolute text-dark-gray right-0 transition-all duration-400 ${
          expand ? 'h-auto opacity-100' : 'h-0 opacity-0'
        } overflow-hidden bg-light-gray rounded p-1`}
      >
        <li className="hover:text-blue transition-color">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-blue transition-color">
          <Link href="/recipes">Recipes</Link>
        </li>
        <li className="hover:text-blue transition-color">
          <Link href="/api/auth/signin">SignIn</Link>
        </li>
        <li className="hover:text-blue transition-color">
          <Link href="/api/auth/signout">SignOut</Link>
        </li>
      </ul>
    </div>
  );
};


export default Menu