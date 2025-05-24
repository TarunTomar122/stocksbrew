# StocksBrew Landing Page

A beautiful, responsive landing page for the StocksBrew AI-powered stock newsletter service.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Email Subscription**: Users can enter their email to subscribe to the newsletter
- **Stock Selection**: Interactive stock picker with search functionality
- **Modern UI**: Built with Tailwind CSS and custom animations
- **Data Storage**: Saves subscription data to JSON format
- **Accessibility**: Proper focus states and keyboard navigation

## Files Structure

```
homepage/
├── index.html          # Main landing page
├── script.js           # JavaScript functionality
├── styles.css          # Custom CSS styles and animations
└── README.md          # This file
```

## How to Use

1. **Open the Landing Page**:
   - Simply open `index.html` in any modern web browser
   - No server setup required for basic functionality

2. **User Flow**:
   - Users enter their email address
   - Select at least 3 stocks from the available list
   - Use the search functionality to find specific stocks
   - Submit the form to subscribe

3. **Data Storage**:
   - Subscription data is saved to browser's localStorage
   - A JSON file is automatically downloaded for development purposes
   - In production, this would be sent to a backend server

## Features Breakdown

### Email Subscription
- Email validation
- Required field with proper error handling

### Stock Selection
- 40+ popular stocks available
- Search functionality to filter stocks
- Visual feedback for selected stocks
- Minimum 3 stocks required
- Real-time counter showing selected stocks

### UI/UX Features
- Smooth scrolling navigation
- Hover effects and animations
- Loading states
- Success message after subscription
- Mobile-responsive design
- Custom color scheme matching StocksBrew branding

### Technical Features
- Vanilla JavaScript (no frameworks required)
- Tailwind CSS for styling
- Font Awesome icons
- Local storage for data persistence
- JSON export functionality

## Customization

### Adding More Stocks
Edit the `POPULAR_STOCKS` array in `script.js`:

```javascript
const POPULAR_STOCKS = [
    { symbol: 'NEWSTOCK', name: 'New Company Inc.' },
    // ... existing stocks
];
```

### Changing Colors
Update the Tailwind config in `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#your-color',
                secondary: '#your-color',
                accent: '#your-color'
            }
        }
    }
}
```

### Backend Integration
To connect to a real backend:

1. Replace the `saveSubscriptionData()` function in `script.js`
2. Send data to your API endpoint instead of localStorage
3. Handle server responses and error states

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development Notes

- The page uses CDN links for Tailwind CSS and Font Awesome
- No build process required
- All functionality works offline
- JSON download feature is for development/testing purposes

## Production Considerations

1. **Backend Integration**: Replace localStorage with proper API calls
2. **Email Validation**: Add server-side email validation
3. **Security**: Implement proper form validation and CSRF protection
4. **Analytics**: Add tracking for user interactions
5. **Performance**: Consider lazy loading for stock list if expanded
6. **SEO**: Add proper meta tags and structured data

## Sample Subscription Data Format

```json
[
  {
    "email": "user@example.com",
    "selectedStocks": ["AAPL", "MSFT", "GOOGL", "TSLA"],
    "subscribedAt": "2025-01-27T10:30:00.000Z",
    "status": "active"
  }
]
```

This format can be easily integrated with your existing newsletter generation system. 