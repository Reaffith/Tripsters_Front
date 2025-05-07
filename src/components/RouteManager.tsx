import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import { Home } from "./home/Home";
import { TripsPage } from "./TripsPage/TripsPage";
import { CreateTrip } from "./CreateTrip/CreateTrip";
import { TripDetails } from "./TripDetails/TripDetails";
import { RegisterPage } from "./RegisterPage/RegisterPage";
import { LoginPage } from "./RegisterPage/LoginPage";
import { ProfilePage } from "./ProfilePage/ProfilePage";
import { FriendList } from "./FriendList/FriendList";
import { MapComponent } from "./TripDetails/MapComponent/MapComponent";
import { ChatComponent } from "./TripDetails/ChatComponent/ChatComponent";
import { MessagePage } from "./TripDetails/ChatComponent/MessagePage/MessagePage";
import { VotePage } from "./TripDetails/ChatComponent/VotePage/VotePage";

export const RouteManager = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="home" element={<Navigate to="/" />}></Route>
          <Route index element={<Home />} />
          <Route path="trips" element={<TripsPage />}></Route>
          <Route path="trips/create" element={<CreateTrip />}></Route>
          <Route path="tripDetails/:id/" element={<TripDetails/>}>
            <Route path="map" element={<MapComponent/>} />
            <Route path="chat/" element={<ChatComponent/>} >
              <Route index element={<Navigate to='messages' />} />
              <Route path="messages" element={<MessagePage/>} />
              <Route path="votes" element={<VotePage/>} />
            </Route>
          </Route>
          <Route path="trips/edit/:id" element={<CreateTrip />}></Route>
          <Route path="auth/">
            <Route path="login" element={<LoginPage/>}></Route>
            <Route path="reg" element={<RegisterPage/>}></Route>
          </Route>
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="friends" element={<FriendList/>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
