import { useState, useEffect } from "react";
import type { Profile } from "@/types/types";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { openNotification } from "@/utils/errors";
import { getUserProfile } from "@/api/api";


const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<Profile | undefined>({} as Profile | undefined)
  const dispatch = useAppDispatch();
  
  const fetchAndSetUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      dispatch(setUser(profile));
      setUserProfile(profile);
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: 'User Profile is failed'
        })
      }
    }
  }

  useEffect(() => {
    fetchAndSetUserProfile();
  },[]);

  return (
    <div>
      <p>Имя пользователя: {userProfile?.username}</p>
      <p>Почтовый адрес: {userProfile?.email}</p>
      <p>Телефон: {userProfile?.phoneNumber}</p>

    </div>
  )
}

export default ProfilePage;