function AuthImagePattern({ title, subtitle }) {
    return (
        <div className="hidden bg-base-200 lg:flex h-full  flex-col justify-center items-center gap-5">
            <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-24 w-24 rounded-2xl bg-primary/30 ${
                            i % 2 === 1 ? "animate-pulse" : ""
                        }`}
                    ></div>
                ))}
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-center px-4">{subtitle}</p>
        </div>
    );
}

export default AuthImagePattern;