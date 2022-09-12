import logo from "../images/tinder_logo_white.png"
import colorLogo from "../images/color-logo-tinder.png"

const Nav = ({minimal, setShowModal, showModal, setIsSignUp}) => {

    const authToken = true;

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    return (
        <nav>
            <div className="logo-container">
                <img className = "logo" src={minimal ? colorLogo : logo} alt="Tinder"/>
            </div>
            {!authToken && !minimal && <button
                className="nav-button" onClick = {handleClick} disabled={showModal}>
                Log in</button>}
        </nav>
    )
}

export default Nav;
