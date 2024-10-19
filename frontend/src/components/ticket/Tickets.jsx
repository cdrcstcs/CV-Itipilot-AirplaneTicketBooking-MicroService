import React, { useState, useEffect } from "react"
import { cancelTicket, getAllTickets } from "../utils/ApiFunctions"
import Header from "../common/Header"
import TicketsTable from "./TicketsTable"

const Tickets = () => {
	const [TicketInfo, setTicketInfo] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState("")
	useEffect(() => {
		setTimeout(() => {
			getAllTickets()
				.then((data) => {
					setTicketInfo(data)
					setIsLoading(false)
				})
				.catch((error) => {
					setError(error.message)
					setIsLoading(false)
				})
		}, 1000)
	}, [])
	const handleTicketCancellation = async (TicketId) => {
		try {
			await cancelTicket(TicketId)
			const data = await getAllTickets()
			setTicketInfo(data)
		} catch (error) {
			setError(error.message)
		}
	}
	return (
		<section style={{ backgroundColor: "whitesmoke" }}>
			<Header title={"Existing Tickets"} />
			{error && <div className="text-danger">{error}</div>}
			{isLoading ? (
				<div>Loading existing Tickets</div>
			) : (
				<TicketsTable
					TicketInfo={TicketInfo}
					handleTicketCancellation={handleTicketCancellation}
				/>
			)}
		</section>
	)
}
export default Tickets
