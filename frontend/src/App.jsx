import React from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "/node_modules/bootstrap/dist/js/bootstrap.min.js"
import ExistingAirplanes from "./components/airplane/ExistingAirplanes"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/home/Home"
import EditAirplane from "./components/airplane/EditAirplane"
import AddAirplane from "./components/airplane/AddAirplane"
import NavBar from "./components/layout/NavBar"
import Footer from "./components/layout/Footer"
import AirplaneListing from "./components/airplane/AirplaneListing"
import Admin from "./components/admin/Admin"
import Checkout from "./components/ticket/Checkout"
import TicketSuccess from "./components/ticket/TicketSuccess"
import Tickets from "./components/ticket/Tickets"
import FindTicket from "./components/ticket/FindTicket"
import Login from "./components/auth/Login"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
function App() {
	return (
		<AuthProvider>
			<main>
				<Router>
					<NavBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/edit-airplane/:airplaneId" element={<EditAirplane />} />
						<Route path="/existing-airplanes" element={<ExistingAirplanes />} />
						<Route path="/add-airplane" element={<AddAirplane />} />
						<Route
							path="/book-airplane/:airplaneId"
							element={
								<RequireAuth>
									<Checkout />
								</RequireAuth>
							}
						/>
						<Route path="/browse-all-airplanes" element={<AirplaneListing />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="/ticket-success" element={<TicketSuccess />} />
						<Route path="/existing-Tickets" element={<Tickets />} />
						<Route path="/find-ticket" element={<FindTicket />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Registration />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/logout" element={<FindTicket />} />
					</Routes>
				</Router>
				<Footer />
			</main>
		</AuthProvider>
	)
}

export default App
