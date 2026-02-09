
const API="http://127.0.0.1:5000";
let editMode=false;

/* NAV SWITCH */
function showSection(id){
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function showToast(msg,type){
    let t=document.getElementById("toast");
    t.innerText=msg;
    t.className=type;
    t.style.display="block";
    setTimeout(()=>t.style.display="none",3000);
}

function toggleDark(){
    document.body.classList.toggle("dark");
}

function clearForm(){
    document.getElementById("emp_id").value="";
    document.getElementById("name").value="";
    document.getElementById("email").value="";
    document.getElementById("dept").value="";
    editMode=false;
}


function addOrUpdate(){
    let emp = document.getElementById("emp_id").value.trim();
    let nameInput = document.getElementById("name").value.trim();
    let emailInput = document.getElementById("email").value.trim();
    let deptInput = document.getElementById("dept").value.trim();

    if(!emp || !nameInput || !emailInput || !deptInput){
        showToast("Please fill all fields","error");
        return;
    }

    let url = API + "/employees";
    let method = "POST";
    let bodyData = {
        emp_id: emp,
        name: nameInput,
        email: emailInput,
        department: deptInput
    };

    if(editMode){
        url = API + "/employees/" + emp;
        method = "PUT";
        bodyData = {
            name: nameInput,
            email: emailInput,
            department: deptInput
        };
    }

    fetch(url,{
        method: method,
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(bodyData)
    })
    .then(r=>r.json())
    .then(d=>{
        showToast(d.message || d.error, d.message ? "success" : "error");
        loadEmployees();
        clearForm();
    });
}

function loadDashboard(){
    fetch(API + "/dashboard")
    .then(r => r.json())
    .then(d => {
        document.getElementById("totalEmp").innerText = d.total_employees;
        document.getElementById("totalAtt").innerText = d.total_attendance;
        document.getElementById("presentToday").innerText = d.present_today;
        document.getElementById("absentToday").innerText = d.absent_today;
    });
}

function loadEmployees(){
    fetch(API+"/employees")
    .then(r=>r.json())
    .then(data=>{
        empTable.innerHTML="";
        data.forEach(e=>{
            empTable.innerHTML+=`
            <tr>
            <td>${e.emp_id}</td>
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td>${e.department}</td>
            <td>
            <button onclick="editEmp('${e.emp_id}','${e.name}','${e.email}','${e.department}')">Edit</button>
            <button class="danger" onclick="deleteEmp('${e.emp_id}')">Delete</button>
            </td>
            </tr>`;
        });
    });
}

function editEmp(id,n,e,d){
    document.getElementById("emp_id").value = id;
    document.getElementById("name").value = n;
    document.getElementById("email").value = e;
    document.getElementById("dept").value = d;
    editMode = true;
}


function deleteEmp(id){
    if(confirm("Are you sure to  delete this  employee "+id+" ?")){
        fetch(API+"/employees/"+id,{method:"DELETE"})
        .then(r=>r.json())
        .then(d=>{
            showToast(d.message||d.error,d.message?"success":"error");
            loadEmployees();
        });
    }
}

function searchEmp(){
    let f=search.value.toLowerCase();
    document.querySelectorAll("#empTable tr").forEach(r=>{
        r.style.display=r.innerText.toLowerCase().includes(f)?"":"none";
    });
}

function markAttendance(){
    let emp = document.getElementById("att_emp_id").value.trim();
    let dateVal = document.getElementById("date").value;
    let stat = document.getElementById("status").value;

    if(!emp || !dateVal || !stat){
        showToast("Fill all attendance fields","error");
        return;
    }

    fetch(API+"/attendance",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            emp_id: emp,
            date: dateVal,
            status: stat
        })
    })
    .then(r=>r.json())
    .then(d=>{
        showToast(d.message || d.error, d.message ? "success" : "error");
    });
}


function viewAttendance(){
    fetch(API+"/attendance/"+view_emp_id.value)
    .then(r=>r.json())
    .then(data=>{
        attendanceList.innerHTML="";
        data.forEach(a=>{
            attendanceList.innerHTML+=`<li>${a.date} - ${a.status}</li>`;
        });
    });
}

loadEmployees();
loadDashboard();
