# Attendora Smart Attendance

This version separates each entry point into its own HTML file so the login pages do not overlap or share a role selector.

## Pages

- `index.html` — workspace chooser
- `admin-login.html` — administrator login
- `faculty-login.html` — faculty login
- `student-login.html` — student login using an email or student ID
- `dashboard.html` — role-aware workspace after sign-in
- `css/style.css` — shared responsive styling and alignment fixes
- `js/auth.js` — separate role authentication and session setup
- `js/script.js` — workspace pages, attendance records, charts, and local demo interactions

## Demo credentials

| Workspace | Login | Password |
|---|---|---|
| Admin | `admin@cloud.edu` | `admin123` |
| Faculty | `FAC-081` or `riya.menon@cloud.edu` | `faculty081` |
| Student | Any listed student email or ID, such as `aarav.mehta@cloud.edu` or `STU-2401` | `student123` |

The project is a front-end demo. Accounts and attendance records are stored in browser `localStorage`; no production authentication service is connected.

## New role features

The faculty login reads the current faculty directory from `localStorage`, so every listed faculty ID or email—and any faculty record added through the admin workspace—can use its account password. The default faculty accounts also accept the shared faculty password `faculty123` for demo compatibility. The student login similarly reads the current student directory, so each listed student email or ID opens that student’s own record.

Both student and faculty workspaces now include personal-information cards. Faculty members can open `Attendance`, choose one of their assigned classes from the class dropdown, see the enrolled students for that class, mark each student `Present`, `Late`, or `Absent`, and save the class register. Class-specific records are saved in `cloud-class-attendance` and the shared attendance summary is updated for reporting.

## Corrected role permissions

Students now have access only to `Dashboard` and `Attendance`. They see their own personal information and their own subject-wise attendance records; report pages, student directories, faculty directories, and institution-wide resources are blocked even when a restricted URL is entered directly.

Administrators can view institution-wide reports and manage both directories. From the admin workspace, use `Students → Add student` or `Faculty → Add faculty` to register a new account. Student registration stores the student name, institution email, ID, academic details, attendance percentage, and login password. Faculty registration additionally stores comma-separated assigned class IDs, which controls the classes visible in that faculty member’s Attendance and Teaching reports.

Faculty accounts have separate logins. Each faculty member sees only classes owned by their faculty email or explicitly assigned class IDs. The demo catalog gives each default faculty account multiple classes, and the faculty member can select among those classes in the Attendance register before marking Present, Late, or Absent.

Default class IDs for faculty assignment are `CS-601-A`, `CS-602-A`, `IT-604-B`, `EC-501-C`, `CS-603-A`, `CS-604-A`, `IT-605-B`, and `EC-502-C`.


## Attendora role experience

The product is branded as **Attendora Smart Attendance**. A student dashboard is intentionally profile-only: it shows the signed-in student’s personal and academic information. Students open `Attendance` to see their attendance distribution and a class-wise table of every enrolled subject.

Faculty members use the dedicated faculty login with either their faculty ID or institution email. The default faculty accounts are independent and accept the following account passwords; the shared `faculty123` demo password remains accepted for backwards compatibility.

| Faculty | ID | Email | Account password |
| --- | --- | --- | --- |
| Dr. Riya Menon | FAC-081 | riya.menon@cloud.edu | faculty081 |
| Prof. Arvind Rao | FAC-082 | arvind.rao@cloud.edu | faculty082 |
| Dr. Neha Gupta | FAC-083 | neha.gupta@cloud.edu | faculty083 |
| Prof. Sameer Shah | FAC-084 | sameer.shah@cloud.edu | faculty084 |

Each faculty member has more than one assigned class. The faculty Attendance page provides a class selector, a larger enrolled-student roster, Present/Late/Absent controls, live summary counts, and a save action. Workspace illustrations use contained, bottom-aligned image rules so they stay inside their cards without cropping or overlapping text.
