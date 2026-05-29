import { Outlet } from 'react-router';
import skelet from '../../assets/images/skelet.png';
import s from './LayoutAuth.module.scss';

const LayoutAuth = () => {
  return (
    <div className={s.auth}>
      <div className={s.imageWrapper}>
        <img
          className={s.image}
          src={skelet}
          alt='skelet'
         />
      </div>
      <Outlet />
    </div>
  )
}

export default LayoutAuth;