import React from 'react';

const Navigation = ({ navItems, activeScreen, setActiveScreen }) => {
    const baseItemClasses = "flex items-center p-3 rounded-lg transition-colors duration-200 w-full text-left";
    const activeItemClasses = "bg-gray-700 text-white";
    const inactiveItemClasses = "text-gray-400 hover:bg-gray-700 hover:text-white";

    const baseMobileItemClasses = "flex flex-col items-center justify-center flex-1 p-2 transition-colors duration-200";
    const activeMobileItemClasses = "text-blue-500";
    const inactiveMobileItemClasses = "text-gray-500 hover:text-blue-500";

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 rounded-l-2xl">
                <div className="text-2xl font-bold mb-10 pl-2">Fin-AI</div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => setActiveScreen(item.name)}
                            className={`${baseItemClasses} ${activeScreen === item.name ? activeItemClasses : inactiveItemClasses}`}
                        >
                            <item.icon size={20} />
                            <span className="ml-4 font-semibold">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setActiveScreen(item.name)}
                        className={`${baseMobileItemClasses} ${activeScreen === item.name ? activeMobileItemClasses : inactiveMobileItemClasses}`}
                    >
                        <item.icon size={20} />
                        <span className="text-xs font-medium mt-1">{item.name}</span>
                    </button>
                ))}
            </nav>
        </>
    );
};

export default Navigation;