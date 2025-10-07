import s from './button.module.scss';

interface ButtonProps {
  text: string,
  type?: "button" | "submit" | "reset",
  onClick?: () => void,
}

const Button = (props: ButtonProps) => { //children
  const { text, type="button", onClick } = props;

  return (
    <button className={s.button} type={type} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button;