import React from "react"
import MainHeader from "../layout/MainHeader"
import AirplaneCarousel from "../common/AirplaneCarousel"
import AirplaneSearch from "../common/AirplaneSearch"
import { useLocation } from "react-router-dom"
const Home = () => {
	const location = useLocation()
	const message = location.state && location.state.message
	const currentUser = localStorage.getItem("userId")
	return (
		<section>
			{message && <p className="text-warning px-5">{message}</p>}
			{currentUser && (
				<h6 className="text-success text-center"> You are logged-In as {currentUser}</h6>
			)}
			<MainHeader />
			<div className="container">
				<AirplaneSearch />
				<AirplaneCarousel />
			</div>
		</section>
	)
}

export default Home
