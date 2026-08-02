import React from "react";

interface PopUpProps {
    showPopUp: boolean;
    closePopUp: () => void;
    children: React.ReactNode;
}

export const PopUp: React.FC<PopUpProps> = ({showPopUp, closePopUp, children}) => {
    // don't render if popup is closed
    if (!showPopUp) return null;

    return (
        <div className="popup">
            <div className="popup-overlay">
                <button onClick={closePopUp} className="close-popup-button">
                    Close
                </button>
                <div>{children}</div>
            </div>
        </div>
    )
}