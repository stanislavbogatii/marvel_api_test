import img from './error.gif'

const ErrorMessage = () => {
    return (
        <img src={img} alt="Error" 
        style={{ display: 'block', width: "250px", height: "250px", margin: "0 auto", objectFit: "contain"}}
        />
    )
}

export default ErrorMessage