AWS Pricing Calculator & Architecture Costing Tool
A modern, full-stack application that allows users to programmatically generate AWS Workload Estimates. This tool bridges the gap between architectural design and cost estimation by providing a direct deep-link to the AWS Billing Console for any modeled workload.
🚀 Key Features
Programmatic Cost Modeling: Uses the new AWS bcm-pricing-calculator API to create official estimates.
Dynamic Link Generation: Generates a secure URL leading directly to the AWS Console.
Auto-Account Detection: Uses AWS STS to automatically fetch the 12-digit Account ID, ensuring zero manual input for billing IDs.
Data Validation Layer: Implements custom logic to sanitize project names and line-item keys to meet strict AWS regex constraints.
Cross-App Integration: Provides a navigation bridge back to the AWS Architecture Diagram Generator.
🛠️ Technology Stack
Frontend: Vite + React.js (Fast, modern build tool)
Backend: Python + FastAPI (High-performance asynchronous API framework)
AWS SDK: Boto3 (Specifically utilizing bcm-pricing-calculator and sts services)
Styling: Tailwind CSS / Custom CSS
📂 Project Structure
code
Text
aws-price-calculator/
├── backend/
│   ├── .env               # AWS Credentials (NOT tracked by git)
│   ├── main.py            # FastAPI Logic & Boto3 Integration
│   └── requirements.txt   # Python Dependencies
├── frontend/
│   ├── src/
│   │   └── App.jsx        # React UI Logic
│   ├── package.json       # Node Dependencies
│   └── vite.config.js
└── .gitignore             # Safety: Ignores node_modules and .env
⚙️ Installation & Setup
1. Prerequisites
Python 3.8+
Node.js & npm
AWS IAM User with bcm-pricing-calculator:* and sts:GetCallerIdentity permissions.
2. Backend Setup
Navigate to the backend folder:
code
Bash
cd backend
Install dependencies:
code
Bash
pip install -r requirements.txt
Create a .env file and add your credentials:
code
Env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
Start the Python server:
code
Bash
python main.py
3. Frontend Setup
Navigate to the frontend folder:
code
Bash
cd frontend
Install dependencies:
code
Bash
npm install
Start the development server:
code
Bash
npm run dev
🧠 Independent Exploration: Solving AWS Constraints
During the development of this project, I independently explored the AWS BCM Pricing Calculator API and solved several non-documented constraints:
Regex Validation: Solved the ValidationException by implementing a clean_name() function that sanitizes strings to match AWS's strict [a-zA-Z0-9-]+ patterns.
Key Constraints: Discovered that the line-item key must be alphanumeric only and under 10 characters, a restriction much tighter than standard AWS resource tags.
Regional Logic: Identified that while the pricing data is global, the API endpoint is managed primarily through us-east-1.
🔗 Connection to Architecture Diagram Tool
This project is designed to work in tandem with the Architecture Diagram Generator.
Workflow: Design the architecture -> Extract the list of resources -> Use this tool to generate a professional cost estimate for the supervisor/client.
📝 License
This project was developed as an independent exploration project for AWS Automation.
