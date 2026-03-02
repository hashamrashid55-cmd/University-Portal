/**
 * UNIVERSITY PORTAL - CORE LOGIC
 * Handles Data Persistence (LocalStorage) and Shared Utilities
 */

const DB_KEY = 'nuces_portal_v9_final';

class DataManager {
    constructor() {
        const stored = localStorage.getItem(DB_KEY);
        this.db = stored ? JSON.parse(stored) : this.initData();
    }

    save() { localStorage.setItem(DB_KEY, JSON.stringify(this.db)); }

    initData() {
        return {
            users: [
                { id: 'admin', name: 'System Admin', role: 'admin', password: '123' },
                { id: 'teacher', name: 'Dr. Talha Dar', role: 'teacher', password: '123' },
                { id: 'student', name: 'Muhammad Ahmad', role: 'student', password: '123' }
            ],
            courses: [
                { code: 'SE1001', name: 'Intro to Software Engineering', teacherId: 'teacher', credits: 3 },
                { code: 'CS2001', name: 'Data Structures', teacherId: 'teacher', credits: 4 }
            ],
            enrollments: [
                { courseCode: 'SE1001', studentId: 'student' },
                { courseCode: 'CS2001', studentId: 'student' }
            ],
            attendance: [],
            assessments: [],
            marks: [],
            finalGrades: [] 
        };
    }

    // --- User Management ---
    getUser(id) { return this.db.users.find(u => u.id === id); }
    getUsersByRole(role) { return this.db.users.filter(u => u.role === role); }
    addUser(user) { 
        if(this.getUser(user.id)) return false; 
        this.db.users.push(user); 
        this.save(); 
        return true; 
    }

    // --- Course Management ---
    getCourses() { return this.db.courses; }
    addCourse(course) {
        if(this.db.courses.find(c => c.code === course.code)) return false;
        this.db.courses.push(course);
        this.save();
        return true;
    }
    getTeacherCourses(tid) { return this.db.courses.filter(c => c.teacherId === tid); }
    getStudentCourses(sid) {
        const codes = this.db.enrollments.filter(e => e.studentId === sid).map(e => e.courseCode);
        return this.db.courses.filter(c => codes.includes(c.code));
    }
    getEnrollments(code) { return this.db.enrollments.filter(e => e.courseCode === code); }

    // --- Attendance ---
    addAttendance(records) {
        const { date, courseCode } = records[0];
        // Remove old records for same date to prevent duplicates
        this.db.attendance = this.db.attendance.filter(a => !(a.date === date && a.courseCode === courseCode));
        this.db.attendance.push(...records);
        this.save();
    }
    getStudentAttendance(sid, code) { return this.db.attendance.filter(a => a.studentId === sid && a.courseCode === code); }

    // --- Assessments & Marks ---
    createAssessment(assessment) {
        assessment.id = Date.now().toString();
        this.db.assessments.push(assessment);
        this.save();
        return assessment.id;
    }
    getAssessments(courseCode) { return this.db.assessments.filter(a => a.courseCode === courseCode); }
    
    saveMarks(marksList) {
        marksList.forEach(m => {
            const idx = this.db.marks.findIndex(ex => ex.assessmentId === m.assessmentId && ex.studentId === m.studentId);
            if(idx !== -1) this.db.marks[idx] = m;
            else this.db.marks.push(m);
        });
        this.save();
    }
    getObtainedMarks(assessmentId, studentId) {
        const rec = this.db.marks.find(m => m.assessmentId === assessmentId && m.studentId === studentId);
        return rec ? parseFloat(rec.obtainedMarks) : 0;
    }

    // --- Final Grades ---
    saveFinalGrade(gradeRec) {
        const idx = this.db.finalGrades.findIndex(g => g.courseCode === gradeRec.courseCode && g.studentId === gradeRec.studentId);
        if(idx !== -1) this.db.finalGrades[idx] = gradeRec;
        else this.db.finalGrades.push(gradeRec);
        this.save();
    }
    getStudentGrade(sid, code) { return this.db.finalGrades.find(g => g.studentId === sid && g.courseCode === code); }
}

const db = new DataManager();

// --- SHARED UI HELPERS ---
const utils = {
    toast: (msg) => {
        const t = document.getElementById('toast');
        document.getElementById('toast-msg').innerText = msg;
        t.style.transform = 'translateX(0)';
        setTimeout(() => t.style.transform = 'translateX(100%)', 2500);
    },
    
    // Check if user is logged in
    checkAuth: (requiredRole) => {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'index.html';
            return null;
        }
        if (requiredRole && user.role !== requiredRole) {
            alert('Access Denied');
            window.location.href = 'index.html';
            return null;
        }
        // Update Sidebar Info if element exists
        if(document.getElementById('nav-user-name')) {
            document.getElementById('nav-user-name').innerText = user.name;
            document.getElementById('nav-user-role').innerText = user.role;
        }
        return user;
    },

    logout: () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
};