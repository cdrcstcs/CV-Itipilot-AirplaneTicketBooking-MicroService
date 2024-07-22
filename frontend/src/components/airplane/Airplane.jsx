import React, { useEffect, useState } from "react"
import { getAllAirplanes } from "../utils/ApiFunctions"
import AirplaneCard from "./AirplaneCard"
import { Col, Container, Row } from "react-bootstrap"
import AirplaneFilter from "../common/AirplaneFilter"
import AirplanePaginator from "../common/AirplanePaginator"

const Airplane = () => {
	const [data, setData] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [airplanesPerPage] = useState(6)
	const [filteredData, setFilteredData] = useState([{ id: "" }])
	useEffect(() => {
		setIsLoading(true)
		getAllAirplanes()
			.then((data) => {
				setData(data)
				setFilteredData(data)
				setIsLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setIsLoading(false)
			})
	}, [])
	if (isLoading) {
		return <div>Loading Airplanes.....</div>
	}
	if (error) {
		return <div className=" text-danger">Error : {error}</div>
	}
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}
	const totalPages = Math.ceil(filteredData.length / airplanesPerPage)
	const renderAirplanes = () => {
		const startIndex = (currentPage - 1) * airplanesPerPage
		const endIndex = startIndex + airplanesPerPage
		return filteredData
			.slice(startIndex, endIndex)
			.map((Airplane) => <AirplaneCard key={Airplane.id} Airplane={Airplane} />)
	}
	return (
		<Container>
			<Row>
				<Col md={6} className="mb-3 mb-md-0">
					<AirplaneFilter data={data} setFilteredData={setFilteredData} />
				</Col>
				<Col md={6} className="d-flex align-items-center justify-content-end">
					<AirplanePaginator
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</Col>
			</Row>
			<Row>{renderAirplanes()}</Row>
			<Row>
				<Col md={6} className="d-flex align-items-center justify-content-end">
					<AirplanePaginator
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</Col>
			</Row>
		</Container>
	)
}
export default Airplane
