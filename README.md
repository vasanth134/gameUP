# GameUP - Gamified Child Task Tracker

A modern, gamified task management system designed to make household chores and responsibilities fun for families. Parents can assign tasks to their children, track progress, and reward completion with XP points.

## 🎯 Project Overview

GameUP transforms mundane household tasks into an engaging game-like experience. Children earn XP points for completing tasks, while parents can easily assign, monitor, and review submissions. The platform includes real-time notifications, progress tracking, and a comprehensive dashboard for both parents and children.

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Uploads**: Multer middleware for handling task submission files
- **API Design**: RESTful API with proper error handling and validation

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context API for authentication state
- **Routing**: React Router for SPA navigation
- **UI Components**: Custom component library with reusable elements

### Database Schema
- **Users**: Unified table supporting both parents and children with role-based access
- **Tasks**: Comprehensive task management with XP rewards and due dates
- **Submissions**: File and text submissions with approval workflow
- **Notifications**: Real-time notification system for task updates

## ✨ Key Features

### Core Functionality
- **Role-Based Authentication**: Separate login flows for parents and children
- **Task Management**: Create, assign, and track tasks with due dates and XP rewards
- **Submission System**: Children can submit text responses and file uploads
- **Approval Workflow**: Parents can approve, reject, or request changes to submissions
- **XP System**: Gamified point system with progress tracking
- **Real-time Notifications**: Instant updates for task assignments and status changes

### Enhanced Features
- **Dynamic Status Updates**: Parents can update task status at any time via dedicated API endpoint
- **File Upload Support**: Image and document submission capabilities
- **Progress Visualization**: XP progress charts and achievement tracking
- **Responsive Design**: Mobile-first design that works on all devices
- **Protected Routes**: Secure navigation with authentication guards
- **Error Handling**: Comprehensive error management with user-friendly messages

### Extra Features Added
1. **Advanced Task Status Management**: 
   - Implemented `PUT /api/tasks/:taskId/status` endpoint for flexible status updates
   - Allows parents to change task status independently of submissions
   - Validates status values against database constraints

2. **Enhanced Submission Workflow**:
   - Automatic submission creation when parents update task status
   - Maintains data integrity between tasks and submissions tables
   - Comprehensive error handling for edge cases

3. **Improved User Experience**:
   - Modern UI with Tailwind CSS
   - Consistent component library
   - Loading states and error feedback
   - Intuitive navigation with role-specific layouts

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gameUP
   ```

2. **Set up the backend**
   ```bash
   cd task-tracker-backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=task_tracker
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb task_tracker
   
   # Run initialization script
   psql -d task_tracker -f init.sql
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

6. **Set up the frontend**
   ```bash
   cd ../gamified-task-frontend
   npm install
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Sample Accounts
The database includes pre-configured test accounts:

**Parent Account:**
- Email: parent@test.com
- Password: password123

**Child Account:**
- Email: child@test.com
- Password: password123

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Task Management
- `GET /api/tasks` - Get tasks (filtered by user role)
- `POST /api/tasks` - Create new task (parent only)
- `PUT /api/tasks/:taskId/status` - Update task status (parent only)
- `GET /api/tasks/child/:childId` - Get tasks for specific child

### Submissions
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Create submission (child only)
- `PUT /api/submissions/:id/review` - Review submission (parent only)

### Notifications
- `GET /api/notifications/:childId` - Get notifications for child
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🛠️ Development Approach

### Backend Design Principles
1. **Separation of Concerns**: Clear separation between routes, controllers, and database logic
2. **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
3. **Validation**: Input validation at multiple levels (route, controller, database)
4. **Security**: JWT authentication, password hashing, and SQL injection prevention
5. **Database Design**: Normalized schema with proper foreign key relationships

### Frontend Architecture
1. **Component-Based**: Reusable UI components with TypeScript interfaces
2. **Context Management**: Centralized authentication state with React Context
3. **Protected Routing**: Authentication guards for secure navigation
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Type Safety**: Full TypeScript implementation for better developer experience

### Key Technical Decisions
1. **TypeScript**: Chosen for better type safety and developer experience
2. **PostgreSQL**: Selected for robust relational data handling and ACID compliance
3. **JWT Authentication**: Stateless authentication for scalability
4. **React Context**: Simple state management solution for this application size
5. **Tailwind CSS**: Utility-first CSS for rapid, consistent styling

## 🧪 Testing

### Backend Testing
The backend includes comprehensive error handling and validation:
- Input validation for all endpoints
- Database constraint validation
- JWT token verification
- File upload validation

### Manual Testing Performed
- User registration and login flows
- Task creation and assignment
- Submission workflow (create, review, approve/reject)
- Status update functionality
- File upload capabilities
- Cross-browser compatibility testing

## 🚀 Deployment Considerations

### Environment Setup
- Use environment variables for all sensitive configuration
- Configure database connection pooling for production
- Set up proper CORS configuration
- Enable HTTPS in production

### Database Migration
- The `init.sql` file handles table creation and sample data
- Consider using migration tools for production deployments
- Implement proper backup and recovery procedures

## 🔮 Future Enhancements

1. **Real-time Updates**: WebSocket integration for live notifications
2. **Achievement System**: Badges and milestones for completed tasks
3. **Calendar Integration**: Due date visualization and scheduling
4. **Advanced Analytics**: Task completion statistics and trends
5. **Mobile App**: React Native implementation for native mobile experience
6. **Bulk Operations**: Multiple task assignment and management
7. **Task Templates**: Reusable task templates for common chores
8. **Family Groups**: Support for multiple children and parents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by gamification principles in education and family management
- Designed with user experience and accessibility in mind

---

**GameUP** - Making household tasks fun, one XP point at a time! 🎮✨
