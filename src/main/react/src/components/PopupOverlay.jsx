import React, { useEffect } from 'react';

function PopupOverlay({ recipeData, onClose }) {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('popup-overlay')) {
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    if (!recipeData) return null;

    return (
        <div className="popup-overlay" style={{ display: 'flex' }}>
            <div className="popup-content">
                <div className="popup-header">
                    <div className="popup-title">
                        <div className="ai-icon">AI</div>
                        AI Response
                    </div>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="popup-message">
                    <div className="recipe-container">
                        <img src={recipeData.image} alt={recipeData.title} className="recipe-image" />
                        
                        <div className="recipe-title">{recipeData.title}</div>
                        <div className="recipe-description">{recipeData.description}</div>
                        
                        <div className="recipe-meta">
                            <div className="recipe-meta-item">
                                <span>⏱️</span>
                                <span><strong>Prep:</strong> {recipeData.prepTime}</span>
                            </div>
                            <div className="recipe-meta-item">
                                <span>🍳</span>
                                <span><strong>Cook:</strong> {recipeData.cookTime}</span>
                            </div>
                            <div className="recipe-meta-item">
                                <span>👥</span>
                                <span><strong>Serves:</strong> {recipeData.servings}</span>
                            </div>
                        </div>
                        
                        <div className="recipe-section">
                            <h3>📋 Ingredients</h3>
                            <ul>
                                {recipeData.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="recipe-section">
                            <h3>👨‍🍳 Instructions</h3>
                            <ul className="recipe-steps">
                                {recipeData.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupOverlay;