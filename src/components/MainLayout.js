import React from "react";

function MainLayout({ children }) {
    return (
        <div className="w-full pt-16">
            {/* Header */}
            {children}
            {/* Footer */}
        </div>
    )
}

export default MainLayout