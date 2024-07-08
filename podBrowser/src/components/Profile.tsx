import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { getUser } from "../solid/solidProfile";
import { User } from "../model/user";
import { getFriends } from "../solid/solidFriends";
import logo from "../resources/icon.png";
import { CircularProgress, Divider, Typography } from "@mui/material";

export default function Profile(): JSX.Element {
  
  const { session } = useSession();
  const [profile, setProfile] = useState<JSX.Element>(<CircularProgress className="circularProgress"/>);
  const [friends, setFriends] = useState<JSX.Element>(<CircularProgress className="circularProgress"/>);

  useEffect(() => {
    getUser(session).then((user) => {
      setProfile(ProfileData(user));
    }).catch((error) => {
      setProfile(<Typography variant="h6" color="error">Error al cargar el perfil</Typography>);
    });

    getFriends(session).then((friends) => {
      setFriends(Friends(friends));
    }).catch((error) => {
      setProfile(<Typography variant="h6" color="error">Error al cargar los amigos</Typography>);
    });;
  }, [session]);

  return (
    <div className="profile">
      {profile}
      {friends}
    </div>
  );
}

function ProfileData(user: User) {
  return (
    <div className="profileData">
      <Typography variant="h3">Perfil</Typography>
      <Typography variant="h4">{user.getUsername()}</Typography>
      <img src={user.getPhoto() || logo} alt="Profile" className="profilePhoto"/>
      <Typography variant="h6">{`WebId: ${user.getWebId()}`}</Typography>
      {user.getOrganization() !== null ? <Typography variant="h6">{`Organization: ${user.getOrganization()}`}</Typography>: null}
      {user.getRole() !== null ? <Typography variant="h6">{`Role: ${user.getRole()}`}</Typography>: null}
      {user.getPhone() !== null ? <Typography variant="h6">{`Phone: ${user.getPhone()}`}</Typography>: null}
      {user.getEmail() !== null ? <Typography variant="h6">{`Email: ${user.getEmail()}`}</Typography>: null}
      {user.getBirthDate() !== null ? <Typography variant="h6">{`Birth Date: ${user.getBirthDate()?.toDateString()}`}</Typography>: null}
      {user.getNotes() !== null ? <Typography variant="h6">{`Notes: ${user.getNotes()}`}</Typography>: null}
    </div>
  );
}

function Friends(friends: User[]) {
  return (
    <div className="friendsData">
      <h1>Amigos</h1>
      {friends.map((friend) => (
        <div>
          <div className="friend">
            <img src={friend.getPhoto() || logo} alt="Profile" className="friendPhoto" />
            <div>
              <p>{friend.getUsername()}</p>
              <p>WebId: {friend.getWebId()}</p>
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </div>
  );
}