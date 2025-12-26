# FinBoard - Customizable Finance Dashboard

A powerful, customizable finance dashboard builder that allows users to create their own real-time finance monitoring dashboard by connecting to various financial APIs and displaying data through customizable widgets.

## Features

### 🎯 Core Features

- **Widget Management System**
  - Add multiple widget types (Table, Finance Cards, Charts)
  - Remove unwanted widgets
  - Drag-and-drop to rearrange widget positions
  - Configure each widget with custom settings

- **Widget Types**
  - **Table Widget**: Paginated list/grid of stocks with filters and search
  - **Finance Cards**: Display watchlist, market gainers, performance data, and financial data
  - **Charts**: Line and candlestick charts showing stock prices over different intervals (Daily, Weekly, Monthly)
  
- **Advanced Features**
  - **Candlestick Charts**: Visualize OHLC (Open, High, Low, Close) data with color-coded candles
  - **Advanced Filtering**: Column-specific filters, multi-column sorting, and global search
  - **Widget Resizing**: Resize widgets to customize your dashboard layout (sizes persist)

- **API Integration**
  - Support for Alpha Vantage API (default)
  - Support for Finnhub API
  - Custom API endpoint support
  - Dynamic data mapping from API responses
  - Intelligent caching to optimize API calls
  - Real-time updates with configurable refresh intervals

- **User Interface**
  - Fully responsive design
  - Dark/Light theme switching
  - Loading and error states
  - Intuitive widget configuration panel
  - Interactive JSON explorer for field selection

- **Data Persistence**
  - Browser localStorage integration
  - Complete dashboard restoration on page refresh
  - Export/Import dashboard configurations

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Data Visualization**: Recharts
- **Drag & Drop**: @dnd-kit
- **API Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FinBoard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
```

### Getting API Keys

#### Alpha Vantage
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Generate an API key
4. Note: Free tier has 5 API calls per minute and 500 calls per day

#### Finnhub
1. Visit [Finnhub](https://finnhub.io/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes 60 API calls per minute

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding a Widget

1. Click the "Add Widget" button in the header
2. Select the widget type (Table, Card, or Chart)
3. Configure the widget:
   - Enter a title
   - (Optional) Provide API endpoint and API key
   - For cards, select the card type
4. Click "Add Widget"

### Configuring a Widget

1. Hover over a widget and click the settings icon
2. In the configuration panel:
   - Update the widget title
   - Set API endpoint and key
   - Configure refresh interval
   - Click "Fetch Preview" to see API response
   - Select fields from the available fields list
   - For charts, configure chart type and time interval
3. Click "Save Changes"

### Rearranging Widgets

- Click and drag the grip icon (⋮⋮) on any widget to reorder
- Widgets will automatically save their positions

### Exporting/Importing Configuration

- **Export**: Click the download icon in the header to export your dashboard configuration as JSON
- **Import**: Click the upload icon and select a previously exported JSON file

### Theme Switching

- Click the moon/sun icon in the header to toggle between light and dark themes

## Project Structure

```
FinBoard/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── Dashboard.tsx         # Main dashboard component
│   ├── Header.tsx            # Header with controls
│   ├── WidgetContainer.tsx   # Widget wrapper with drag-drop
│   ├── AddWidgetModal.tsx    # Modal for adding widgets
│   ├── WidgetConfigPanel.tsx # Widget configuration panel
│   └── widgets/
│       ├── TableWidget.tsx   # Table widget component
│       ├── CardWidget.tsx    # Card widget component
│       └── ChartWidget.tsx   # Chart widget component
├── lib/
│   ├── api/
│   │   └── financeApi.ts     # API integration layer
│   └── utils/
│       └── dataMapper.ts     # Data mapping utilities
├── store/
│   └── dashboardStore.ts     # Zustand store for state management
└── public/                   # Static assets
```

## API Rate Limits

### Alpha Vantage
- Free tier: 5 calls per minute, 500 calls per day
- Premium: Higher limits available

### Finnhub
- Free tier: 60 calls per minute
- Paid plans: Higher limits

**Note**: The application includes intelligent caching to minimize API calls and handle rate limits gracefully.

## Features Implementation Status

✅ Widget Management System  
✅ API Integration (Alpha Vantage, Finnhub)  
✅ Drag-and-Drop Functionality  
✅ Widget Configuration Panel  
✅ Data Persistence  
✅ Dark/Light Theme  
✅ Export/Import Functionality  
✅ Responsive Design  
✅ Loading & Error States  
✅ **Candlestick Charts** (NEW)  
✅ **Advanced Filtering** (NEW)  
✅ **Widget Resizing** (NEW)  

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Import the project in Netlify
3. Add environment variables
4. Deploy

<img width="1340" height="588" alt="image" src="https://github.com/user-attachments/assets/1e1f0d2c-bdd4-46f1-9137-a0d6955c39f3" />


