import './profile.css';
import ProfileIcon from './assets/user.png';

const Profile = () => {
    return(
        <div className="ProfileContainer">
            <div className="ProfileFlexBox">
                <div className="Left">
                    <img className="ProfileIcon" src={ProfileIcon}/>
                    <h1>Username</h1>
                    <div className="Spacer">

                    </div>
                    <h3>Email:</h3>
                    <h3>Last Logged In: </h3>
                </div>
                <div className="Right">
                <div className="Spacer"></div>
                <h1>Login History</h1>
                <div className="Spacer"></div>
                <table>
                    <tr>
                    <th>First Name</th>
                    <th>Login Date</th>
                    <th>Logout Date</th>
                    </tr>
                    <tr>
                        <td>John</td>
                        <td>2021-10-12</td>
                        <td>2021-10-12</td>
                    </tr>
                    <tr>
                        <td>Mary</td>
                        <td>2021-10-12</td>
                        <td>2021-10-12</td>
                    </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Profile;