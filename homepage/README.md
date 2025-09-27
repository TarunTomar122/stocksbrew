# StocksBrew Homepage - Next.js

A modern, responsive homepage for the StocksBrew AI-powered stock newsletter service, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Email Subscription**: Users can subscribe to the newsletter
- **Stock Selection**: Interactive stock picker with search functionality
- **Image Upload**: OCR-powered portfolio analysis (simulated)
- **Modern UI**: Glass morphism effects and smooth animations
- **Baserow Integration**: Subscription data storage
- **Accessibility**: Proper focus states and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: React 18
- **Deployment**: Vercel-ready
- **OCR**: Tesseract.js (for image processing)

## 📁 Project Structure

```
homepage/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main homepage
│   ├── unsubscribe/
│   │   └── page.tsx        # Unsubscribe page
│   └── globals.css         # Global styles and Tailwind
├── components/
│   ├── AnimatedBackground.tsx
│   ├── Header.tsx
│   ├── SubscriptionForm.tsx
│   ├── StockSearch.tsx
│   └── ImageUpload.tsx
├── lib/
│   ├── baserow.ts          # Baserow API integration
│   └── stocks.ts           # Stock data and utilities
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
## 🔐 Environment Variables

Create `homepage/.env.local` with:

```
# Server-only
MONGODB_URI="mongodb+srv://tarat:MdPEmuTeirGstRTw@stockbrew-stuff.crq15ni.mongodb.net/?retryWrites=true&w=majority&appName=stockbrew-stuff"
BASEROW_API_TOKEN="5UHsBFtKEM1r8j5FtKxNpGD4vuZliUiO"
```

The client uses internal API routes (`/api/subscribe`, `/api/unsubscribe`) so the Baserow token is never exposed to the browser.
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Features Breakdown

### Email Subscription
- Email validation and form handling
- Integration with Baserow for data storage
- Success/error state management

### Stock Selection
- 300+ Indian stocks database
- Real-time search functionality
- Visual feedback for selected stocks
- Minimum 3 stocks requirement validation

### Image Upload & OCR
- Portfolio screenshot analysis
- Simulated OCR processing with Tesseract.js
- Automatic stock symbol extraction
- Progress indicators and status feedback

### UI/UX Features
- Glass morphism design effects
- Smooth animations and transitions
- Responsive grid layouts
- Custom Tailwind animations
- Loading states and error handling

## 🔧 Configuration

### Tailwind CSS
Custom theme configuration in `tailwind.config.js` with:
- Custom color palette
- Animation keyframes
- Glass morphism utilities

### Next.js
- Static export configuration for Vercel
- TypeScript path aliases (@/*)
- Optimized image handling

## 🌐 Deployment

The project is configured for Vercel deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   The project uses `output: 'export'` for static deployment.

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: sm, md, lg, xl
- **Flexible grid layouts**
- **Touch-friendly interactions**

## 🔐 Environment Variables

No environment variables required for basic functionality. All configurations are in the codebase.

## 🎯 Performance Optimizations

- **Static export** for fast loading
- **Optimized images** with Next.js Image component
- **Tree-shaking** for minimal bundle size
- **CSS optimization** with Tailwind purging

## 🧪 Testing

The app includes:
- TypeScript type checking
- ESLint for code quality
- Responsive design testing utilities

## 📞 API Integration

### Baserow Integration
- Subscription data storage
- Unsubscribe functionality
- Error handling and validation

### Stock Data
- 300+ Indian stocks
- Real-time search
- Symbol extraction from text/images

## 🔄 Migration Notes

This project was migrated from a vanilla HTML/CSS/JS setup to Next.js while maintaining:
- All existing functionality
- Design consistency
- API integrations
- User experience

## 🛡️ Security

- Input validation
- XSS protection
- CSRF protection (Next.js built-in)
- Type safety with TypeScript

## 📈 Future Enhancements

- Real OCR integration
- Advanced analytics
- User dashboard
- Email templates
- A/B testing capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and confidential. 