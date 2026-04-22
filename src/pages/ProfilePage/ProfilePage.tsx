import { useAppSelector } from "@/store/hooks";



const ProfilePage = () => {
  const { username, email, phoneNumber } = useAppSelector( state => state.user)

  return (
    <div>
      <p>Имя пользователя: {username}</p>
      <p>Почтовый адрес: {email}</p>
      <p>Телефон: {phoneNumber}</p>
    </div>
  )
}

export default ProfilePage;