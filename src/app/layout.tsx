import {Outlet} from "react-router-dom"

export default function Layout () {

    return (
        <div className="flex min-h-screen w-full">
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}