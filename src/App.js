import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import AdminDashboard from "./pages/AdminDashboard";
import { AdminProposal } from "./pages/AdminProposal";
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import { CourseDetail } from './pages/CourseDetail';
import { ViewQuiz } from "./pages/ViewQuiz";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import AuthVerify from './components/AuthVerify';
import CreateNewCourse from './pages/CreateNewCourse';
import Unauthorized from './pages/Unauthorized';
import EditCourse from './pages/EditCourse';

library.add(fas)

function App() {
  return (
    <BrowserRouter>
      <AuthVerify>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard/admin' element={<AdminDashboard />} />
          <Route path='/dashboard/student' element={<StudentDashboard />} />
          <Route path='/dashboard/instructor' element={<InstructorDashboard />} />
          <Route path='/proposal' element={<AdminProposal />} />
          <Route path='/course/:id' element={<CourseDetail />} />
          <Route path='/quiz' element={<ViewQuiz />} />
          <Route path='/create-course' element={<CreateNewCourse />} />
          <Route path='/edit-course/:id' element={<EditCourse />} />
          <Route path='/403' element={<Unauthorized />} />
          <Route path='/quiz/:id' element={<ViewQuiz />} />
        </Routes>
      </AuthVerify>
    </BrowserRouter>
  )
}

export default App;
