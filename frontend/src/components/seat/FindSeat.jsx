import React, { useState } from "react"
import moment from "moment"
import { cancelSeat, getSeatByConfirmationCode } from "../utils/ApiFunctions"
const FindSeat = () => {
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [seatInfo, setSeatInfo] = useState({
		id: "",
		seatConfirmationCode: "",
		airplane: { id: "", airplaneType: "" },
		departureDate: "",
		landingDate: "",
		guestName: "",
		guestEmail: "",
	})

	const emptySeatInfo = {
		id: "",
		seatConfirmationCode: "",
		airplane: { id: "", airplaneType: "" },
		departureDate: "",
		landingDate: "",
		guestName: "",
		guestEmail: "",
	}
	const [isDeleted, setIsDeleted] = useState(false)
	const handleInputChange = (event) => {
		setConfirmationCode(event.target.value)
	}
	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setIsLoading(true)
		try {
			const data = await getSeatByConfirmationCode(confirmationCode)
			setSeatInfo(data)
			setError(null)
		} catch (error) {
			setSeatInfo(emptySeatInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}
		setTimeout(() => setIsLoading(false), 2000)
	}
	const handleSeatCancellation = async (seatId) => {
		try {
			await cancelSeat(seatId)
			setIsDeleted(true)
			setSuccessMessage("Seat has been cancelled successfully!")
			setSeatInfo(emptySeatInfo)
			setConfirmationCode("")
			setError(null)
		} catch (error) {
			setError(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setIsDeleted(false)
		}, 2000)
	}
	return (
		<>
			<div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
				<h2 className="text-center mb-4">Find My Seat</h2>
				<form onSubmit={handleFormSubmit} className="col-md-6">
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="text"
							id="confirmationCode"
							name="confirmationCode"
							value={confirmationCode}
							onChange={handleInputChange}
							placeholder="Enter the Seat confirmation code"
						/>
						<button type="submit" className="btn btn-hotel input-group-text">
							Find Seat
						</button>
					</div>
				</form>
				{isLoading ? (
					<div>Finding your Seat...</div>
				) : error ? (
					<div className="text-danger">Error: {error}</div>
				) : seatInfo.seatConfirmationCode ? (
					<div className="col-md-6 mt-4 mb-5">
						<h3>Seat Information</h3>
						<p className="text-success">Confirmation Code: {seatInfo.seatConfirmationCode}</p>
						<p>airplane Number: {seatInfo.airplane.id}</p>
						<p>airplane Type: {seatInfo.airplane.airplaneType}</p>
						<p>
							Departure Date:{" "}
							{moment(seatInfo.departureDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>
							Landing Date:{" "}
							{moment(seatInfo.landingDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>Full Name: {seatInfo.guestName}</p>
						<p>Email Address: {seatInfo.guestEmail}</p>
						{!isDeleted && (
							<button
								onClick={() => handleSeatCancellation(seatInfo.id)}
								className="btn btn-danger">
								Cancel Seat
							</button>
						)}
					</div>
				) : (
					<div>Find your seat by seat confirmation code</div>
				)}
				{isDeleted && <div className="alert alert-success mt-3 fade show">{successMessage}</div>}
			</div>
		</>
	)
}
export default FindSeat
