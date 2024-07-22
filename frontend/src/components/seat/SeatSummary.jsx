import React, { useState, useEffect } from "react"
import moment from "moment"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

const AirplaneSummary = ({ airplane, payment, isFormValid, onConfirm }) => {
	const departureDate = moment(airplane.departureDate)
	const landingDate = moment(airplane.landingDate)
	const numberOfHours = landingDate.diff(departureDate, "hours")
	const [isAirplaneConfirmed, setIsAirplaneConfirmed] = useState(false)
	const [isProcessingPayment, setIsProcessingPayment] = useState(false)
	const navigate = useNavigate()
	const handleConfirmAirplane = () => {
		setIsProcessingPayment(true)
		setTimeout(() => {
			setIsProcessingPayment(false)
			setIsAirplaneConfirmed(true)
			onConfirm()
		}, 3000)
	}
	useEffect(() => {
		if (isAirplaneConfirmed) {
			navigate("/airplane-success")
		}
	}, [isAirplaneConfirmed, navigate])
	return (
		<div className="row">
			<div className="col-md-6"></div>
			<div className="card card-body mt-5">
				<h4 className="card-title hotel-color">Reservation Summary</h4>
				<p>
					Name: <strong>{airplane.guestFullName}</strong>
				</p>
				<p>
					Email: <strong>{airplane.guestEmail}</strong>
				</p>
				<p>
					Departure Date: <strong>{moment(airplane.departureDate).format("MMM Do YYYY")}</strong>
				</p>
				<p>
					Landing Date: <strong>{moment(airplane.landingDate).format("MMM Do YYYY")}</strong>
				</p>
				<p>
					Number of Hours Booked: <strong>{numberOfHours}</strong>
				</p>
				{payment > 0 ? (
					<>
						<p>
							Total payment: <strong>${payment}</strong>
						</p>
						{isFormValid && !isAirplaneConfirmed ? (
							<Button variant="success" onClick={handleConfirmAirplane}>
								{isProcessingPayment ? (
									<>
										<span
											className="spinner-border spinner-border-sm mr-2"
											role="status"
											aria-hidden="true"></span>
										Airplane Confirmed, redirecting to payment...
									</>
								) : (
									"Confirm Airplane & proceed to payment"
								)}
							</Button>
						) : isAirplaneConfirmed ? (
							<div className="d-flex justify-content-center align-items-center">
								<div className="spinner-border text-primary" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						) : null}
					</>
				) : (
					<p className="text-danger">Landing date must be after Departure date.</p>
				)}
			</div>
		</div>
	)
}
export default AirplaneSummary
