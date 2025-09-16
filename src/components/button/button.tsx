import s from './button.module.scss';

interface IButton {
  text: string,
  type?: "button" | "submit" | "reset",
}

const Button = (props: IButton) => {
  const { text, type="button" } = props;

  return (
    <button className={s.button} type={type}>
      {text}
    </button>
  )
}

export default Button;