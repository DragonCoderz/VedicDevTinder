import logo from "../images/tinder_logo_white.png"
import colorLogo from "../images/color-logo-tinder.png"

const Nav = ({minimal}) => {


    return (
        <nav>
            <div className="logo-container">
                <img className = "logo" src={minimal ? colorLogo : logo}/>
            </div>
        </nav>
    )
}

export default Nav;
