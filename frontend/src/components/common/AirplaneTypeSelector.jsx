import React, { useState, useEffect } from "react"
import { getAirplaneTypes } from "../utils/ApiFunctions"

const AirplaneTypeSelector = ({ handleAirplaneInputChange, newAirplane }) => {
	const [airplaneTypes, setAirplaneTypes] = useState([""])
	const [showNewAirplaneTypeInput, setShowNewAirplaneTypeInput] = useState(false)
	const [newAirplaneType, setNewAirplaneType] = useState("")
	useEffect(() => {
		getAirplaneTypes().then((data) => {
			console.log(data);
			setAirplaneTypes(data)
		})
	}, [])
	const handleNewAirplaneTypeInputChange = (e) => {
		setNewAirplaneType(e.target.value)
	}
	const handleAddNewAirplaneType = () => {
		if (newAirplaneType !== "") {
			setAirplaneTypes([...airplaneTypes, newAirplaneType])
			setNewAirplaneType("")
			setShowNewAirplaneTypeInput(false)
		}
	}
	return (
		<>
			{airplaneTypes.length > 0 && (
				<div>
					<select
						required
						className="form-select"
						name="airplaneType"
						onChange={(e) => {
							if (e.target.value === "Add New") {
								setShowNewAirplaneTypeInput(true)
							} else {
								handleAirplaneInputChange(e)
							}
						}}
						value={newAirplane.airplaneType}>
						<option value="">Select a Airplane Brand</option>
						<option value={"Add New"}>Add New</option>
						{airplaneTypes.map((type, index) => (
							<option key={index} value={type}>
								{type}
							</option>
						))}
					</select>
					{showNewAirplaneTypeInput && (
						<div className="mt-2">
							<div className="input-group">
								<input
									type="text"
									className="form-control"
									placeholder="Enter New Airplane Brand"
									value={newAirplaneType}
									onChange={handleNewAirplaneTypeInputChange}
								/>
								<button className="btn btn-hotel" type="button" onClick={handleAddNewAirplaneType}>
									Add
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	)
}
export default AirplaneTypeSelector
