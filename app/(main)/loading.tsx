export default function MainLoading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-fc-blue animate-bounce delay-75"></div>
                <div className="h-3 w-3 rounded-full bg-fc-blue animate-bounce delay-150"></div>
                <div className="h-3 w-3 rounded-full bg-fc-blue animate-bounce delay-300"></div>
            </div>
        </div>
    )
}
