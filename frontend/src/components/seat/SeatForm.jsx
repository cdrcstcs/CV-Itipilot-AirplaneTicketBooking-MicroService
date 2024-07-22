import React, { useEffect } from "react"
import moment from "moment"
import { useState } from "react"
import { Form, FormControl, Button } from "react-bootstrap"
import AirplaneSummary from "./SeatSummary"
import { bookSeat, getAirplaneById } from "../utils/ApiFunctions"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"

const AirplaneForm = () => {
	const [validated, setValidated] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [seatPrice, setSeatPrice] = useState(0)
	const currentUser = localStorage.getItem("userId")
	const [airplane, setAirplane] = useState({
		guestFullName: "",
		guestEmail: currentUser,
		departureDate: "",
		landingDate: "",
	})
	const { seatId } = useParams()
	const navigate = useNavigate()
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setAirplane({ ...airplane, [name]: value })
		setErrorMessage("")
	}
	const getSeatPriceById = async (seatId) => {
		try {
			const response = await getAirplaneById(seatId)
			setSeatPrice(response.SeatPrice)
		} catch (error) {
			throw new Error(error)
		}
	}
	useEffect(() => {
		getSeatPriceById(seatId)
	}, [seatId])
	const calculatePayment = () => {
		const payment = seatPrice ? seatPrice : 0
		return payment
	}
	const islandingDateValid = () => {
		if (!moment(airplane.landingDate).isSameOrAfter(moment(airplane.departureDate))) {
			setErrorMessage("Check-out date must be after check-in date")
			return false
		} else {
			setErrorMessage("")
			return true
		}
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		const form = e.currentTarget
		if (form.checkValidity() === false || !islandingDateValid()) {
			e.stopPropagation()
		} else {
			setIsSubmitted(true)
		}
		setValidated(true)
	}
	const handleFormSubmit = async () => {
		try {
			const confirmationCode = await bookSeat(seatId, airplane)
			setIsSubmitted(true)
			navigate("/airplane-success", { state: { message: confirmationCode } })
		} catch (error) {
			const errorMessage = error.message
			console.log(errorMessage)
			navigate("/airplane-success", { state: { error: errorMessage } })
		}
	}
	return (
		<>
			<div className="container mb-5">
				<div className="row">
					<div className="col-md-6">
						<div className="card card-body mt-5">
							<h4 className="card-title">Reserve Seat</h4>
							<Form noValidate validated={validated} onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label htmlFor="guestFullName" className="hotel-color">
										Fullname
									</Form.Label>
									<FormControl
										required
										type="text"
										id="guestFullName"
										name="guestFullName"
										value={airplane.guestFullName}
										placeholder="Enter your fullname"
										onChange={handleInputChange}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter your fullname.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group>
									<Form.Label htmlFor="guestEmail" className="hotel-color">
										Email
									</Form.Label>
									<FormControl
										required
										type="email"
										id="guestEmail"
										name="guestEmail"
										value={airplane.guestEmail}
										placeholder="Enter your email"
										onChange={handleInputChange}
										disabled
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a valid email address.
									</Form.Control.Feedback>
								</Form.Group>
								<fieldset style={{ border: "2px" }}>
									<legend>Lodging Period</legend>
									<div className="row">
										<div className="col-6">
											<Form.Label htmlFor="departureDate" className="hotel-color">
												Departure date
											</Form.Label>
											<FormControl
												required
												type="date"
												id="departureDate"
												name="departureDate"
												value={airplane.departureDate}
												placeholder="departure-date"
												min={moment().format("MMM Do, YYYY")}
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Please select a departure date.
											</Form.Control.Feedback>
										</div>
										<div className="col-6">
											<Form.Label htmlFor="landingDate" className="hotel-color">
												Landing date
											</Form.Label>
											<FormControl
												required
												type="date"
												id="landingDate"
												name="landingDate"
												value={airplane.landingDate}
												placeholder="landing-date"
												min={moment().format("MMM Do, YYYY")}
												onChange={handleInputChange}
											/>
											<Form.Control.Feedback type="invalid">
												Please select a landing date.
											</Form.Control.Feedback>
										</div>
										{errorMessage && <p className="error-message text-danger">{errorMessage}</p>}
									</div>
								</fieldset>
								<div className="fom-group mt-2 mb-2">
									<button type="submit" className="btn btn-hotel">
										Continue
									</button>
								</div>
							</Form>
						</div>
					</div>
					<div className="col-md-4">
						{isSubmitted && (
							<AirplaneSummary
								airplane={airplane}
								payment={calculatePayment()}
								onConfirm={handleFormSubmit}
								isFormValid={validated}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
export default AirplaneForm
