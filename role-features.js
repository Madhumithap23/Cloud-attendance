const classCatalog = [
  {id:'CS-601-A', code:'CS-601', subject:'Data Structures', department:'Computer Science', semester:'VI', section:'A', room:'C-204', time:'09:00–10:00', facultyEmail:'riya.menon@cloud.edu', faculty:'Dr. Riya Menon'},
  {id:'CS-602-A', code:'CS-602', subject:'Database Management Systems', department:'Computer Science', semester:'VI', section:'A', room:'C-204', time:'10:15–11:15', facultyEmail:'arvind.rao@cloud.edu', faculty:'Prof. Arvind Rao'},
  {id:'IT-604-B', code:'IT-604', subject:'Operating Systems', department:'Information Tech', semester:'VI', section:'B', room:'C-204', time:'11:30–12:30', facultyEmail:'neha.gupta@cloud.edu', faculty:'Dr. Neha Gupta'},
  {id:'EC-501-C', code:'EC-501', subject:'Computer Networks', department:'Electronics', semester:'IV', section:'C', room:'C-204', time:'01:15–02:15', facultyEmail:'sameer.shah@cloud.edu', faculty:'Prof. Sameer Shah'},
  {id:'CS-603-A', code:'CS-603', subject:'Software Engineering', department:'Computer Science', semester:'VI', section:'A', room:'C-204', time:'02:30–03:30', facultyEmail:'riya.menon@cloud.edu', faculty:'Dr. Riya Menon'},
  {id:'CS-604-A', code:'CS-604', subject:'Computer Organization', department:'Computer Science', semester:'VI', section:'A', room:'C-205', time:'03:45–04:45', facultyEmail:'arvind.rao@cloud.edu', faculty:'Prof. Arvind Rao'},
  {id:'IT-605-B', code:'IT-605', subject:'Web Technologies', department:'Information Tech', semester:'VI', section:'B', room:'IT-Lab', time:'09:00–10:00', facultyEmail:'neha.gupta@cloud.edu', faculty:'Dr. Neha Gupta'},
  {id:'EC-502-C', code:'EC-502', subject:'Embedded Systems', department:'Electronics', semester:'IV', section:'C', room:'E-112', time:'02:30–03:30', facultyEmail:'sameer.shah@cloud.edu', faculty:'Prof. Sameer Shah'}
];
const classAttendance = read('cloud-class-attendance', {});
const accountSession = () => read('cloud-user', {});
const statusKey = (classId, studentId) => `${classId}::${studentId}`;
const statusFor = (classId, studentId) => classAttendance[statusKey(classId, studentId)] || attendance[studentId] || 'Present';
const rosterFor = currentClass => students.filter(student =>
  student.department === currentClass.department && student.semester === currentClass.semester && student.section === currentClass.section
);
const persistRoleAttendance = () => {
  localStorage.setItem('cloud-class-attendance', JSON.stringify(classAttendance));
  save();
};
const profileItem = (label, value) => `<div class="profile-detail"><span>${label}</span><b>${esc(value || 'Not provided')}</b></div>`;
const distributionValues = list => ['Present','Absent','Late'].map(status => list.filter(value => value === status).length);

function classDistributionCard(id, title, subtitle, values, totalLabel='Records') {
  return `<section class="card doughnut-card distribution-card"><div class="card-head"><div><div class="card-title">${title}</div><div class="card-subtitle">${subtitle}</div></div></div><div class="chart-box"><canvas id="${id}"></canvas><div class="doughnut-center"><strong>${values.reduce((sum,value)=>sum+value,0)}</strong><small>${totalLabel}</small></div></div></section>`;
}

function renderStudentDashboardEnhanced() {
  const session = accountSession();
  const student = students.find(item => item.email === session.email || item.id === session.id) || students[0];
  qs('#page').innerHTML = pageLead('Student workspace','My profile',`Welcome back, ${student.name}. Your dashboard contains only your personal information.`) +
    `<section class="card profile-card-main profile-only-dashboard"><div class="profile-heading"><div class="profile-initials">${student.name.split(' ').map(item => item[0]).slice(0,2).join('')}</div><div><span class="eyebrow">Personal information</span><h2>${esc(student.name)}</h2><p>${esc(student.id)} · Student account</p></div></div><div class="profile-details">${profileItem('Student ID',student.id)}${profileItem('Email',student.email)}${profileItem('Department',student.department)}${profileItem('Course',student.course)}${profileItem('Semester',student.semester)}${profileItem('Section',student.section)}</div><div class="profile-note">Your class attendance and status-by-subject records are available only under <b>Attendance</b>.</div></section>`;
}

function renderStudentAttendanceEnhanced() {
  const session = accountSession();
  const student = students.find(item => item.email === session.email || item.id === session.id) || students[0];
  const records = classCatalog.filter(currentClass => rosterFor(currentClass).some(item => item.id === student.id));
  const values = distributionValues(records.map(currentClass => statusFor(currentClass.id,student.id)));
  qs('#page').innerHTML = pageLead('Student records','Attendance by class','Review your attendance one class at a time. Your dashboard remains profile-only.') +
    `<div class="profile-grid"><section class="card profile-card-main compact-profile"><div class="profile-heading"><div class="profile-initials">${student.name.split(' ').map(item => item[0]).slice(0,2).join('')}</div><div><span class="eyebrow">Signed-in student</span><h2>${esc(student.name)}</h2><p>${esc(student.email)}</p></div></div><div class="profile-details">${profileItem('Student ID',student.id)}${profileItem('Department',student.department)}${profileItem('Course',student.course)}${profileItem('Semester / Section',`${student.semester} · ${student.section}`)}</div></section>${classDistributionCard('student-attendance-distribution','My attendance distribution','Across enrolled classes',values,'Class records')}</div>
    <section class="card table-card profile-attendance-card"><div class="card-head"><div><div class="card-title">Attendance by class</div><div class="card-subtitle">One row for every class connected to your student account.</div></div><span class="eyebrow">Class-wise view</span></div><div class="table-wrap" style="margin-top:14px"><table class="data-table"><thead><tr><th>Subject</th><th>Faculty</th><th>Time</th><th>Attendance</th></tr></thead><tbody>${records.map(currentClass => `<tr><td><b class="table-primary">${esc(currentClass.subject)}</b><small>${esc(currentClass.code)} · ${esc(currentClass.room)}</small></td><td>${esc(currentClass.faculty)}</td><td>${esc(currentClass.time)}</td><td>${statusBadge(statusFor(currentClass.id,student.id))}</td></tr>`).join('')}</tbody></table></div></section>`;
  chart('student-attendance-distribution','doughnut',['Present','Absent','Late'],[{data:values,backgroundColor:['#0F9F8F','#D45B72','#D89A4A'],borderWidth:0,cutout:'73%'}]);
}

function facultyClasses() {
  const session = accountSession();
  const member = faculty.find(item => item.email === session.email || item.id === session.id) || {};
  const assigned = Array.isArray(member.assignedClassIds)
    ? member.assignedClassIds
    : String(member.assignedClassIds || '').split(',').map(item => item.trim()).filter(Boolean);
  return classCatalog.filter(currentClass => currentClass.facultyEmail === session.email || assigned.includes(currentClass.id));
}

function renderFacultyDashboardEnhanced() {
  const session = accountSession();
  const member = faculty.find(item => item.email === session.email || item.id === session.id) || faculty[0];
  const ownClasses = facultyClasses();
  const currentStatuses = ownClasses.flatMap(currentClass => rosterFor(currentClass).map(student => statusFor(currentClass.id,student.id)));
  const values = distributionValues(currentStatuses.length ? currentStatuses : ['Present']);
  qs('#page').innerHTML = pageLead('Faculty workspace','Today’s teaching pulse',`Welcome back, ${member.name}. Manage your classes and attendance from one focused workspace.`, '<button class="primary-btn" onclick="location.hash=\'attendance\'">◫ Mark attendance</button>') +
    `<div class="profile-grid faculty-profile-layout"><section class="card profile-card-main"><div class="profile-heading"><div class="profile-initials">${member.name.split(' ').map(item => item[0]).slice(0,2).join('')}</div><div><span class="eyebrow">Personal information</span><h2>${esc(member.name)}</h2><p>${esc(member.id)} · Faculty account</p></div></div><div class="profile-details">${profileItem('Faculty ID',member.id)}${profileItem('Email',member.email)}${profileItem('Department',member.department)}${profileItem('Primary subject',member.subject)}${profileItem('Phone',member.phone)}</div></section>${classDistributionCard('faculty-distribution','Attendance distribution','Your assigned class rosters',values,'Class records')}</div>
    <section class="card table-card faculty-classes-card"><div class="card-head"><div><div class="card-title">Your classes</div><div class="card-subtitle">Select a class to open its student register.</div></div><button class="secondary-btn" onclick="location.hash='attendance'">Open register</button></div><div class="table-wrap" style="margin-top:14px"><table class="data-table"><thead><tr><th>Class</th><th>Section</th><th>Schedule</th><th>Students</th><th>Action</th></tr></thead><tbody>${ownClasses.map(currentClass => `<tr><td><b class="table-primary">${esc(currentClass.subject)}</b><small>${esc(currentClass.code)}</small></td><td>${esc(currentClass.semester)} · ${esc(currentClass.section)}</td><td>${esc(currentClass.time)} · ${esc(currentClass.room)}</td><td>${rosterFor(currentClass).length}</td><td class="action-cell"><button class="secondary-btn" onclick="location.hash='attendance';sessionStorage.setItem('selected-class','${currentClass.id}')">View students</button></td></tr>`).join('')}</tbody></table></div></section>`;
  chart('faculty-distribution','doughnut',['Present','Absent','Late'],[{data:values,backgroundColor:['#0F9F8F','#D45B72','#D89A4A'],borderWidth:0,cutout:'73%'}]);
}

function renderFacultyRegister() {
  const availableClasses = facultyClasses();
  const storedSelection = sessionStorage.getItem('selected-class');
  const selectedClass = availableClasses.find(currentClass => currentClass.id === storedSelection) || availableClasses[0];
  if (!selectedClass) {
    qs('#page').innerHTML = pageLead('Faculty register','No class assigned','There are no classes available for this faculty account.');
    return;
  }
  const roster = rosterFor(selectedClass);
  const statuses = roster.map(student => statusFor(selectedClass.id,student.id));
  const values = distributionValues(statuses);
  qs('#page').innerHTML = pageLead('Attendance register','Mark class attendance',`Choose a class, review its enrolled students, and mark each record as Present, Late, or Absent.`) +
    `<section class="card class-selector-card"><div><span class="eyebrow">Selected class</span><h2>${esc(selectedClass.subject)}</h2><p>${esc(selectedClass.code)} · ${esc(selectedClass.semester)}-${esc(selectedClass.section)} · ${esc(selectedClass.time)} · ${esc(selectedClass.room)}</p></div><label class="class-selector-label">Select class<select id="faculty-class-select">${availableClasses.map(currentClass => `<option value="${currentClass.id}" ${currentClass.id===selectedClass.id?'selected':''}>${esc(currentClass.subject)} · ${esc(currentClass.semester)}-${esc(currentClass.section)}</option>`).join('')}</select></label></section>
    <div class="attendance-summary"><div class="card summary-card"><span class="metric-glyph present">✓</span><div><label>Present</label><strong>${values[0]}</strong></div></div><div class="card summary-card"><span class="metric-glyph absent">!</span><div><label>Absent</label><strong>${values[1]}</strong></div></div><div class="card summary-card"><span class="metric-glyph late">◷</span><div><label>Late</label><strong>${values[2]}</strong></div></div></div>
    <section class="card table-card faculty-register-card"><div class="card-head"><div><div class="card-title">${roster.length} students in ${esc(selectedClass.subject)}</div><div class="card-subtitle">Click one attendance status for each student.</div></div><button class="primary-btn" id="save-class-attendance">Save class attendance</button></div><div id="class-save-message"></div><div class="table-wrap" style="margin-top:14px"><table class="data-table"><thead><tr><th>Student</th><th>Student ID</th><th>Academic details</th><th>Current status</th><th>Mark attendance</th></tr></thead><tbody>${roster.map((student,index) => `<tr><td><div class="person">${personAvatar(student.name)}<span><b>${esc(student.name)}</b><small>${esc(student.email)}</small></span></div></td><td>${esc(student.id)}</td><td>${esc(student.department)} · ${esc(student.semester)}-${esc(student.section)}</td><td>${statusBadge(statusFor(selectedClass.id,student.id))}</td><td><div class="attendance-action" data-student-actions="${student.id}">${['Present','Late','Absent'].map(status => `<button class="${statusFor(selectedClass.id,student.id)===status?'selected '+status.toLowerCase():''}" data-class-id="${selectedClass.id}" data-student-id="${student.id}" data-status="${status}">${status}</button>`).join('')}</div></td></tr>`).join('')}</tbody></table></div></section>`;
  qs('#faculty-class-select').onchange = event => { sessionStorage.setItem('selected-class', event.target.value); renderFacultyRegister(); };
  qs('#page').onclick = event => {
    const button = event.target.closest('[data-status]');
    if (!button) return;
    classAttendance[statusKey(button.dataset.classId,button.dataset.studentId)] = button.dataset.status;
    const actions = button.closest('[data-student-actions]');
    actions.querySelectorAll('button').forEach(item => item.className = '');
    button.className = `selected ${button.dataset.status.toLowerCase()}`;
    const summary = ['Present','Absent','Late'].map(status => roster.filter(student => statusFor(selectedClass.id,student.id) === status).length);
    document.querySelector('.summary-card:nth-child(1) strong').textContent = summary[0];
    document.querySelector('.summary-card:nth-child(2) strong').textContent = summary[1];
    document.querySelector('.summary-card:nth-child(3) strong').textContent = summary[2];
  };
  qs('#save-class-attendance').onclick = () => {
    roster.forEach(student => { attendance[student.id] = statusFor(selectedClass.id,student.id); });
    persistRoleAttendance();
    qs('#class-save-message').innerHTML = '<div class="success-banner">✓ Attendance saved for this class. The selected statuses are ready for reports.</div>';
    toast('Class attendance saved', `${roster.length} student records updated.`);
  };
}

const baseStudentDashboard = typeof renderStudentDashboard === 'function' ? renderStudentDashboard : null;
const baseFacultyDashboard = typeof renderFacultyDashboard === 'function' ? renderFacultyDashboard : null;
const baseAttendance = typeof renderAttendance === 'function' ? renderAttendance : null;
renderStudentDashboard = renderStudentDashboardEnhanced;
renderFacultyDashboard = renderFacultyDashboardEnhanced;
renderAttendance = function() {
  const role = localStorage.getItem('cloud-role') || 'Admin';
  if (role === 'Faculty') return renderFacultyRegister();
  if (role === 'Student') return renderStudentAttendanceEnhanced();
  return baseAttendance ? baseAttendance() : undefined;
};

if (localStorage.getItem('cloud-role') && document.querySelector('#app-view')) {
  if (location.hash && location.hash !== '#') navigate();
}

function reportRowsFor(role) {
  const classes = role === 'Faculty' ? facultyClasses() : classCatalog;
  return classes.map(currentClass => {
    const roster = rosterFor(currentClass);
    const statuses = roster.map(student => statusFor(currentClass.id, student.id));
    return {
      currentClass,
      roster,
      statuses,
      present: statuses.filter(status => status === 'Present').length,
      late: statuses.filter(status => status === 'Late').length,
      absent: statuses.filter(status => status === 'Absent').length
    };
  }).filter(row => row.roster.length);
}

function downloadRoleReport(rows, role) {
  const header = 'Class,Faculty,Section,Students,Present,Late,Absent,Attendance rate';
  const lines = rows.map(row => {
    const total = row.roster.length || 1;
    const rate = Math.round(((row.present + row.late) / total) * 100);
    return [row.currentClass.subject, row.currentClass.faculty, `${row.currentClass.semester}-${row.currentClass.section}`, row.roster.length, row.present, row.late, row.absent, `${rate}%`].map(value => `"${String(value).replaceAll('"','""')}"`).join(',');
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([[header, ...lines].join('\n')], {type:'text/csv'}));
  link.download = `${role.toLowerCase()}-attendance-report.csv`;
  link.click();
  toast('Report downloaded', `${role} report includes ${rows.length} class${rows.length === 1 ? '' : 'es'}.`);
}

function renderRoleAwareReports() {
  const role = localStorage.getItem('cloud-role') || 'Admin';
  if (role === 'Student') {
    location.hash = 'dashboard';
    return;
  }
  const rows = reportRowsFor(role);
  const allStatuses = rows.flatMap(row => row.statuses);
  const present = allStatuses.filter(status => status === 'Present').length;
  const late = allStatuses.filter(status => status === 'Late').length;
  const absent = allStatuses.filter(status => status === 'Absent').length;
  const total = allStatuses.length || 1;
  const rate = Math.round(((present + late) / total) * 100);
  const title = role === 'Faculty' ? 'Teaching reports' : 'Institution reports';
  const description = role === 'Faculty'
    ? 'Attendance reports for classes assigned to your faculty account.'
    : 'Attendance reports across every class and academic section.';
  qs('#page').innerHTML = pageLead(role === 'Faculty' ? 'Faculty workspace' : 'Administrator workspace', title, description, '<button class="secondary-btn" onclick="window.print()">▣ Print</button><button class="primary-btn" id="role-report-export">⇩ Export CSV</button>') +
    `<div class="report-kpis"><div class="report-kpi"><label>Attendance rate</label><strong style="color:#4F46E5">${rate}%</strong></div><div class="report-kpi"><label>Present</label><strong style="color:#0F9F8F">${present}</strong></div><div class="report-kpi"><label>Late</label><strong style="color:#D89A4A">${late}</strong></div><div class="report-kpi"><label>Absent</label><strong style="color:#D45B72">${absent}</strong></div></div>` +
    `<section class="card table-card role-report-card"><div class="card-head"><div><div class="card-title">${role === 'Faculty' ? 'Reports for your classes' : 'All class attendance reports'}</div><div class="card-subtitle">${rows.length} class${rows.length === 1 ? '' : 'es'} · ${allStatuses.length} student records</div></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Class</th><th>Faculty</th><th>Section</th><th>Students</th><th>Present</th><th>Late</th><th>Absent</th><th>Rate</th></tr></thead><tbody>${rows.map(row => { const classTotal = row.roster.length || 1; const classRate = Math.round(((row.present + row.late) / classTotal) * 100); return `<tr><td><b class="table-primary">${esc(row.currentClass.subject)}</b><small>${esc(row.currentClass.code)}</small></td><td>${esc(row.currentClass.faculty)}</td><td>${esc(row.currentClass.semester)} · ${esc(row.currentClass.section)}</td><td>${row.roster.length}</td><td style="color:#0F9F8F;font-weight:700">${row.present}</td><td style="color:#D89A4A;font-weight:700">${row.late}</td><td style="color:#D45B72;font-weight:700">${row.absent}</td><td style="font-weight:700;color:#4F46E5">${classRate}%</td></tr>`; }).join('')}</tbody></table></div></section>` +
    `<div class="report-grid role-report-bottom"><section class="card doughnut-card distribution-card"><div class="card-head"><div><div class="card-title">Attendance distribution</div><div class="card-subtitle">${role === 'Faculty' ? 'Your assigned classes' : 'Institution-wide class records'}</div></div></div><div class="chart-box"><canvas id="role-report-distribution"></canvas><div class="doughnut-center"><strong>${allStatuses.length}</strong><small>Records</small></div></div></section><section class="card report-scope-card"><div class="card-title">Report access</div><div class="card-subtitle">${role === 'Faculty' ? 'Only subjects assigned to your faculty email are included.' : 'All registered classes are included for administrator review.'}</div><div class="report-scope-list">${rows.map(row => `<div><span>${esc(row.currentClass.subject)}</span><b>${row.roster.length} students</b></div>`).join('')}</div></section></div>`;
  chart('role-report-distribution', 'doughnut', ['Present','Absent','Late'], [{data:[present,absent,late],backgroundColor:['#0F9F8F','#D45B72','#D89A4A'],borderWidth:0,cutout:'73%'}]);
  qs('#role-report-export').onclick = () => downloadRoleReport(rows, role);
}

const baseReports = typeof renderReports === 'function' ? renderReports : null;
renderReports = renderRoleAwareReports;
