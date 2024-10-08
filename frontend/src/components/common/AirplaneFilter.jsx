import React, { useState } from "react"

const AirplaneFilter = ({ data, setFilteredData }) => {
	const [filter, setFilter] = useState("")
	const handleSelectChange = (e) => {
		const selectedType = e.target.value
		setFilter(selectedType)
		const filteredAirplanes = data.filter((airplane) =>
			airplane.airplaneType.toLowerCase().includes(selectedType.toLowerCase())
		)
		setFilteredData(filteredAirplanes)
	}
	const clearFilter = () => {
		setFilter("")
		setFilteredData(data)
	}
	const airplaneTypes = ["", ...new Set(data.map((airplane) => airplane.airplaneType))]
	return (
		<div className="input-group mb-3">
			<span className="input-group-text" id="Airplane-type-filter">
				FIlter Airplanes by Brand
			</span>
			<select
				className="form-select"
				aria-label="romm type filter"
				value={filter}
				onChange={handleSelectChange}>
				<option value="">select a Airplane Brand to filter....</option>
				{airplaneTypes.map((type, index) => (
					<option key={index} value={String(type)}>
						{String(type)}
					</option>
				))}
			</select>
			<button className="btn btn-hotel" type="button" onClick={clearFilter}>
				Clear Filter
			</button>
		</div>
	)
}
export default AirplaneFilter
