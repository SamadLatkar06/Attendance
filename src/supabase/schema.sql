-- Create extension for UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  enrollment_number VARCHAR(100),
  department VARCHAR(255),
  phone VARCHAR(20),
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(255),
  semester INT,
  credits INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student-Subject enrollment
CREATE TABLE student_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, subject_id)
);

-- Attendance sessions (created by teacher)
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  college_latitude DECIMAL(10, 8) NOT NULL,
  college_longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INT DEFAULT 100,
  minimum_duration_minutes INT DEFAULT 45,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table (GPS-based automatic)
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  session_id UUID REFERENCES attendance_sessions(id) ON DELETE SET NULL,
  attendance_date DATE NOT NULL,
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP,
  duration_minutes INT,
  entry_latitude DECIMAL(10, 8),
  entry_longitude DECIMAL(11, 8),
  is_marked BOOLEAN DEFAULT FALSE,
  attendance_type VARCHAR(50) DEFAULT 'gps' CHECK (attendance_type IN ('gps', 'manual')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manual attendance logs
CREATE TABLE manual_attendance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  marked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location tracking (for analytics)
CREATE TABLE location_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy INT,
  tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_subjects_teacher_id ON subjects(teacher_id);
CREATE INDEX idx_student_subjects_student_id ON student_subjects(student_id);
CREATE INDEX idx_student_subjects_subject_id ON student_subjects(subject_id);
CREATE INDEX idx_attendance_sessions_teacher_id ON attendance_sessions(teacher_id);
CREATE INDEX idx_attendance_sessions_subject_id ON attendance_sessions(subject_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_subject_id ON attendance(subject_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_session_id ON attendance(session_id);
CREATE INDEX idx_manual_attendance_student_id ON manual_attendance_logs(student_id);
CREATE INDEX idx_manual_attendance_teacher_id ON manual_attendance_logs(teacher_id);
CREATE INDEX idx_location_tracking_user_id ON location_tracking(user_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_tracking ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON attendance
  FOR SELECT USING (auth.uid() = student_id);

-- Teachers can view attendance for their subjects
CREATE POLICY "Teachers can view subject attendance" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM subjects WHERE subjects.id = attendance.subject_id AND subjects.teacher_id = auth.uid()
    )
  );
