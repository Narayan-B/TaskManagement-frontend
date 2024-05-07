import { useAuth } from "../context/AuthContext"
export default function Home(){
    const {user}=useAuth()
    console.log(user)
    return (
        <div>
            <h1>Home Component</h1>
            {!user ?<p>user not logged in</p>:<p>Welcome-{user.username}</p>}
        </div>
    )
}