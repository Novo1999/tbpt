import './loader.css'
const loading = () => {
  return (
    <div className="min-h-[90vh] flex justify-center items-center">
      <div className="loader">
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__ball"></div>
      </div>
    </div>
  )
}
export default loading
