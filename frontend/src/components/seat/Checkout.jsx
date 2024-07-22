import React, { useEffect, useState } from "react"
import AirplaneForm from "./SeatForm"
import {
	FaUtensils,
	FaWifi,
	FaTv,
	FaWineGlassAlt,
	FaParking,
	FaCar,
	FaTshirt
} from "react-icons/fa"

import { useParams } from "react-router-dom"
import { getAirplaneById } from "../utils/ApiFunctions"
import AirplaneCarousel from "../common/AirplaneCarousel"

const Checkout = () => {
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [airplaneInfo, setAirplaneInfo] = useState({
		photo: "",
		airplaneType: "",
		ticketPrice: ""
	})
	const { airplaneId } = useParams()
	useEffect(() => {
		setTimeout(() => {
			getAirplaneById(airplaneId)
				.then((response) => {
					setAirplaneInfo(response)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error)
					setIsLoading(false)
				})
		}, 1000)
	}, [airplaneId])
	return (
		<div>
			<section className="container">
				<div className="row">
					<div className="col-md-4 mt-5 mb-5">
						{isLoading ? (
							<p>Loading Airplane information...</p>
						) : error ? (
							<p>{error}</p>
						) : (
							<div className="Airplane-info">
								<img
									src={`data:image/png;base64,${airplaneInfo.photo}`}
									alt="Airplane photo"
									style={{ width: "100%", height: "200px" }}
								/>
								<table className="table table-bordered">
									<tbody>
										<tr>
											<th>Airplane Type:</th>
											<td>{airplaneInfo.airplaneType}</td>
										</tr>
										<tr>
											<th>Price per ticket</th>
											<td>${airplaneInfo.ticketPrice}</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}
					</div>
					<div className="col-md-8">
						<AirplaneForm />
					</div>
				</div>
			</section>
			<div className="container">
				<AirplaneCarousel />
			</div>
		</div>
	)
}
export default Checkout
