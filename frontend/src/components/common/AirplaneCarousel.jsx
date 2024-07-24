import React, { useEffect, useState } from "react"
import { getAllAirplanes } from "../utils/ApiFunctions"
import { Link } from "react-router-dom"
import { Card, Carousel, Col, Container, Row } from "react-bootstrap"

const AirplaneCarousel = () => {
	const [airplanes, setAirplanes] = useState([{ id: "", airplaneType: "", ticketPrice: "", photo: "" }])
	const [errorMessage, setErrorMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	useEffect(() => {
		setIsLoading(true)
		getAllAirplanes()
			.then((data) => {
				setAirplanes(data)
				setIsLoading(false)
			})
			.catch((error) => {
				setErrorMessage(error.message)
				setIsLoading(false)
			})
	}, [])
	if (isLoading) {
		return <div className="mt-5">Loading Airplanes....</div>
	}
	if (errorMessage) {
		return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>
	}
	return (
		<section className="bg-light mb-5 mt-5 shadow">
			<Link to={"/browse-all-airplanes"} className="hote-color text-center">
				Browse all Airplanes
			</Link>
			<Container>
				<Carousel indicators={false}>
					{[...Array(Math.ceil(airplanes.length / 4))].map((_, index) => (
						<Carousel.Item key={index}>
							<Row>
								{airplanes.slice(index * 4, index * 4 + 4).map((airplane) => (
									<Col key={airplane.id} className="mb-4" xs={12} md={6} lg={3}>
										<Card style={{height:"370px"}}>
											<Card.Img
												variant="top"
												src={`data:image/png;base64, ${airplane.photo}`}
												alt="airplane Photo"
												className="w-100"
												style={{ maxHeight: "200px" }}
											/>
											<Card.Body>
												<Card.Title className="hotel-color">{airplane.airplaneType}</Card.Title>
												<Card.Title className="airplane-price">${airplane.ticketPrice}</Card.Title>
												<div>
													<Link to={`/book-airplane/${airplane.id}`} className="btn btn-hotel btn-sm">
														Book Ticket {console.log(airplane.id)}
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						</Carousel.Item>
					))}
				</Carousel>
			</Container>
		</section>
	)
}
export default AirplaneCarousel
