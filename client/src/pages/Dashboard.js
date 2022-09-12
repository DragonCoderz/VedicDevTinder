import TinderCard from 'react-tinder-card'
import {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import ChatContainer from '../components/ChatContainer'
const Dashboard = () => {



    const db = [
        {
            name: 'Richard Hendricks',
            url: 'https://i.imgur.com/Q9WPlWA.jpeg'
        },
        {
            name: 'Erlich Bachman',
            url: 'https://i.imgur.com/wDmRJPc.jpeg'
        },
        {
            name: 'Monica Hall',
            url: 'https://i.imgur.com/oPj4A8u.jpeg'
        },
        {
            name: 'Jared Dunn',
            url: 'https://i.imgur.com/dmwjVjG.jpeg'
        },
        {
            name: 'Dinesh Chugtai',
            url: 'https://i.imgur.com/MWAcQRM.jpeg'
        }
    ]

    const characters = db
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    },[])

    useEffect(() => {
        if(user) {
            getGenderedUsers()
        }
    },[user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserId = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserId.includes(genderedUser.user_id))

    return (
        <>
            {user && 
            <div className = "dashboard">
            <ChatContainer user={user}/>
                <div className = "swipe-container">
                    <div className = "card-container">
                        {characters.map((character) =>
                            <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
                                <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                                    <h3>{character.name}</h3>
                                </div>
                            </TinderCard>
                        )}
                        {/* {filteredGenderedUsers?.map((genderedUser) =>
                            <TinderCard
                                className="swipe"
                                key={genderedUser.user_id}
                                onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                                <div
                                    style={{backgroundImage: 'url(' + genderedUser.url + ')'}}
                                    className='card'>
                                    <h3>{genderedUser.first_name}</h3>
                                </div>
                            </TinderCard>
                        )} */}
                        <div className = "swipe-info">
                            {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Dashboard;
