import Link from "next/link"
import Menu from "./Menu";

const NavBar = () => {
  return (
    <nav className="shadow-lg flex justify-between items-center bg-green-yellow p-5  mb-5">
      <h1 className="text-off-white text-3xl font-bold">SimplyFood</h1>
      <div className="sm:hidden">
        <Menu />
      </div>
      <ul className="mx-4 hidden sm:flex justify-center space-x-4 lg:space-x-16 xl:space-x-32 text-xl grow items-start">
        <li className="text-off-white font-bold hover:text-blue">
          <Link href="/">Home</Link>
        </li>
        <li className="text-off-white font-bold hover:text-blue">
          <Link href="/recipes">Recipes</Link>
        </li>
        <li className="text-off-white font-bold hover:text-blue">
          <Link href="/api/auth/signin">SignIn</Link>
        </li>
        <li className="text-off-white font-bold hover:text-blue">
          <Link href="/api/auth/signout">SignOut</Link>
        </li>
      </ul>
    </nav>
  );
};


export default NavBar;