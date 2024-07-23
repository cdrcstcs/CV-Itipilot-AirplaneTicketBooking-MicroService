import React, { useEffect, useState } from "react";
import { getAirplaneById, updateAirplane } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";

const EditAirplane = () => {
  const { airplaneId } = useParams();

  const [airplane, setAirplane] = useState({
    photo: "",
    airplaneType: "",
    ticketPrice: "", // Use string to represent decimal for precision
    capacity: "",
    departureDate: null, // Initialize as Date object or null
    landingDate: null    // Initialize as Date object or null
  });

  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setAirplane({ ...airplane, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "departureDate" || name === "landingDate") {
      setAirplane({ ...airplane, [name]: new Date(value) }); // Convert string to Date
    } else if (name === "ticketPrice") {
      setAirplane({ ...airplane, [name]: value.toString() }); // Treat ticketPrice as string for precision
    } else {
      setAirplane({ ...airplane, [name]: value });
    }
  };

  useEffect(() => {
    const fetchAirplane = async () => {
      try {
        const airplaneData = await getAirplaneById(airplaneId);
        // Ensure departureDate and landingDate are Date objects
        airplaneData.departureDate = airplaneData.departureDate ? new Date(airplaneData.departureDate) : null;
        airplaneData.landingDate = airplaneData.landingDate ? new Date(airplaneData.landingDate) : null;
        setAirplane(airplaneData);
        setImagePreview(airplaneData.photo);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAirplane();
  }, [airplaneId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert departureDate and landingDate back to ISO string format
      const updatedAirplane = {
        ...airplane,
        departureDate: airplane.departureDate ? airplane.departureDate.toISOString() : null,
        landingDate: airplane.landingDate ? airplane.landingDate.toISOString() : null
      };
      const response = await updateAirplane(airplaneId, updatedAirplane);
      if (response.status === 200) {
        setSuccessMessage("Airplane updated successfully!");
        const updatedAirplaneData = await getAirplaneById(airplaneId);
        // Convert departureDate and landingDate from ISO string to Date object
        updatedAirplaneData.departureDate = updatedAirplaneData.departureDate ? new Date(updatedAirplaneData.departureDate) : null;
        updatedAirplaneData.landingDate = updatedAirplaneData.landingDate ? new Date(updatedAirplaneData.landingDate) : null;
        setAirplane(updatedAirplaneData);
        setImagePreview(updatedAirplaneData.photo);
        setErrorMessage("");
      } else {
        setErrorMessage("Error updating Airplane");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

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
              <label htmlFor="airplaneType" className="form-label hotel-color">
                Airplane Type
              </label>
              <input
                type="text"
                className="form-control"
                id="airplaneType"
                name="airplaneType"
                value={airplane.airplaneType}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ticketPrice" className="form-label hotel-color">
                Ticket Price
              </label>
              <input
                type="text" // Use text input to maintain precision as string
                className="form-control"
                id="ticketPrice"
                name="ticketPrice"
                value={airplane.ticketPrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="capacity" className="form-label hotel-color">
                Capacity
              </label>
              <input
                type="number"
                className="form-control"
                id="capacity"
                name="capacity"
                value={airplane.capacity}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="departureDate" className="form-label hotel-color">
                Departure date
              </label>
              <input
                type="date"
                className="form-control"
                id="departureDate"
                name="departureDate"
                value={airplane.departureDate ? airplane.departureDate.toISOString().substr(0, 10) : ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="landingDate" className="form-label hotel-color">
                Landing date
              </label>
              <input
                type="date"
                className="form-control"
                id="landingDate"
                name="landingDate"
                value={airplane.landingDate ? airplane.landingDate.toISOString().substr(0, 10) : ""}
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
                  src={imagePreview}
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
  );
};

export default EditAirplane;
