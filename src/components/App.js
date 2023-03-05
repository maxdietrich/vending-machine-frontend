import React from "react";
import { notification } from 'antd';
import "../App.css";
import Login from "./Login";
import SellerView from "./SellerView";
import BuyerView from "./BuyerView";
import { backendBaseUrl } from "../config";
import Signup from "./Signup";

function App() {
  const [buyerLoggedIn, setBuyerLoggedIn] = React.useState(false);
  const [sellerLoggedIn, setSellerLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const [inSignup, setInSignup] = React.useState(false);
  const [sendNotification, notificationContextHolder] = notification.useNotification();

  const handleLogin = async () => {
    const { userId, role } = await fetch(`${backendBaseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((response) => response.json());
    if (role === "BUYER") {
      setBuyerLoggedIn(true);
    } else if (role === "SELLER") {
      setSellerLoggedIn(true);
    }
    setUserId(userId);
  };

  React.useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      handleLogin();
    }
  }, []);

  const closeSignupViewAndNotifyUserOfUserCreation = () => {
    setInSignup(false);
    setTimeout(() => {
      sendNotification['success']({
        message: 'User creation successful',
        description: 'You can now login with your credentials'
      })
    }, 1000);
  }

  const logout = () => {
    localStorage.removeItem('accessToken');
    setBuyerLoggedIn(false);
    setSellerLoggedIn(false);
  }

  return (
    <div className="App">
        { notificationContextHolder }
        {inSignup ? (
          <Signup handleSignup={closeSignupViewAndNotifyUserOfUserCreation} closeSignupView={() => setInSignup(false)} />
        ) : buyerLoggedIn ? (
          <BuyerView userId={userId} logout={logout} />
        ) : sellerLoggedIn ? (
          <SellerView userId={userId} logout={logout} />
        ) : (
          <Login handleLogin={handleLogin} setInSignup={setInSignup} />
        )}
    </div>
  );
}

export default App;
