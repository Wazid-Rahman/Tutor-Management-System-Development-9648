-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users_dgtutor_2024 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'tutor', 'parent', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects_dgtutor_2024 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students_dgtutor_2024 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_username TEXT,
  grade TEXT NOT NULL,
  subject_id UUID REFERENCES subjects_dgtutor_2024(id),
  tutor_id UUID REFERENCES users_dgtutor_2024(id),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Trial', 'Idle', 'Hold', 'Finished')),
  fee_per_session DECIMAL(10,2) DEFAULT 0,
  last_paid DATE,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions_dgtutor_2024 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students_dgtutor_2024(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  month_name TEXT NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create currency_settings table
CREATE TABLE IF NOT EXISTS currency_settings_dgtutor_2024 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code TEXT NOT NULL DEFAULT 'USD',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default currency setting
INSERT INTO currency_settings_dgtutor_2024 (currency_code) VALUES ('USD')
ON CONFLICT DO NOTHING;

-- Insert default subjects
INSERT INTO subjects_dgtutor_2024 (name) VALUES 
  ('Math'),
  ('Science'),
  ('English'),
  ('AP Subjects'),
  ('College Subjects'),
  ('Physics'),
  ('Chemistry'),
  ('Biology'),
  ('History'),
  ('Computer Science')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user with new credentials
INSERT INTO users_dgtutor_2024 (name, username, email, password_hash, role, status, permissions) VALUES 
  ('Administrator', 'admin@gmail.com', 'admin@gmail.com', '1234', 'admin', 'active', '{"canViewStudents": true, "canEditStudents": true, "canDeleteStudents": true, "canManageSessions": true, "canViewReports": true, "canManageUsers": true}')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_parent_username ON students_dgtutor_2024(parent_username);
CREATE INDEX IF NOT EXISTS idx_students_tutor_id ON students_dgtutor_2024(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions_dgtutor_2024(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions_dgtutor_2024(session_date);
CREATE INDEX IF NOT EXISTS idx_users_username ON users_dgtutor_2024(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users_dgtutor_2024(role);

-- Enable Row Level Security
ALTER TABLE users_dgtutor_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects_dgtutor_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_dgtutor_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_dgtutor_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_settings_dgtutor_2024 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON users_dgtutor_2024
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON subjects_dgtutor_2024
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON students_dgtutor_2024
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON sessions_dgtutor_2024
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON currency_settings_dgtutor_2024
  FOR ALL USING (true) WITH CHECK (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users_dgtutor_2024 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students_dgtutor_2024 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions_dgtutor_2024 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();