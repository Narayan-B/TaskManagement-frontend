import { useAuth } from "../context/AuthContext"
export default function Account(){
    const {user}=useAuth()
    console.log(user)
    return(
        <div>
            <h1>Account page</h1>
            {user &&
            <>
            <h3>username-{user.username}</h3>
            <h3>Email-{user.email}</h3>
            <h3>Role-{user.role}</h3>
            </>
            
            }
            

        </div>
    )
}