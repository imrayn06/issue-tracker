let submitBtn = document.querySelector('.submit-btn');
let issueList = document.querySelector('.issue-list');

document.addEventListener('DOMContentLoaded', loadIssuesFromLocalStorage);

function loadIssuesFromLocalStorage() {
  const issues = JSON.parse(localStorage.getItem('issues')) || [];
  issues.forEach(issue => {
    addIssueToList(issue.description, issue.severity, issue.assignedTo, issue.details, issue.done, issue.timestamp);
  });
}

function addIssueToList(description, severity, assignedTo, details, done = false, timestamp = new Date().toLocaleString()) {
  const newIssue = document.createElement('div');
  newIssue.classList.add('issue-item');

  let severityColor;
  switch (severity) {
    case 'high':
      severityColor = '#ffcccb'; 
      break;
    case 'medium':
      severityColor = '#fff3cd'; 
      break;
    case 'low':
      severityColor = '#d4edda'; 
      break;
    default:
      severityColor = '#ffffff'; 
  }

  newIssue.style.backgroundColor = severityColor;
  newIssue.innerHTML = `
    <h4>${description}</h4>
    <p>Assigned To: ${assignedTo}</p>
    <p>Timestamp: ${timestamp}</p>
    <span class="severity">Severity: ${severity}</span>
    <button class="btn dropdown-btn">Show Details</button>
    <div class="dropdown-content" style="display: none;">
      <p>${details}</p>
    </div>
    <button class="btn done-btn">${done ? 'Undone' : 'Done'}</button>
    <button class="btn delete-btn">Delete</button>
  `;

  if (done) {
    newIssue.style.textDecoration = 'line-through';
  }

  issueList.appendChild(newIssue);

  newIssue.querySelector('.dropdown-btn').addEventListener('click', function() {
    const dropdownContent = newIssue.querySelector('.dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
  });

  newIssue.querySelector('.done-btn').addEventListener('click', function() {
    done = !done; 
    newIssue.style.textDecoration = done ? 'line-through' : 'none';
    newIssue.querySelector('.done-btn').textContent = done ? 'Undone' : 'Done';
    newIssue.querySelector('.done-btn').classList.toggle('done', done);
    updateIssueStatus(description, done);
  });

  newIssue.querySelector('.delete-btn').addEventListener('click', function() {
    issueList.removeChild(newIssue);
    deleteIssueFromLocalStorage(description);
  });
}

function updateIssueStatus(description, done) {
  let issues = JSON.parse(localStorage.getItem('issues')) || [];
  issues = issues.map(issue => {
    if (issue.description === description) {
      issue.done = done;
    }
    return issue;
  });
  localStorage.setItem('issues', JSON.stringify(issues));
}

function deleteIssueFromLocalStorage(description) {
  let issues = JSON.parse(localStorage.getItem('issues')) || [];
  issues = issues.filter(issue => issue.description !== description);
  localStorage.setItem('issues', JSON.stringify(issues));
}

submitBtn.addEventListener('click', function() {
  const descriptionInput = document.querySelector('.description');
  const severityInput = document.getElementById('severity-selector');
  const assignedToInput = document.querySelector('.assigned-to');
  const detailsInput = document.querySelector('.details');

  const description = descriptionInput.value.trim();
  const severity = severityInput.value;
  const assignedTo = assignedToInput.value.trim();
  const details = detailsInput.value.trim(); 

  if (description === '' || assignedTo === '' || details === '') {
    alert('Please fill in all fields');
    return;
  }

  const newIssue = {
    description,
    severity,
    assignedTo,
    details,
    done: false,
    timestamp: new Date().toLocaleString() 
  };

  let issues = JSON.parse(localStorage.getItem('issues')) || [];
  issues.push(newIssue);
  localStorage.setItem('issues', JSON.stringify(issues));

  addIssueToList(description, severity, assignedTo, details, false, newIssue.timestamp);
  
  descriptionInput.value = '';
  assignedToInput.value = '';
  detailsInput.value = ''; 
});
