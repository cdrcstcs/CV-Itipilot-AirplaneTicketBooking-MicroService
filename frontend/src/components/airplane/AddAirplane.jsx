import React, { useState } from "react"
import { addAirplane } from "../utils/ApiFunctions"
import AirplaneTypeSelector from "../common/AirplaneTypeSelector"
import { Link } from "react-router-dom"

const AddAirplane = () => {
	const [newAirplane, setNewAirplane] = useState({
		photo: null,
		airplaneType: "",
		ticketPrice: ""
	})
	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const [imagePreview, setImagePreview] = useState("")
	const handleAirplaneInputChange = (e) => {
		const name = e.target.name
		let value = e.target.value
		if (name === "ticketPrice") {
			if (!isNaN(value)) {
				value = parseInt(value)
			} else {
				value = ""
			}
		}
		setNewAirplane({ ...newAirplane, [name]: value })
	}
	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setNewAirplane({ ...newAirplane, photo: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const success = await addAirplane(newAirplane.photo, newAirplane.airplaneType, newAirplane.ticketPrice)
			if (success !== undefined) {
				setSuccessMessage("A new Airplane was  added successfully !")
				setNewAirplane({ photo: null, airplaneType: "", ticketPrice: "" })
				setImagePreview("")
				setErrorMessage("")
			} else {
				setErrorMessage("Error adding new Airplane")
			}
		} catch (error) {
			setErrorMessage(error.message)
		}
		setTimeout(() => {
			setSuccessMessage("")
			setErrorMessage("")
		}, 3000)
	}
	return (
		<>
			<section className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8 col-lg-6">
						<h2 className="mt-5 mb-2">Add a New Airplane</h2>
						{successMessage && (
							<div className="alert alert-success fade show"> {successMessage}</div>
						)}
						{errorMessage && <div className="alert alert-danger fade show"> {errorMessage}</div>}
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="airplaneType" className="form-label">
									Airplane Brand
								</label>
								<div>
									<AirplaneTypeSelector
										handleAirplaneInputChange={handleAirplaneInputChange}
										newAirplane={newAirplane}
									/>
								</div>
							</div>
							<div className="mb-3">
								<label htmlFor="ticketPrice" className="form-label">
									Ticket Price
								</label>
								<input
									required
									type="number"
									className="form-control"
									id="ticketPrice"
									name="ticketPrice"
									value={newAirplane.ticketPrice}
									onChange={handleAirplaneInputChange}
								/>
							</div>

							<div className="mb-3">
								<label htmlFor="photo" className="form-label">
									Airplane Photo
								</label>
								<input
									required
									name="photo"
									id="photo"
									type="file"
									className="form-control"
									onChange={handleImageChange}
								/>
								{imagePreview && (
									<img
										src={imagePreview}
										alt="Preview  Airplane photo"
										style={{ maxWidth: "400px", maxHeight: "400px" }}
										className="mb-3"></img>
								)}
							</div>
							<div className="d-grid gap-2 d-md-flex mt-2">
								<Link to={"/existing-airplanes"} className="btn btn-outline-info">
									Existing Airplanes
								</Link>
								<button type="submit" className="btn btn-outline-primary ml-5">
									Save Airplane
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	)
}
export default AddAirplane
