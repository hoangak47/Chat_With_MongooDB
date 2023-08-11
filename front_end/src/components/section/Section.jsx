function Section({ children, className = '' }) {
    return (
        <div className="bg-[#1F1F22] ">
            <div
                className={`container m-auto lg:max-w-screen-lg md:px-8 px-1 h-24 flex items-center justify-between ${className}`}
            >
                {children}
            </div>
        </div>
    );
}

export default Section;
