export const sidebarItems = [
  { id: 1, name: 'Dashboard', path: '/user' },
  { id: 2, name: 'Resume Builder', path: 'resume-builder' },
  { id: 3, name: 'Enroll Course', path: 'enroll-course' },
  {
    id: 4,
    name: 'Candidate Management',
    subMenu: [
      { id: 5, name: 'Candidate Information', path: 'candidate-info' },
      { id: 6, name: 'Schedule Interview', path: 'schedule-interview' },
      { id: 7, name: 'Interview Progress', path: 'interview-progress' }
    ]
  },
  { id: 8, name: 'Live Interview', path: 'live-interview' },
  { id: 9, name: 'AI Career Coach', path: 'ai-career-coatch' },
  { id: 10, name: 'Mock Practice', path: 'practical-exam' },
  { id: 11, name: 'Enroll Course History', path: 'enroll-course-history' },
]

export const adminrole = [
  { id: 1, name: 'Dashboard', path: '/admin' },
  {
    id: 2,
    name: 'Course Management',
    subMenu: [
      { id: 3, name: 'Course List', path: 'course-list' },
      { id: 4, name: 'Course Information', path: 'course-info' }
    ]
  },
  { id: 3, name: 'Role Management', path: 'role-management' },
  { id: 4, name: 'Skill Management', path: 'skill-management' },
  { id: 5, name: 'Recruiter Management', path: 'recruiter-management' },
  
]

export const Recruiterrole = [
  { id: 1, name: 'Interview Review', path: '/recruiter' },
]
