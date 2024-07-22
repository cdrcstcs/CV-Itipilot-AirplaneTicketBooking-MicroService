import React, { useState, useEffect } from "react"
import { cancelSeat, getAllSeats } from "../utils/ApiFunctions"
import Header from "../common/Header"
import SeatsTable from "./SeatsTable"

const Seats = () => {
	const [seatInfo, setSeatInfo] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")
	useEffect(() => {
		setTimeout(() => {
			getAllSeats()
				.then((data) => {
					setSeatInfo(data)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error.message)
					setIsLoading(false)
				})
		}, 1000)
	}, [])
	const handleSeatCancellation = async (SeatId) => {
		try {
			await cancelSeat(SeatId)
			const data = await getAllSeats()
			setSeatInfo(data)
		} catch (error) {
			setError(error.message)
		}
	}
	return (
		<section style={{ backgroundColor: "whitesmoke" }}>
			<Header title={"Existing Seats"} />
			{error && <div className="text-danger">{error}</div>}
			{isLoading ? (
				<div>Loading existing Seats</div>
			) : (
				<SeatsTable
					seatInfo={seatInfo}
					handleSeatCancellation={handleSeatCancellation}
				/>
			)}
		</section>
	)
}
export default Seats
