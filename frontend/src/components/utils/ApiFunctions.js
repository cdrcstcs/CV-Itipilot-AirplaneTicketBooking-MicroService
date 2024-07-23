import axios from "axios"
export const api = axios.create({
	baseURL: "http://localhost:9192"
})
export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	}
}
export async function addAirplane(photo, airplaneType, ticketPrice, capacity, departureDate, landingDate) {
	const formData = new FormData()
	formData.append("photo", photo)
	formData.append("airplaneType", airplaneType)
	formData.append("ticketPrice", ticketPrice)
	formData.append("capacity", capacity)
	formData.append("departureDate", departureDate)
	formData.append("landingDate", landingDate)
	const response = await api.post("/airplanes/add/new-airplane", formData,{
		headers: getHeader()
	})
	if (response.status === 201) {
		return true
	} else {
		return false
	}
}
export async function getAirplaneTypes() {
	try {
		const response = await api.get("/airplanes/airplane/types")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}
}
export async function getAllAirplanes() {
	try {
		const result = await api.get("/airplanes/all-airplanes")
		return result.data
	} catch (error) {
		throw new Error("Error fetching rooms")
	}
}
export async function deleteAirplane(airplaneId) {
	try {
		const result = await api.delete(`/airplanes/delete/airplane/${airplaneId}`, {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}
export async function updateAirplane(airplaneId, airplaneData) {
	const formData = new FormData()
	formData.append("airplaneType", airplaneData.airplaneType)
	formData.append("ticketPrice", airplaneData.ticketPrice)
	formData.append("photo", airplaneData.photo)
	formData.append("capacity", airplaneData.capacity)
	formData.append("departureDate", airplaneData.departureDate)
	formData.append("landingDate", airplaneData.landingDate)
	const response = await api.put(`/airplanes/update/${airplaneId}`, formData,{
		headers: getHeader()
	})
	return response
}
export async function getAirplaneById(airplaneId) {
	try {
		const result = await api.get(`/airplanes/airplane/${airplaneId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching airplane ${error.message}`)
	}
}
export async function bookSeat(airplaneId, seat) {
	try {
		const response = await api.post(`/seats/airplane/${airplaneId}/seat`, seat)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error seat airplane : ${error.message}`)
		}
	}
}
export async function getAllSeats() {
	try {
		const result = await api.get("/seats/all-seats", {
			headers: getHeader()
		})
		return result.data
	} catch (error) {
		throw new Error(`Error fetching seats : ${error.message}`)
	}
}
export async function getSeatByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/seats/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find seat : ${error.message}`)
		}
	}
}
export async function cancelSeat(seatId) {
	try {
		const result = await api.delete(`/seats/seat/${seatId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling seat :${error.message}`)
	}
}
export async function getAvailableAirplanes(departureDate, landingDate, airplaneType) {
	const result = await api.get(
		`airplanes/available-airplanes?departureDate=${departureDate}
		&landingDate=${landingDate}&airplaneType=${airplaneType}`
	)
	return result
}
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.reeponse && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}
export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}
export async function getUserProfile(userId, token) {
	try {
		const response = await api.get(`users/profile/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		return error.message
	}
}
export async function getUser(userId, token) {
	try {
		const response = await api.get(`/users/${userId}`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		throw error
	}
}
export async function getSeatsByUserId(userId, token) {
	try {
		const response = await api.get(`/seats/user/${userId}/seats`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching seats:", error.message)
		throw new Error("Failed to fetch seats")
	}
}
