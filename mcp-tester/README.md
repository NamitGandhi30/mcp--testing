# MCP Server Tester

A web application for testing MCP (Model Control Protocol) servers. This application allows you to verify connectivity and functionality of MCP servers using installation codes from marketplaces like Smithery.

## Features

- Simple and intuitive user interface
- Real-time connection verification
- Functional testing capabilities
- Clear error reporting and status updates
- Modern, responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd mcp-tester
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend

1. Navigate to the backend directory:
   ```bash
   cd mcp-tester-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3001`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter your MCP installation code in the input field
3. Click "Verify Connection" to check if the server is reachable
4. Click "Run Test" to perform a functional test of the MCP server
5. View the results in the response area below the buttons

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if the installation code is correct
   - Verify that the MCP server is running and accessible
   - Check your internet connection

2. **Invalid Installation Code**
   - Ensure the code follows the correct format
   - Double-check for any typos
   - Verify the code is from a supported marketplace

3. **Server Errors**
   - Check the backend console for detailed error messages
   - Verify that all required environment variables are set
   - Ensure the backend server is running

## Deployment

### Frontend (Netlify)

1. Build the frontend:
   ```bash
   cd mcp-tester
   npm run build
   ```

2. Deploy the `dist` directory to Netlify

### Backend (Vercel)

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
