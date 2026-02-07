
-- =======================================================
-- POLYTECHNIC PORTAL SUPABASE SETUP SCRIPT
-- Version: 1.2
-- Description: Idempotent script to create all tables,
--              roles, functions, and RLS policies.
--              Can be run multiple times safely.
-- =======================================================

--
-- =======================================================
-- 0. INITIAL CLEANUP (MAKES THE SCRIPT IDEMPOTENT)
-- =======================================================
--
-- Drop dependent objects first.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_user_role();

-- Drop tables using CASCADE to handle dependencies.
DROP TABLE IF EXISTS public.hostel_requests CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.library_loans CASCADE;
DROP TABLE IF EXISTS public.library_books CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.financial_records CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.results CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;

-- Drop the custom type after all dependencies are removed.
DROP TYPE IF EXISTS public.user_role;

--
-- =======================================================
-- 1. EXTENSIONS & CUSTOM TYPES
-- =======================================================
--
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- Define a custom type for all user roles in the system
CREATE TYPE public.user_role AS ENUM (
    'Student', 'Lecturer', 'Admissions_Officer', 'Registrar', 'Admin', 'Exams_Officer', 'Hostel_Manager', 'Librarian', 'Bursar'
);


--
-- =======================================================
-- 2. CREATE ALL REQUIRED TABLES
-- =======================================================
--

-- Stores student master records
CREATE TABLE public.students (
    id text NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    matric_number text UNIQUE,
    application_number text UNIQUE,
    department text,
    level text,
    email text UNIQUE,
    phone text,
    address text,
    avatar_url text,
    session text,
    semester text,
    status text,
    permission_level integer DEFAULT 1,
    application_fee_paid boolean DEFAULT false,
    is_registered boolean DEFAULT false,
    is_fees_cleared boolean DEFAULT false,
    is_hostel_fee_paid boolean DEFAULT false,
    is_jamb_verified boolean DEFAULT false
);

-- Extends auth.users to include roles and link to student records
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at timestamp with time zone,
    full_name text,
    avatar_url text,
    role public.user_role NOT NULL,
    student_id text UNIQUE REFERENCES public.students(id) ON DELETE SET NULL
);

-- Stores course master list
CREATE TABLE public.courses (
    code text NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    units integer,
    type text,
    prerequisites text[],
    department text
);

-- Stores student grades for courses
CREATE TABLE public.results (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    student_id text REFERENCES public.students(id) ON DELETE CASCADE,
    course_code text REFERENCES public.courses(code) ON DELETE CASCADE,
    course_title text,
    units integer,
    grade text,
    score integer,
    session text,
    semester text
);

-- Stores student uploaded documents
CREATE TABLE public.documents (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    student_id text REFERENCES public.students(id) ON DELETE CASCADE,
    name text,
    type text,
    file_type text,
    file_size bigint,
    upload_date date,
    status text DEFAULT 'Pending Verification',
    url text
);

-- Summarizes student financial status
CREATE TABLE public.financial_records (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    student_id text NOT NULL UNIQUE REFERENCES public.students(id) ON DELETE CASCADE,
    total_fees numeric DEFAULT 0,
    amount_paid numeric DEFAULT 0,
    balance numeric GENERATED ALWAYS AS (total_fees - amount_paid) STORED,
    is_cleared boolean GENERATED ALWAYS AS ((total_fees - amount_paid) <= 0) STORED,
    payment_status text
);

-- Logs individual financial transactions
CREATE TABLE public.transactions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    student_id text REFERENCES public.students(id) ON DELETE CASCADE,
    amount numeric,
    category text,
    reference text,
    status text,
    payment_channel text,
    verified_by uuid REFERENCES auth.users(id)
);

-- Stores library book master list
CREATE TABLE public.library_books (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    title text,
    author text,
    isbn text UNIQUE,
    category text,
    total_copies integer,
    available_copies integer,
    shelf_location text
);

-- Tracks library book loans
CREATE TABLE public.library_loans (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    book_id uuid REFERENCES public.library_books(id),
    member_id text REFERENCES public.students(id),
    issue_date date,
    due_date date,
    return_date date,
    status text,
    fine_amount numeric DEFAULT 0
);

-- Stores hostel rooms
CREATE TABLE public.rooms (
    id text NOT NULL PRIMARY KEY,
    hostel_name text,
    room_number text,
    type_id text,
    capacity integer,
    occupants text[],
    is_under_maintenance boolean DEFAULT false
);

-- Stores student hostel requests
CREATE TABLE public.hostel_requests (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    student_id text REFERENCES public.students(id),
    student_name text,
    matric_number text,
    preferred_type_id text,
    date_requested timestamp with time zone DEFAULT now(),
    status text DEFAULT 'Pending'
);


--
-- =======================================================
-- 3. TRIGGERS & HELPER FUNCTIONS
-- =======================================================
--
-- Function to automatically create a profile for a new user, defaulting to 'Student' role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'avatar_url', 'Student');
  RETURN NEW;
END;
$$;

-- Trigger to execute the function on new user sign-up.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function to get the role of the currently logged-in user.
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;


--
-- =======================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================
--
-- First, enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_requests ENABLE ROW LEVEL SECURITY;

-- == PROFILES TABLE POLICIES ==
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (get_user_role() = 'Admin');

-- == STUDENTS TABLE POLICIES ==
CREATE POLICY "Students can view their own record" ON public.students FOR SELECT USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = id);
CREATE POLICY "Students can update their contact info" ON public.students FOR UPDATE USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = id) WITH CHECK (true);
CREATE POLICY "Staff can view all student records" ON public.students FOR SELECT USING (get_user_role() <> 'Student');
CREATE POLICY "Registrar/Admissions can create/update student records" ON public.students FOR ALL USING (get_user_role() IN ('Admin', 'Registrar', 'Admissions_Officer'));

-- == FINANCIAL RECORDS & TRANSACTIONS POLICIES ==
CREATE POLICY "Students can view their own financial records" ON public.financial_records FOR SELECT USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = student_id);
CREATE POLICY "Students can view their own transactions" ON public.transactions FOR SELECT USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = student_id);
CREATE POLICY "Bursary staff can manage all financial data" ON public.financial_records FOR ALL USING (get_user_role() IN ('Admin', 'Bursar'));
CREATE POLICY "Bursary staff can manage all transactions" ON public.transactions FOR ALL USING (get_user_role() IN ('Admin', 'Bursar'));
CREATE POLICY "Relevant staff can view financial records for clearance" ON public.financial_records FOR SELECT USING (get_user_role() IN ('Admin', 'Bursar', 'Exams_Officer', 'Hostel_Manager'));

-- == ACADEMIC (COURSES & RESULTS) POLICIES ==
CREATE POLICY "Authenticated users can view all courses" ON public.courses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Registrar can manage courses" ON public.courses FOR ALL USING (get_user_role() IN ('Admin', 'Registrar'));
CREATE POLICY "Students can see their own results" ON public.results FOR SELECT USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = student_id);
CREATE POLICY "Exams/Lecturer/Registrar can manage results" ON public.results FOR ALL USING (get_user_role() IN ('Admin', 'Exams_Officer', 'Lecturer', 'Registrar'));

-- == RESOURCE MANAGEMENT (LIBRARY, HOSTEL) POLICIES ==
CREATE POLICY "Authenticated users can view library books" ON public.library_books FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Librarian can manage library assets and loans" ON public.library_books FOR ALL USING (get_user_role() IN ('Admin', 'Librarian'));
CREATE POLICY "Librarian can manage library loans" ON public.library_loans FOR ALL USING (get_user_role() IN ('Admin', 'Librarian'));
CREATE POLICY "Students can see their own loans" ON public.library_loans FOR SELECT USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = member_id);
CREATE POLICY "Hostel Manager can manage rooms and requests" ON public.rooms FOR ALL USING (get_user_role() IN ('Admin', 'Hostel_Manager'));
CREATE POLICY "Hostel Manager can manage hostel requests" ON public.hostel_requests FOR ALL USING (get_user_role() IN ('Admin', 'Hostel_Manager'));
CREATE POLICY "Students can manage their own hostel requests" ON public.hostel_requests FOR ALL USING ((SELECT student_id FROM public.profiles WHERE id = auth.uid()) = student_id);


--
-- =======================================================
-- 5. SEED DATA (Sample Staff & Student Data)
-- =======================================================
--
-- == IMPORTANT INSTRUCTIONS FOR CREATING STAFF USERS ==
-- 1. Go to your Supabase Dashboard -> Authentication -> Users.
-- 2. Click "Add user" and create users with the following emails (or your own):
--    - student@test.com
--    - admin@test.com
--    - bursar@test.com
--    - registrar@test.com
--    - lecturer@test.com
--    - librarian@test.com
--    - examsofficer@test.com
--    - hostelmanager@test.com
--    - admissionsofficer@test.com
-- 3. Run the SQL UPDATE statements below to assign roles to these users.

-- == SEED SCRIPT ==

-- Insert sample students
INSERT INTO public.students (id, name, matric_number, application_number, department, level, email, phone, avatar_url, session, semester, status, permission_level, is_fees_cleared, is_jamb_verified) VALUES
('STU001', 'Adebayo Chukwuemeka', 'POLY/CS/21/001', 'APP-2023-12345', 'Computer Science', 'ND II', 'student@test.com', '+2348012345678', 'https://i.pravatar.cc/150?u=student1', '2023/2024', 'First Semester', 'Admitted', 3, true, true),
('STU002', 'Jane Doe', 'POLY/EE/21/002', 'APP-2023-12346', 'Electrical Engineering', 'ND II', 'student2@test.com', '+2348012345679', 'https://i.pravatar.cc/150?u=student2', '2023/2024', 'First Semester', 'Admitted', 3, false, true);

-- Link auth users to profiles and assign roles. The handle_new_user trigger creates the initial profile,
-- so here we just update the role for staff members.
-- NOTE: Run these only *after* creating the users in the Supabase Auth dashboard.
-- UPDATE public.profiles SET role = 'Admin', full_name = 'Super Admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');
-- UPDATE public.profiles SET role = 'Bursar', full_name = 'Mr. Finance' WHERE id = (SELECT id FROM auth.users WHERE email = 'bursar@test.com');
-- UPDATE public.profiles SET role = 'Registrar', full_name = 'Mrs. Records' WHERE id = (SELECT id FROM auth.users WHERE email = 'registrar@test.com');
-- UPDATE public.profiles SET role = 'Lecturer', full_name = 'Dr. Anya' WHERE id = (SELECT id FROM auth.users WHERE email = 'lecturer@test.com');
-- UPDATE public.profiles SET role = 'Librarian', full_name = 'Mr. Books' WHERE id = (SELECT id FROM auth.users WHERE email = 'librarian@test.com');
-- UPDATE public.profiles SET role = 'Exams_Officer', full_name = 'Mr. Grades' WHERE id = (SELECT id FROM auth.users WHERE email = 'examsofficer@test.com');
-- UPDATE public.profiles SET role = 'Hostel_Manager', full_name = 'Mrs. Comfort' WHERE id = (SELECT id FROM auth.users WHERE email = 'hostelmanager@test.com');
-- UPDATE public.profiles SET role = 'Admissions_Officer', full_name = 'Mr. Welcome' WHERE id = (SELECT id FROM auth.users WHERE email = 'admissionsofficer@test.com');
-- UPDATE public.profiles SET student_id = 'STU001' WHERE id = (SELECT id FROM auth.users WHERE email = 'student@test.com');

-- Insert other sample data...
INSERT INTO public.financial_records (student_id, total_fees, amount_paid, payment_status) VALUES
('STU001', 100000, 100000, 'Fully Paid'),
('STU002', 100000, 50000, 'Part Payment');

INSERT INTO public.courses (code, title, units, type, department) VALUES
('COM 211', 'Java I', 3, 'Compulsory', 'Computer Science'),
('COM 212', 'Web Development', 3, 'Compulsory', 'Computer Science');

INSERT INTO public.results (student_id, course_code, course_title, units, grade, score, session, semester) VALUES
('STU001', 'COM 211', 'Java I', 3, 'A', 82, '2023/2024', 'First Semester');

INSERT INTO public.library_books (title, author, isbn, category, total_copies, available_copies, shelf_location) VALUES
('Clean Code', 'Robert C. Martin', '978-0132350884', 'Software Engineering', 10, 8, 'A1-01');

INSERT INTO public.rooms (id, hostel_name, room_number, type_id, capacity, occupants) VALUES
('RM101', 'Queen Amina Hall', 'A101', 'RT1', 4, '{}');

INSERT INTO public.hostel_requests (student_id, student_name, matric_number, preferred_type_id) VALUES
('STU002', 'Jane Doe', 'POLY/EE/21/002', 'RT1');

-- End of script
