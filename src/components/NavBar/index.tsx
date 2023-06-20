import Link from "next/link"
import Image from "next/image";
import Menu from "./Menu"
import { useSession } from "next-auth/react"
import ProfileButton from "../ProfileButton";

const NavBar = () => {
  const { data: session } = useSession()

  return (
    <nav className="shadow-lg flex justify-between items-center bg-green-yellow p-5  mb-5">
      <h1 className="text-off-white text-3xl font-bold">SimplyFood</h1>
      <div className="sm:hidden">
        <Menu />
      </div>
      <ul className="ml-4 mr-20 hidden sm:flex justify-end space-x-4 lg:space-x-16 xl:space-x-32 text-xl grow items-center">
        <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
          <Link href="/">Home</Link>
        </li>
        <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
          <Link href="/recipes">Recipes</Link>
        </li>
        {
          session ?
            <ProfileButton session={session}/>
            :
            <li className="text-off-white font-bold hover:text-cyan-400 transition-color">
              <Link href="/api/auth/signin">SignIn</Link>
            </li>
        }
      </ul>
    </nav>
  );
};


export default NavBar;