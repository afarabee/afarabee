# Papa's Brick Builder

A colorful, kid-friendly web app that identifies LEGO bricks from photos using AI vision technology!

Built with love for Papa and all LEGO enthusiasts who want to discover what bricks they have and what they can build with them.

---

## Features

- **AI-Powered Brick Recognition** - Uses Anthropic's Claude Vision API to identify LEGO bricks from photos
- **Camera Capture** - Take photos directly from your device's camera
- **Image Upload** - Drag and drop or select images from your device
- **LEGO Set Discovery** - Find official LEGO sets that contain your identified bricks via Rebrickable
- **Building Instructions** - Links to building instructions for discovered sets
- **Kid-Friendly UI** - Big, colorful buttons perfect for all ages
- **Fun Facts** - Learn interesting facts about each brick type

---

## Tech Stack

**Frontend:**
- React 18 with Vite
- Custom CSS with LEGO-themed design
- Responsive, mobile-first layout

**Backend:**
- Node.js with Express
- Anthropic Claude Vision API for image recognition
- Rebrickable API for LEGO database and instructions

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Rebrickable API key ([Get one here](https://rebrickable.com/api/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/afarabee/afarabee.git
   cd afarabee
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   ```

   Edit `server/.env` and add your API keys:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   REBRICKABLE_API_KEY=your_rebrickable_api_key_here
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

---

## Project Structure

```
papas-brick-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── styles/         # CSS stylesheets
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── services/
│   │   ├── visionService.js      # Anthropic Vision API
│   │   └── rebrickableService.js # Rebrickable API
│   ├── index.js            # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/identify` | POST | Identify LEGO bricks from an image |
| `/api/parts/search` | GET | Search for LEGO parts by name |
| `/api/parts/:partNum` | GET | Get details for a specific part |
| `/api/parts/:partNum/sets` | GET | Get sets containing a specific part |

---

## Usage

1. **Take a Photo** - Click the camera button to capture a photo of your LEGO brick
2. **Or Upload** - Drag and drop an image or click to select from your files
3. **Get Results** - The AI will identify your brick and show:
   - Brick name and part number
   - Category and dimensions
   - Color information
   - Fun facts about the brick
4. **Discover Sets** - See which official LEGO sets use this brick
5. **View Instructions** - Click through to Rebrickable for building instructions

---

## Tips for Best Results

- Use good lighting when photographing bricks
- Place the brick on a contrasting background
- Try to capture the brick from an angle that shows its distinctive features
- Single bricks work best for identification

---

## License

MIT

---

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for the Claude Vision API
- [Rebrickable](https://rebrickable.com/) for the comprehensive LEGO database
- All the LEGO fans who inspire creativity!

---

Made with love for Papa and LEGO builders everywhere!
