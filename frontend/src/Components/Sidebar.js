import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBed, faUser, faHistory, faList } from "@fortawesome/free-solid-svg-icons";

export default class Sidebar extends React.Component {
    constructor() {
        super()
        this.state = {
            role: "",

        }
        this.state.role = localStorage.getItem("role")
    }

    logOut = () => {
        if (window.confirm("Are you sure to logout")) {
            window.location = '/'
            localStorage.clear()
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            localStorage.removeItem("email")
            localStorage.removeItem("username")
        }
    }

    checkRole = () => {
        if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
            localStorage.clear()
            window.alert("You're not admin or resepsionis!")
            window.location = '/'
        }
    }

    componentDidMount() {
        this.checkRole()
    }

    render() {
        return (

            <aside
                className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-white"
            >
                <div className="sidebar-header flex items-center justify-center py-4">
                    <div className="inline-flex">
                        <a href="#" className="inline-flex flex-row items-center">
                            <img src="/assets/logo.png" className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20" />
                            <span className="leading-10 text-blue-600 text-2xl font-bold ml-1 uppercase">Slippy</span>
                        </a>
                    </div>
                </div>
                <div className="sidebar-content px-4 py-6">
                    <ul className="flex flex-col w-full">
                        <li className="my-px">
                            <a
                                href="/dashboard"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span className="mr-2 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faHome} color="blue" />
                                </span>
                                <span className="ml-3">Dashboard</span>
                            </a>
                        </li>
                        <li className="my-px">
                            <a
                                href="/typeroom"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span className="mr-2 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faBed} color="blue" />
                                </span>
                                <span className="ml-3">Type Room</span>
                            </a>
                        </li>
                        <li className="my-px">
                            <a
                                href="/room"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span className="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faList} color="blue" />
                                </span>
                                <span className="ml-3">Room</span>
                            </a>
                        </li>
                        <li className="my-px">
                            <a
                                href="/user"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span className="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faUser} color="blue" />
                                </span>
                                <span className="ml-4">User</span>
                            </a>
                        </li>
                        {/* <li className="my-px">
                            <a
                                href="/customer"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span className="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faUsers} color="blue" />
                                </span>
                                <span className="ml-2">Customer</span>
                            </a>
                        </li> */}
                        <li className="my-px">
                            <a
                                href="/historytransaksi"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
                            >
                                <span className="mr-3 flex items-center justify-center text-lg text-gray-400">
                                    <FontAwesomeIcon icon={faHistory} color="blue" />
                                </span>
                                <span className="ml-3">History Transaksi</span>
                            </a>
                        </li>
                        <li className="my-px" onClick={() => this.logOut()}>
                            <a
                                href="/"
                                className="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 mt-32"
                            >
                                <span className="mr-3 flex items-center justify-center text-lg text-red-400">
                                    <svg
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                            />
                                    </svg>
                                </span>
                                <span className="ml-2" onClick={() => this.logOut()}>Logout</span>
                            </a>
                        </li>
                    </ul>

                </div>
            </aside>

        )
    }
}