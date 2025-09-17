import s from './input.module.scss';


interface IInput {
  error: string | null,
  name: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const Input = (props: IInput) => {
  const {error, name, value, onChange} = props;

  return (
    <div className={s.inputWrapper} >
      <input 
        name={name}
        value={value}
        onChange={onChange}
        className={`${s.input} ${error ? s.errorInput : ''}`} 
      />
      <p className={s.errorMessage}>{error?.toUpperCase()}</p>
    </div>
  )
}

export default Input;