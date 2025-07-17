import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { PriorityProvider } from './context/PriorityContext';
import { UserProvider } from './context/UserContext';
import { useState } from 'react';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingScreen from './components/common/LoadingScreen';
import NotificationCenter from './components/notifications/NotificationCenter';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import Tasks from './pages/tasks/Tasks';
import CreateTask from './pages/tasks/CreateTask';
import EditTask from './pages/tasks/EditTask';
import TaskDetails from './pages/tasks/TaskDetails';
import Projects from './pages/projects/Projects';
import CreateProject from './pages/projects/CreateProject';
import EditProject from './pages/projects/EditProject';
import ProjectDetails from './pages/projects/ProjectDetails';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import PrioritySettings from './pages/settings/PrioritySettings';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return element;
};

// Public Route Component (for auth pages)
const PublicRoute = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <NotificationCenter />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProjectProvider>
          <TaskProvider>
            <PriorityProvider>
              <UserProvider>
                <Router>
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<PublicRoute element={<Login />} />} />
                    <Route path="/register" element={<PublicRoute element={<Register />} />} />
                    <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <Dashboard />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    
                    {/* Tasks Routes */}
                    <Route
                      path="/tasks"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <Tasks />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/tasks/create"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <CreateTask />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/tasks/:id/edit"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <EditTask />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/tasks/:id"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <TaskDetails />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    
                    {/* Projects Routes */}
                    <Route
                      path="/projects"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <Projects />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/projects/create"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <CreateProject />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/projects/:id/edit"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <EditProject />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/projects/:id"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <ProjectDetails />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    
                    {/* Users Routes */}
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <Users />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/users/create"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <CreateUser />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/users/:id/edit"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <EditUser />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    
                    {/* Reports Routes */}
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <Reports />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    
                    {/* Settings Routes */}
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <Settings />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    <Route
                      path="/settings/priorities"
                      element={
                        <ProtectedRoute
                          element={
                            <MainLayout>
                              <PrioritySettings />
                            </MainLayout>
                          }
                        />
                      }
                    />
                    
                    {/* 404 Route - protected as well */}
                    <Route path="*" element={<ProtectedRoute element={<NotFound />} />} />
                  </Routes>
                </Router>
              </UserProvider>
            </PriorityProvider>
          </TaskProvider>
        </ProjectProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;