import Nav from '../components/Nav'
const Home = () => {
    const authToken = true;
    const handleClick = () => {
        console.log("clicked")
    }
    return (
        <>
        <Nav minimal = {true}/>
        <div className = "home">
            <h1 className="primary-title">Swipe Right®</h1>
            <button className="primary-button" onClick={handleClick}>
                {authToken ? 'Signout' : 'Create Account'}
            </button>
        </div>
        </>
    )
}

export default Home;
