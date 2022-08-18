import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProposal } from "./pages/AdminProposal";
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import { CourseDetail } from './pages/CourseDetail';
import { ViewQuiz } from "./pages/ViewQuiz";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import AuthVerify from './components/AuthVerify';
import CreateNewCourse from './pages/CreateNewCourse';

library.add(fas)

function App() {
  return (
    <BrowserRouter>
      <AuthVerify>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path='/dashboard/student' element={<StudentDashboard />} />
          <Route path='/dashboard/instructor' element={<InstructorDashboard />} />
          <Route path='/proposal' element={<AdminProposal />} />
          <Route path='/course' element={<CourseDetail />} />
          <Route path='/quiz' element={<ViewQuiz />} />
          <Route path='/create-course' element={<CreateNewCourse />} />
        </Routes>
      </AuthVerify>
    </BrowserRouter>
  )
}

export default App;
