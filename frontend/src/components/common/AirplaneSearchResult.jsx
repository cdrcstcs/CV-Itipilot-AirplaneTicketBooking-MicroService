import React, { useState } from "react"
import AirplaneCard from "../airplane/AirplaneCard"
import { Button, Row } from "react-bootstrap"
import AirplanePaginator from "./AirplanePaginator"

const AirplaneSearchResults = ({ results, onClearSearch }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const resultsPerPage = 3
	const totalResults = results.length
	const totalPages = Math.ceil(totalResults / resultsPerPage)
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}
	const startIndex = (currentPage - 1) * resultsPerPage
	const endIndex = startIndex + resultsPerPage
	const paginatedResults = results.slice(startIndex, endIndex)
	return (
		<>
			{results.length > 0 ? (
				<>
					<h5 className="text-center mt-5">Search Results</h5>
					<Row>
						{paginatedResults.map((airplane) => (
							<AirplaneCard key={airplane.id} airplane={airplane} />
						))}
					</Row>
					<Row>
						{totalResults > resultsPerPage && (
							<AirplanePaginator
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						)}
						<Button variant="secondary" onClick={onClearSearch}>
							Clear Search
						</Button>
					</Row>
				</>
			) : (
				<p></p>
			)}
		</>
	)
}
export default AirplaneSearchResults
