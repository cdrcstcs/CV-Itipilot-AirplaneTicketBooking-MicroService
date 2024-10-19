import React from "react"
import { useState } from "react"
import { Form, FormControl} from "react-bootstrap"
import TicketSummary from "./TicketSummary"
import { bookTicket} from "../utils/ApiFunctions"
import { useNavigate, useParams } from "react-router-dom"
const TicketForm = ({airplaneId}) => {
	if (airplaneId== null){
		airplaneId = useParams().airplaneId;
	}
	const [isSubmitted, setIsSubmitted] = useState(false)
	const currentUser = localStorage.getItem("userId")
	const [Ticket, setTicket] = useState({
		guestFullName: "",
		guestEmail: currentUser,
	})
	const navigate = useNavigate()
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setTicket({ ...Ticket, [name]: value })
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		setIsSubmitted(true)
	}
	const handleFormSubmit = async () => {
		try {
			const confirmationCode = await bookTicket(airplaneId, Ticket)
			setIsSubmitted(true)
			navigate("/Ticket-success", { state: { message: confirmationCode } })
		} catch (error) {
			const errorMessage = error.message
			console.log(errorMessage)
			navigate("/Ticket-success", { state: { error: errorMessage } })
		}
	}
	return (
		<>
			<div className="container mb-5">
				<div className="row">
					<div className="col-md-6">
						<div className="card card-body mt-5">
							<h4 className="card-title">Reserve Ticket</h4>
							<Form onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label htmlFor="guestFullName" className="hotel-color">
										Fullname
									</Form.Label>
									<FormControl
										required
										type="text"
										id="guestFullName"
										name="guestFullName"
										value={Ticket.guestFullName}
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
										value={Ticket.guestEmail}
										placeholder="Enter your email"
										onChange={handleInputChange}
										disabled
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a valid email address.
									</Form.Control.Feedback>
								</Form.Group>
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
							<TicketSummary
								Ticket={Ticket}
								onConfirm={handleFormSubmit}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
export default TicketForm
