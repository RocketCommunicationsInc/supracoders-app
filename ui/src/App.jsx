import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudentStack, InstructorStack, Body, Header} from './components';
import Login from './components/Login/Login';
import { AstroTheme } from './themes/AstroTheme';
import { AppIcons } from './AppIcons';

const App = () => {
  return (
    <ThemeProvider theme={createTheme(AstroTheme)}>
      <AppIcons />
      <Router>
        <Header />
        <Body>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/student' element={<StudentStack />} />
            <Route path='/instructor' element={<InstructorStack />} />
            <Route path='*' element={<Login />} />
          </Routes>
        </Body>
      </Router>
    </ThemeProvider>
  );
};

export default App;
