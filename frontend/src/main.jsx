import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import Login from './login.jsx'
import Timetable from './timetable.jsx'
import Component from './component.jsx'
import Upcoming from './upcoming.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/upcoming",
    element: <><Component /><Upcoming/></>,
  },
  {
    path: "/timetable",
    element: <><Component /><Timetable/></>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{width: "100%"}}>
    {/* <Component /> */}
    <RouterProvider router={router} />
    {/* <Timetable /> */}
    {/* <Upcoming /> */}
    </div>
    {/* <App /> */}
  </React.StrictMode>,
)
