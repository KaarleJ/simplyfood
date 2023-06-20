import Image from "next/image"
import Link from 'next/link'
import { useState } from 'react'
import { Session } from "next-auth"

interface PropTypes {
  session: Session
}

const ProfileButton = ({ session }: PropTypes) => {
  const [expand, setExpand] = useState(false)

  return (
    <div className="relative z-20">
      <button
        onClick={() => setExpand(!expand)}
        className="hover:brightness-75"
      >
        <Image
          src={session.user?.image as string}
          width={100}
          height={50}
          alt='profile picture'
          className="object-cover w-10 h-10 rounded-full" />
      </button>
      <ul
        className={`shadow-2xl absolute text-stone-700 right-0 transition-opacity ${expand ? 'opacity-100' : 'opacity-0'
          } overflow-hidden bg-stone-100 rounded p-2`}
      >
        <li
          className="hover:text-cyan-400 transition-color"
        >
          <Link
            href="/"
            onClick={() => setExpand(false)}
          >
            Profile
          </Link>
        </li>
        <li 
          className="hover:text-cyan-400 transition-color"
        >
          <Link 
            href="/api/auth/signout" 
            onClick={() => setExpand(false)}
          >
            SignOut
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default ProfileButton