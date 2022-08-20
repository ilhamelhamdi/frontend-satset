const ModalBox = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-black/40 flex justify-center items-center">
      <div className="container w-full mx-4 max-w-3xl rounded-xl p-8 bg-white max-h-screen overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default ModalBox