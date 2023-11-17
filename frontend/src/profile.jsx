import React, { useEffect, useState } from 'react';
import './profile.css';
import ProfileIcon from './assets/user.png';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const userId = sessionStorage.getItem('user');
            try {
                const response = await axios.get(`http://localhost:5000/profile/${userId}`);
                setProfileData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };
        fetchProfileData();
    }, []);

    const lastLogin = profileData.length > 0 ? profileData[profileData.length - 1].login_time : 'N/A';
    const lastLoginSplit = lastLogin !== 'N/A' ? lastLogin.split(' ') : ['N/A', 'N/A'];
    const userName = profileData.length > 0 ? profileData[0].name : 'N/A';
    const userEmail = profileData.length > 0 ? profileData[0].email : 'N/A';

    // Helper function to convert 24-hour time to 12-hour time
    const convertTo12Hour = (time24) => {
        if (time24 === "N/A") {
            return time24;
        }
        const [hours, minutes] = time24.split(':');
        return ((hours % 12 || 12) + ':' + minutes + ' ' + (hours >= 12 ? 'PM' : 'AM'));
    }

    return(
        <div className="ProfileContainer">
            <div className="ProfileFlexBox">
                <div className="Left">
                    <img className="ProfileIcon" src={ProfileIcon}/>
                    <h1>{userName}</h1>
                    <h4>{userEmail}</h4>
                    <div className="Spacer"></div>
                    <h3>Last Logged In:</h3>
                    <p><strong>Date:</strong> {lastLoginSplit[0]}</p>
                    <p><strong>Time:</strong> {convertTo12Hour(lastLoginSplit[1])}</p>
                </div>
                <div className="Right">
                    <div className="Spacer"></div>
                    <h1>Login History</h1>
                    <div className="Spacer"></div>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Login Date</th>
                                <th>Login Time</th>
                                <th>Logout Date</th>
                                <th>Logout Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profileData.map((session, index) => {
                                const loginDateTime = session.login_time.split(" ");
                                const logoutDateTime = session.logout_time ? session.logout_time.split(" ") : ['N/A', 'N/A'];
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{loginDateTime[0]}</td>
                                        <td>{convertTo12Hour(loginDateTime[1])}</td>
                                        <td>{logoutDateTime[0]}</td>
                                        <td>{convertTo12Hour(logoutDateTime[1])}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Profile;