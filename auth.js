const studentAccounts = [
  ['STU-2401','Aarav Mehta','aarav.mehta@cloud.edu'],
  ['STU-2402','Diya Sharma','diya.sharma@cloud.edu'],
  ['STU-2403','Kabir Kapoor','kabir.kapoor@cloud.edu'],
  ['STU-2404','Meera Iyer','meera.iyer@cloud.edu'],
  ['STU-2405','Rohan Das','rohan.das@cloud.edu'],
  ['STU-2406','Sana Khan','sana.khan@cloud.edu'],
  ['STU-2407','Arjun Patel','arjun.patel@cloud.edu'],
  ['STU-2408','Ishaan Verma','ishaan.verma@cloud.edu'],
  ['STU-2409','Priya Nair','priya.nair@cloud.edu'],
  ['STU-2410','Karan Malhotra','karan.malhotra@cloud.edu'],
  ['STU-2411','Ananya Bose','ananya.bose@cloud.edu'],
  ['STU-2412','Vikram Singh','vikram.singh@cloud.edu'],
  ['STU-2413','Tara Joshi','tara.joshi@cloud.edu'],
  ['STU-2414','Dev Shah','dev.shah@cloud.edu'],
  ['STU-2415','Nidhi Kulkarni','nidhi.kulkarni@cloud.edu'],
  ['STU-2416','Aditya Rao','aditya.rao@cloud.edu'],
  ['STU-2417','Maya Fernandes','maya.fernandes@cloud.edu'],
  ['STU-2418','Yash Gupta','yash.gupta@cloud.edu'],
  ['STU-2419','Leah Thomas','leah.thomas@cloud.edu'],
  ['STU-2420','Omkar Patil','omkar.patil@cloud.edu'],
  ['STU-2421','Sara Ali','sara.ali@cloud.edu']
].map(([id,name,email]) => ({id,name,email,role:'Student'}));
const facultyAccounts = [
  ['FAC-081','Dr. Riya Menon','riya.menon@cloud.edu'],
  ['FAC-082','Prof. Arvind Rao','arvind.rao@cloud.edu'],
  ['FAC-083','Dr. Neha Gupta','neha.gupta@cloud.edu'],
  ['FAC-084','Prof. Sameer Shah','sameer.shah@cloud.edu']
].map(([id,name,email]) => ({id,name,email,role:'Faculty'}));
const facultyPasswordByEmail = {
  'riya.menon@cloud.edu':'faculty081',
  'arvind.rao@cloud.edu':'faculty082',
  'neha.gupta@cloud.edu':'faculty083',
  'sameer.shah@cloud.edu':'faculty084'
};
const normalizeAccount = value => String(value || '').trim().toLowerCase();
const readDirectory = (key, fallback, role, password, specificPasswords={}) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return (Array.isArray(stored) && stored.length ? stored : fallback).map(item => ({...item, role, password:item.password || specificPasswords[normalizeAccount(item.email)] || password}));
  } catch {
    return fallback.map(item => ({...item, role, password:item.password || specificPasswords[normalizeAccount(item.email)] || password}));
  }
};
const getAccounts = role => role === 'Student'
  ? readDirectory('cloud-students', studentAccounts, 'Student', 'student123')
  : role === 'Faculty'
    ? readDirectory('cloud-faculty', facultyAccounts, 'Faculty', 'faculty123', facultyPasswordByEmail)
    : [{id:'ADM-001', name:'Admin Manager', email:'admin@cloud.edu', role:'Admin', password:'admin123'}];
const normalize = value => String(value || '').trim().toLowerCase();
const form = document.querySelector('.role-login-form');
if (form) {
  const role = form.dataset.role;
  const error = form.querySelector('.form-error');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const identifier = normalize(form.elements.identifier.value);
    const password = form.elements.password.value;
    const account = getAccounts(role).find(item =>
      normalize(item.email) === identifier || normalize(item.id) === identifier || normalize(item.name) === identifier
    );
    const validPassword = account && (account.password === password || (role === 'Faculty' && password === 'faculty123'));
    if (!account || !validPassword) {
      error.textContent = role === 'Student'
        ? 'Use a valid student email or ID with the student password.'
        : `Use a valid faculty ID or email with its account password.`;
      return;
    }
    error.textContent = '';
    localStorage.setItem('cloud-role', account.role);
    localStorage.setItem('cloud-user', JSON.stringify({id:account.id,name:account.name,email:account.email,role:account.role}));
    window.location.href = 'dashboard.html#dashboard';
  });
  form.querySelector('.toggle-password').addEventListener('click', () => {
    const input = form.elements.password;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
  form.querySelector('.forgot-password').addEventListener('click', event => {
    event.preventDefault();
    error.textContent = 'Password reset is available through your institution administrator.';
  });
}
