import React, { useState } from "react"
import moment from "moment"
import { cancelTicket, getTicketByConfirmationCode } from "../utils/ApiFunctions"
const FindTicket = () => {
	const [confirmationCode, setConfirmationCode] = useState("")
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [TicketInfo, setTicketInfo] = useState({
		id: "",
		TicketConfirmationCode: "",
		airplane: { id: "", airplaneType: "" },
		departureDate: "",
		landingDate: "",
		guestName: "",
		guestEmail: "",
	})

	const emptyTicketInfo = {
		id: "",
		TicketConfirmationCode: "",
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
			const data = await getTicketByConfirmationCode(confirmationCode)
			setTicketInfo(data)
			setError(null)
		} catch (error) {
			setTicketInfo(emptyTicketInfo)
			if (error.response && error.response.status === 404) {
				setError(error.response.data.message)
			} else {
				setError(error.message)
			}
		}
		setTimeout(() => setIsLoading(false), 2000)
	}
	const handleTicketCancellation = async (TicketId) => {
		try {
			await cancelTicket(TicketId)
			setIsDeleted(true)
			setSuccessMessage("Ticket has been cancelled successfully!")
			setTicketInfo(emptyTicketInfo)
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
				<h2 className="text-center mb-4">Find My Ticket</h2>
				<form onSubmit={handleFormSubmit} className="col-md-6">
					<div className="input-group mb-3">
						<input
							className="form-control"
							type="text"
							id="confirmationCode"
							name="confirmationCode"
							value={confirmationCode}
							onChange={handleInputChange}
							placeholder="Enter the Ticket confirmation code"
						/>
						<button type="submit" className="btn btn-hotel input-group-text">
							Find Ticket
						</button>
					</div>
				</form>
				{isLoading ? (
					<div>Finding your Ticket...</div>
				) : error ? (
					<div className="text-danger">Error: {error}</div>
				) : TicketInfo.TicketConfirmationCode ? (
					<div className="col-md-6 mt-4 mb-5">
						<h3>Ticket Information</h3>
						<p className="text-success">Confirmation Code: {TicketInfo.TicketConfirmationCode}</p>
						<p>airplane Number: {TicketInfo.airplane.id}</p>
						<p>airplane Type: {TicketInfo.airplane.airplaneType}</p>
						<p>
							Departure Date:{" "}
							{moment(TicketInfo.departureDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>
							Landing Date:{" "}
							{moment(TicketInfo.landingDate).subtract(1, "month").format("MMM Do, YYYY")}
						</p>
						<p>Full Name: {TicketInfo.guestName}</p>
						<p>Email Address: {TicketInfo.guestEmail}</p>
						{!isDeleted && (
							<button
								onClick={() => handleTicketCancellation(TicketInfo.id)}
								className="btn btn-danger">
								Cancel Ticket
							</button>
						)}
					</div>
				) : (
					<div>Find your Ticket by Ticket confirmation code</div>
				)}
				{isDeleted && <div className="alert alert-success mt-3 fade show">{successMessage}</div>}
			</div>
		</>
	)
}
export default FindTicket
