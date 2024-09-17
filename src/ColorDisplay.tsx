import React from "react";
import './ColorDisplay.css';

interface ColorDisplayProps {
    colors: string[];
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ colors }) => {
    return (
        <div className="color-container">
            <div className="color-grid">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color}}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default ColorDisplay;