import s from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode,
  type?: "button" | "submit" | "reset",
  onClick?: () => void,
}

const Button = (props: ButtonProps) => {
  const { type="button", onClick, children } = props;

  return (
    <button 
      className={s.button} 
      type={type} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;