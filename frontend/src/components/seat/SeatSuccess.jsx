import React from "react"
import { Link, useLocation } from "react-router-dom"
import Header from "../common/Header"
const SeatSuccess = () => {
	const location = useLocation()
	const message = location.state?.message
	const error = location.state?.error
	return (
		<div className="container">
			<Header title="Seat Success" />
			<div className="mt-5">
				{message ? (
					<div>
						<h3 className="text-success"> Seat Success!</h3>
						<p className="text-success">{message}</p>
					</div>
				) : (
					<div>
						<h3 className="text-danger"> Error Seat Booking!</h3>
						<p className="text-danger">{error}</p>
					</div>
				)}
			</div>
		</div>
	)
}
export default SeatSuccess
