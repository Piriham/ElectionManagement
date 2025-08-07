# Election Management System

A comprehensive web-based election management system designed to streamline the entire electoral process. The system manages voter registration, candidate management, constituency administration, poll booth operations, and election officials with secure authentication and real-time data management.

## Project Overview

This Election Management System provides a complete solution for managing electoral processes including voter registration, candidate management, constituency administration, and poll booth operations. Built with modern web technologies, it ensures secure, efficient, and transparent election management.

## Features

- **User Authentication**: Secure login/registration system with role-based access control
- **Voter Management**: Complete voter registration, verification, and information management
- **Candidate Management**: Candidate registration, profile management, and election participation
- **Constituency Administration**: Constituency creation, management, and voter distribution
- **Poll Booth Operations**: Poll booth setup, EVM management, and voter assignment
- **Official Management**: Election official registration and assignment to constituencies
- **Party Management**: Political party registration and candidate association
- **Election Management**: Election scheduling, seat allocation, and result tracking
- **Real-time Data**: Live updates and real-time information retrieval
- **Database Triggers**: Automated age calculation and data integrity maintenance

## Technology Stack

- **Backend**: Python Flask, MySQL Database
- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: MySQL with stored procedures and triggers
- **Authentication**: Flask-Bcrypt for password hashing
- **Styling**: Tailwind CSS
- **APIs**: RESTful API with CORS support

## Project Structure

```
election-management/
├── backend/                 # Flask API server
│   └── app.py             # Main Flask application with all endpoints
├── frontend/              # Next.js web application
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   │   ├── loginpage/    # Login functionality
│   │   │   ├── register/     # Registration pages
│   │   │   ├── information/  # Information display
│   │   │   ├── query/        # Query interfaces
│   │   │   ├── edit/         # Edit functionality
│   │   │   ├── delete/       # Delete operations
│   │   │   └── update/       # Update operations
│   │   └── components/    # Reusable React components
├── electiondb.sql         # Database schema and setup
├── requirements.txt       # Python dependencies
└── docs/                 # Documentation and reports
```

## Database Schema

### Core Tables
- **constituency**: Electoral constituencies with voter counts
- **poll_booth**: Polling stations with EVM management
- **voter**: Voter registration and information
- **candidate**: Candidate profiles and election participation
- **official**: Election officials and their assignments
- **party**: Political parties and their details
- **election**: Election scheduling and management
- **login**: User authentication and role management

### Key Features
- **Automated Triggers**: Age calculation, ID generation, data integrity
- **Stored Procedures**: Complex queries and data operations
- **Foreign Key Constraints**: Referential integrity
- **Unique Constraints**: Data validation and consistency

## Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 8.0+
- Git

### Database Setup

1. **Install MySQL** and create a database:
```bash
mysql -u root -p
CREATE DATABASE electiondb;
```

2. **Import the database schema**:
```bash
mysql -u root -p electiondb < electiondb.sql
```

3. **Create environment variables** (create `.env` file in backend directory):
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=electiondb
DB_PORT=3306
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Usage

1. **Start the backend server** (Flask API on port 5000)
2. **Start the frontend development server** (Next.js on port 3000)
3. **Access the web application** at http://localhost:3000
4. **Register/Login** with appropriate credentials
5. **Navigate through different modules** based on your role

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Voter Management
- `GET /getVoterDetails` - Get voter information
- `POST /api/voters` - Add new voter
- `POST /updateVoter` - Update voter details
- `POST /deleteVoter` - Delete voter record

### Candidate Management
- `GET /getCandidateDetails` - Get candidate information
- `POST /api/candidates` - Add new candidate
- `POST /updateCandidate` - Update candidate details
- `POST /deleteCandidate` - Delete candidate record
- `POST /registerCandidate` - Register candidate for election

### Constituency Management
- `GET /getConstituencyDetails` - Get constituency information
- `GET /api/constituencies` - List all constituencies
- `POST /api/constituencies` - Add new constituency

### Poll Booth Management
- `GET /api/pollbooths` - List all poll booths
- `POST /api/pollbooths` - Add new poll booth

### Official Management
- `GET /getOfficialDetails` - Get official information
- `POST /api/officials` - Add new official
- `POST /updateOfficial` - Update official details
- `POST /deleteOfficial` - Delete official record

### Party Management
- `GET /getPartyDetails` - Get party information
- `POST /updateParty` - Update party details
- `POST /deleteParty` - Delete party record

### Election Management
- `GET /api/elections` - List all elections
- `POST /api/elections` - Add new election

## User Roles

- **Voter**: View personal information and constituency details
- **Candidate**: Manage profile and election participation
- **Official**: Manage election operations and voter data
- **Administrator**: Full system access and management

## Database Features

### Automated Triggers
- **Age Calculation**: Automatic age updates based on date of birth
- **ID Generation**: Automatic ID generation for voters, candidates, and officials
- **Data Integrity**: Prevents deletion of constituencies/poll booths with active voters

### Stored Procedures
- **getconsinfo**: Retrieve constituency information for voters
- **Complex Queries**: Optimized data retrieval and processing

## Contributing

This is a capstone project for final year studies. For academic purposes only.

## License

Academic project - not for commercial use.

## Authors

- **Manish P** - PES1UG22CS332
- **Priyam R** - PES1UG22CS453

## Project Reports

- Complete project documentation available in `dbms project report.pdf`
- Test cases and screenshots in `TestCaseScreenshots.docx`
- Database test cases in `DBMSTestcases.xlsx`
