import axios from "axios"
export const api = axios.create({
	baseURL: "http://localhost:9192"
})
export const getHeader = () => {
	const token = localStorage.getItem("token")
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "multipart/form-data"
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
		console.log(response.data);
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
export async function bookTicket(airplaneId, ticket) {
	try {
		const response = await api.post(`/tickets/airplane/${airplaneId}/ticket`, ticket)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error ticket airplane : ${error.message}`)
		}
	}
}
export async function getAllTickets() {
	try {
		const result = await api.get("/tickets/all-tickets", {
			headers: getHeader()
		})
		console.log(result.data);
		return result.data
	} catch (error) {
		throw new Error(`Error fetching tickets : ${error.message}`)
	}
}
export async function getTicketByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/tickets/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find ticket : ${error.message}`)
		}
	}
}
export async function cancelTicket(ticketId) {
	try {
		const result = await api.delete(`/tickets/ticket/${ticketId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling ticket :${error.message}`)
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
export async function getticketsByUserId(userId, token) {
	try {
		const response = await api.get(`/tickets/user/${userId}/tickets`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching tickets:", error.message)
		throw new Error("Failed to fetch tickets")
	}
}
