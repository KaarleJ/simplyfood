import Link from 'next/link';
import Menu from './Menu';
import { useSession } from 'next-auth/react';
import ProfileButton from '../ProfileButton';
import { Create } from '@styled-icons/ionicons-solid';

// This components acts as the navbar for the entire app. It renders the MenuIcon if the screen is small. Otherwise, it renders a list of links.
const NavBar = () => {
  const { data: session } = useSession();

  return (
    <nav data-testid='navbar' className="shadow-lg flex justify-between items-center bg-green-yellow p-5  mb-5">
      <h1 className="text-off-white text-3xl font-bold">SimplyFood</h1>

      <div data-testid="mobile-navbar" className="sm:hidden">
        <Menu session={session} />
      </div>

      <ul data-testid="desktop-navbar" className="ml-4 mr-20 hidden sm:flex justify-end space-x-4 lg:space-x-16 xl:space-x-32 text-xl grow items-center">
        <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
          <Link href="/">Home</Link>
        </li>
        <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
          <Link href="/recipes">Recipes</Link>
        </li>

        {session ? (
          <>
            <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
              <Link data-testid='create-button' href="/create">
                <Create size="36" />
              </Link>
            </li>
            <ProfileButton session={session} />
          </>
        ) : (
          <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
            <Link href="/api/auth/signin">SignIn</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
