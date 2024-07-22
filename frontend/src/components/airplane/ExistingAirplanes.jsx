import React, { useEffect, useState } from "react"
import { deleteAirplane, getAllAirplanes } from "../utils/ApiFunctions"
import { Col, Row } from "react-bootstrap"
import AirplaneFilter from "../common/AirplaneFilter"
import AirplanePaginator from "../common/AirplanePaginator"
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa"
import { Link } from "react-router-dom"
const ExistingAirplanes = () => {
	const [airplanes, setAirplanes] = useState([{ id: "", airplaneType: "", ticketPrice: "" }])
	const [currentPage, setCurrentPage] = useState(1)
	const [airplanesPerPage] = useState(8)
	const [isLoading, setIsLoading] = useState(false)
	const [filteredAirplanes, setFilteredAirplanes] = useState([{ id: "", airplaneType: "", ticketPrice: "" }])
	const [selectedAirplaneType, setSelectedAirplaneType] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	useEffect(() => {
		fetchAirplanes()
	}, [])
	const fetchAirplanes = async () => {
		setIsLoading(true)
		try {
			const result = await getAllAirplanes()
			setAirplanes(result)
			setIsLoading(false)
		} catch (error) {
			setErrorMessage(error.message)
			setIsLoading(false)
		}
	}
	useEffect(() => {
		if (selectedAirplaneType === "") {
			setFilteredAirplanes(airplanes)
		} else {
			const filteredAirplanes = airplanes.filter((airplane) => airplane.airplaneType === selectedAirplaneType)
			setFilteredAirplanes(filteredAirplanes)
		}
		setCurrentPage(1)
	}, [airplanes, selectedAirplaneType])
	const handlePaginationClick = (pageNumber) => {
		setCurrentPage(pageNumber)
	}
	const handleDelete = async (airplaneId) => {
		try {
			const result = await deleteAirplane(airplaneId)
			if (result === "") {
				setSuccessMessage(`Airplane No ${airplaneId} was delete`)
				fetchAirplanes()
			} else {
				console.error(`Error deleting Airplane : ${result.message}`)
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}
	const calculateTotalPages = (filteredAirplanes, airplanesPerPage, airplanes) => {
		const totalAirplanes = filteredAirplanes.length > 0 ? filteredAirplanes.length : airplanes.length
		return Math.ceil(totalAirplanes / airplanesPerPage)
	}
	const indexOfLastAirplane = currentPage * airplanesPerPage
	const indexOfFirstAirplane = indexOfLastAirplane - airplanesPerPage
	const currentAirplanes = filteredAirplanes.slice(indexOfFirstAirplane, indexOfLastAirplane)
	return (
		<>
			<div className="container col-md-8 col-lg-6">
				{successMessage && <p className="alert alert-success mt-5">{successMessage}</p>}
				{errorMessage && <p className="alert alert-danger mt-5">{errorMessage}</p>}
			</div>
			{isLoading ? (
				<p>Loading existing Airplanes</p>
			) : (
				<>
					<section className="mt-5 mb-5 container">
						<div className="d-flex justify-content-between mb-3 mt-5">
							<h2>Existing Airplanes</h2>
						</div>
						<Row>
							<Col md={6} className="mb-2 md-mb-0">
								<AirplaneFilter data={airplanes} setFilteredData={setFilteredAirplanes} />
							</Col>
							<Col md={6} className="d-flex justify-content-end">
								<Link to={"/add-Airplane"}>
									<FaPlus /> Add Airplane
								</Link>
							</Col>
						</Row>
						<table className="table table-bordered table-hover">
							<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Airplane Type</th>
									<th>Ticket Price</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{currentAirplanes.map((airplane) => (
									<tr key={airplane.id} className="text-center">
										<td>{airplane.id}</td>
										<td>{airplane.airplaneType}</td>
										<td>{airplane.ticketPrice}</td>
										<td className="gap-2">
											<Link to={`/edit-airplane/${airplane.id}`} className="gap-2">
												<span className="btn btn-info btn-sm">
													<FaEye />
												</span>
												<span className="btn btn-warning btn-sm ml-5">
													<FaEdit />
												</span>
											</Link>
											<button
												className="btn btn-danger btn-sm ml-5"
												onClick={() => handleDelete(airplane.id)}>
												<FaTrashAlt />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<AirplanePaginator
							currentPage={currentPage}
							totalPages={calculateTotalPages(filteredAirplanes, airplanesPerPage, airplanes)}
							onPageChange={handlePaginationClick}
						/>
					</section>
				</>
			)}
		</>
	)
}

export default ExistingAirplanes
