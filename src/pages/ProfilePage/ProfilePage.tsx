import { useAppSelector } from "@/store/hooks";
import s from './ProfilePage.module.scss';


const ProfilePage = () => {
  const { username, email, phoneNumber } = useAppSelector( state => state.user)

  return (
    <div className={s.profilePage}>
      <h1 className={s.h1}> Профиль </h1>
      <section className={s.section}>
        <p>Имя пользователя: {username}</p>
        <p>Почтовый адрес: {email}</p>
        <p>Телефон: {phoneNumber}</p>
      </section>

    </div>
  )
}

export default ProfilePage;