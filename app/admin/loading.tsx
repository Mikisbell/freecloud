export default function AdminLoading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce delay-75"></div>
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce delay-150"></div>
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce delay-300"></div>
            </div>
        </div>
    )
}
