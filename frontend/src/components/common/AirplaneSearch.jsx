import React, { useState } from "react"
import { Form, Button, Row, Col, Container } from "react-bootstrap"
import moment from "moment"
import { getAvailableAirplanes } from "../utils/ApiFunctions"
import AirplaneSearchResults from "./AirplaneSearchResult"
import AirplaneTypeSelector from "./AirplaneTypeSelector"
const AirplaneSearch = () => {
	const [searchQuery, setSearchQuery] = useState({
		departureDate: "",
		landingDate: "",
		airplaneType: ""
	})
	const [errorMessage, setErrorMessage] = useState("")
	const [availableAirplanes, setAvailableAirplanes] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const handleSearch = (e) => {
		e.preventDefault()
		const departureMoment = moment(searchQuery.departureDate)
		const landingMoment = moment(searchQuery.landingDate)
		if (!departureMoment.isValid() || !landingMoment.isValid()) {
			setErrorMessage("Please enter valid dates")
			return
		}
		if (!landingMoment.isSameOrAfter(departureMoment)) {
			setErrorMessage("Check-out date must be after check-in date")
			return
		}
		setIsLoading(true)
		getAvailableAirplanes(searchQuery.departureDate, searchQuery.landingDate, searchQuery.airplaneType)
			.then((response) => {
				setAvailableAirplanes(response.data)
				setTimeout(() => setIsLoading(false), 2000)
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setSearchQuery({ ...searchQuery, [name]: value })
		const departureDate = moment(searchQuery.departureDate)
		const landingDate = moment(searchQuery.landingDate)
		if (departureDate.isValid() && landingDate.isValid()) {
			setErrorMessage("")
		}
	}
	const handleClearSearch = () => {
		setSearchQuery({
			departureDate: "",
			landingDate: "",
			AirplaneType: ""
		})
		setAvailableAirplanes([])
	}
	return (
		<>
			<Container className="shadow mt-n5 mb-5 py-5">
				<Form onSubmit={handleSearch}>
					<Row className="justify-content-center">
						<Col xs={12} md={3}>
							<Form.Group controlId="departureDate">
								<Form.Label>Departure Date</Form.Label>
								<Form.Control
									type="date"
									name="departureDate"
									value={searchQuery.departureDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
							</Form.Group>
						</Col>
						<Col xs={12} md={3}>
							<Form.Group controlId="landingDate">
								<Form.Label>Landing Date</Form.Label>
								<Form.Control
									type="date"
									name="landingDate"
									value={searchQuery.landingDate}
									onChange={handleInputChange}
									min={moment().format("YYYY-MM-DD")}
								/>
							</Form.Group>
						</Col>
						<Col xs={12} md={3}>
							<Form.Group controlId="AirplaneType">
								<Form.Label>Airplane Brand</Form.Label>
								<div className="d-flex">
									<AirplaneTypeSelector
										handleAirplaneInputChange={handleInputChange}
										newAirplane={searchQuery}
									/>
									<Button variant="secondary" type="submit" className="ml-2">
										Search
									</Button>
								</div>
							</Form.Group>
						</Col>
					</Row>
				</Form>

				{isLoading ? (
					<p className="mt-4">Finding availble Airplanes....</p>
				) : availableAirplanes ? (
					<AirplaneSearchResults results={availableAirplanes} onClearSearch={handleClearSearch} />
				) : (
					<p className="mt-4">No Airplanes available for the selected dates and Airplane type.</p>
				)}
				{errorMessage && <p className="text-danger">{errorMessage}</p>}
			</Container>
		</>
	)
}

export default AirplaneSearch
