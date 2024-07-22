import React, { useEffect, useState } from "react"
import { getAirplaneById, updateAirplane } from "../utils/ApiFunctions"
import { Link, useParams } from "react-router-dom"
const EditAirplane = () => {
	const [airplane, setAirplane] = useState({
		photo: "",
		airplaneType: "",
		ticketPrice: ""
	})
	const [imagePreview, setImagePreview] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	const [errorMessage, setErrorMessage] = useState("")
	const { airplaneId } = useParams()
	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0]
		setAirplane({ ...airplane, photo: selectedImage })
		setImagePreview(URL.createObjectURL(selectedImage))
	}
	const handleInputChange = (event) => {
		const { name, value } = event.target
		setAirplane({ ...airplane, [name]: value })
	}
	useEffect(() => {
		const fetchAirplane = async () => {
			try {
				const AirplaneData = await getAirplaneById(airplaneId)
				setAirplane(AirplaneData)
				setImagePreview(AirplaneData.photo)
			} catch (error) {
				console.error(error)
			}
		}
		fetchAirplane()
	}, [airplaneId])
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await updateAirplane(airplaneId, airplane)
			if (response.status === 200) {
				setSuccessMessage("Airplane updated successfully!")
				const updatedAirplaneData = await getAirplaneById(airplaneId)
				setAirplane(updatedAirplaneData)
				setImagePreview(updatedAirplaneData.photo)
				setErrorMessage("")
			} else {
				setErrorMessage("Error updating Airplane")
			}
		} catch (error) {
			console.error(error)
			setErrorMessage(error.message)
		}
	}
	return (
		<div className="container mt-5 mb-5">
			<h3 className="text-center mb-5 mt-5">Edit Airplane</h3>
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					{successMessage && (
						<div className="alert alert-success" role="alert">
							{successMessage}
						</div>
					)}
					{errorMessage && (
						<div className="alert alert-danger" role="alert">
							{errorMessage}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="AirplaneType" className="form-label hotel-color">
								Airplane Type
							</label>
							<input
								type="text"
								className="form-control"
								id="AirplaneType"
								name="AirplaneType"
								value={airplane.AirplaneType}
								onChange={handleInputChange}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="AirplanePrice" className="form-label hotel-color">
								Airplane Price
							</label>
							<input
								type="number"
								className="form-control"
								id="AirplanePrice"
								name="AirplanePrice"
								value={airplane.ticketPrice}
								onChange={handleInputChange}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="photo" className="form-label hotel-color">
								Photo
							</label>
							<input
								required
								type="file"
								className="form-control"
								id="photo"
								name="photo"
								onChange={handleImageChange}
							/>
							{imagePreview && (
								<img
									src={`data:image/jpeg;base64,${imagePreview}`}
									alt="Airplane preview"
									style={{ maxWidth: "400px", maxHeight: "400" }}
									className="mt-3"
								/>
							)}
						</div>
						<div className="d-grid gap-2 d-md-flex mt-2">
							<Link to={"/existing-Airplanes"} className="btn btn-outline-info ml-5">
								Back
							</Link>
							<button type="submit" className="btn btn-outline-warning">
								Edit Airplane
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default EditAirplane
