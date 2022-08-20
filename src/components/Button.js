const Button = ({ children, onClick = () => { }, className }) => {
  return (
    <div
      onClick={onClick}
      className={" py-2 px-4 inline-block rounded-lg text-teal-700 border-solid border-2 border-teal-700 hover:bg-teal-700 hover:text-white transition cursor-pointer text-center " + className}
    >
      {children}
    </div>
  )
}

export default Button