import React from 'react'

export default class Header extends React.Component {
    constructor(){
        super()
        this.state = {
            role: "",
            email : "",
            // nama_user : ""

        }

        this.state.role = localStorage.getItem("role")
        this.state.email = localStorage.getItem("email")
        // this.state.nama_user = localStorage.getItem("nama_user")
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
            <header className="header bg-white shadow py-4 px-4">
                <div className="header-content flex items-center flex-row">
                    <form action="#">
                        <div className="hidden md:flex relative">
                        <h1 className="font-bold text-2xl text-gray-700">Dashboard</h1>
                        </div> 
                        
                        <div className="flex md:hidden">
                            <a href="#" className="flex items-center justify-center h-10 w-10 border-transparent">
                                <svg
                                    className="h-6 w-6 text-gray-500"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </a>
                        </div>
                    </form>
                    <div className="flex ml-auto">
                        <a href className="flex flex-row items-center">
                            <img
                                src="/assets/5856.jpg"
                                alt=""
                                className="h-10 w-10 bg-gray-200 border rounded-full"
                            />
                            <span className="flex flex-col ml-2">
                                <span className="truncate w-40 font-semibold tracking-wide leading-none">{this.state.email}</span>
                                <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">{this.state.role}</span>
                            </span>
                        </a>
                    </div>
                </div>
            </header>
        )
    }

}