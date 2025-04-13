import {useState} from 'react';
import "./friends.css";
import { addFriend, getFriends } from "../../utils/databaseCalls";
import { useNavigate } from "react-router-dom";



function friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[] | null>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");

  useState(() => {

    const fetchFriends = async () => {

      try{
        const response: any = await getFriends();
        console.log("response is: ",response);
        if (response.status === 200) {
          console.log("response.data is: ",response.data);
          setFriends(response.data);
        }
        else {
          setFriends(null);
        }
      }
      catch (error) {
        console.error("Error fetching friends:", error);
      }
    }
    fetchFriends();
  }),[];

  function handleProfileNavigation(userId:string | undefined): void {
    if (!userId) return;
    navigate('/profile', { state: { userId }})
}


const handleAddFriend = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault(); // Prevent the default form submission behavior
  
    const inputElement = document.getElementById("friendusernameinput") as HTMLInputElement;
    const friendusername = inputElement.value // Get the value from the input field
  
    if (!friendusername) {
      console.error("Watchlist name cannot be empty");
      return;
    }
    else{
      const response: any = await addFriend(friendusername);
      console.log(response);
      if (response.status === 200) {
      
        setSuccess("Friend added successfully!"); // Set success message
        setErrorMessage(null); // Clear error message
      }
      else {
        console.error("Failed to add friend:", response);
        setErrorMessage("Failed to add friend. username does not exist"); // Set error message
        setSuccess(null); // Clear success message
      }
    }
    } catch (error) {
      console.error("Error adding friend: ", error);
      setErrorMessage("Failed to add friend, please try again"); // Set error message
    } 
}

  return (
    <div className="friendscontainer">
      <u>
      <h1>Friends</h1>
      </u>
    <div className='friendspage'>
      
      <div className='friendslist'>
      {friends && friends.length > 0 ?  (
        friends.map((friend: Friend) => (
          <button className='friend' key={friend.userId}  onClick={() => handleProfileNavigation(friend.userId)}>
            <h3>{friend.username }</h3>
            
          </button>
        ))) : (<p style={{alignItems: 'center'}}>No friends found.</p>)}
      </div>


      <div className="addfriendblock">
          <form className="addfriend"  onSubmit={(e) => handleAddFriend(e) }>
            <input type="text" id="friendusernameinput" placeholder="Enter friend's username here"/>
            
          <button className="addfriendbutton" type="submit">
            Add Friend
          </button>
          </form>
          {errorMessage && (
        <p className="error-message" style={{ color: "red", marginTop: "5px" }}>
        {errorMessage}
          </p>
        ) || success && (
          <p className="success-message" style={{ color: "green", marginTop: "5px" }}>
          {success}
          </p>
        )}
      </div>
    </div>
    </div>
  )
}

export default friends