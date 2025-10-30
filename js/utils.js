/* ============================================
   UTILS - Fonctions utilitaires
   ============================================ */

// Afficher une notification temporaire
function showNotification(message, type = 'success') {
    const colors = {
        success: { bg: '#2ea44f', border: '#2c974b' },
        warning: { bg: '#fb8500', border: '#e07b00' },
        error: { bg: '#cf222e', border: '#a40e26' }
    };
    
    const color = colors[type] || colors.success;
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: white;
        padding: 14px 24px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        border: 2px solid ${color.border};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
