import React from "react"
import { Link } from "react-router-dom"
const Admin = () => {
	return (
		<section className="container mt-5">
			<h2>Welcome to Adimin Panel</h2>
			<hr />
			<Link to={"/existing-airplanes"}>Manage Airplanes</Link> <br />
			<Link to={"/existing-seats"}>Manage Seats</Link>
		</section>
	)
}
export default Admin
