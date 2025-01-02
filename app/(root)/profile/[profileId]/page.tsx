import { auth } from "@/auth";
import ProfileArea from "@/components/ProfileArea";
import axios from "axios"
import Image from "next/image";



async function fetchUser(profileId: string) {
  try {
    const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      params: { profileId }
    });

    if (!user) return "User not Found"

    return user.data?.user
  } catch (err) {
    console.log(err);

  }
}

interface User {
  fullName: string,
  mobileNumber: string,
  dateOfBirth: string,
  email: string
}



export default async function Profile({ params }: { params: any }) {
  const { profileId } = await params;
  const session = await auth()

  const user: User = await fetchUser(profileId);
  const dob = user?.dateOfBirth.slice(0, 10);



  return (
    <div className="w-full lg:px-60 py-7 flex items-center justify-center ">
      <form className="shadow-lg  w-max rounded-lg flex flex-col items-center justify-center gap-5 text-2xl p-7">
        <div className="rounded-full h-20 w-20 border text-2xl  text-center bg-white-100 flex items-center justify-center">
          {
            session?.user?.image ? <Image src={session?.user?.image} alt="logo" height={100} width={100} className="rounded-full" /> : user?.fullName.slice(0, 1).toUpperCase()
          }
        </div>
        <div className="text-3xl rounded px-2 shadow-300">
          <label className="font-bold">Name  : </label>
          <input type="text" value={user?.fullName.toUpperCase() || "N/A"} className="px-4 py-2 outline-none rounded-lg text-2xl " disabled />
        </div>
        <div className="text-3xl rounded px-2 shadow-200">
          <label className="font-bold">Email : </label>
          <input type="text" value={user?.email || "N/A"} className="px-4 py-2 outline-none rounded-lg text-2xl " disabled />
        </div>
        <div className="text-3xl rounded px-2 shadow-300">
          <label className="font-bold">D.O.B  : </label>
          <input type="text" value={dob || "N/A"} className="px-4 py-2 outline-none rounded-lg text-2xl" disabled />
        </div>
        <div className="text-3xl rounded px-2 shadow-200">
          <label className="font-bold">Phone  : </label>
          <input type="text" value={user?.mobileNumber || "N/A"} className="px-4 py-2 outline-none rounded-lg text-2xl " disabled />
        </div>
        <ProfileArea email={user?.email} />
      </form>

    </div>
  )
}