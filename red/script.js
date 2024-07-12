document.getElementById('fileInput').addEventListener('change', handleFileSelect);

let toDoList = [];
let friendsList = ['Myself'];

function showTab(tabName) {
    document.getElementById('sendTab').style.display = 'none';
    document.getElementById('receiveTab').style.display = 'none';
    document.getElementById('friendsTab').style.display = 'none';

    document.getElementById(tabName + 'Tab').style.display = 'block';
}

function handleFileSelect(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        toDoList.push(files[i]);
    }
    updateFileList();
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    if (toDoList.length === 0) {
        document.getElementById('sendFilesBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
        return;
    }

    toDoList.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file.name;
        fileList.appendChild(li);
    });

    document.getElementById('sendFilesBtn').style.display = 'block';
    document.getElementById('cancelBtn').style.display = 'block';
}

function clearFileList() {
    toDoList = [];
    updateFileList();
}

function loadFriends() {
    const friendsSelect = document.getElementById('receiverSelect');
    friendsList.forEach(friend => {
        const option = document.createElement('option');
        option.value = friend;
        option.textContent = friend;
        friendsSelect.appendChild(option);
    });
}

function sendFiles() {
    const receiver = document.getElementById('receiverSelect').value;

    if (receiver === '') {
        alert('Receiver not selected');
        return;
    }

    if (toDoList.length === 0) {
        alert('File selection empty');
        return;
    }

    // Establish WebSocket connection
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        const message = {
            type: 'file-send-request',
            sender: 'Your Name', // Replace with actual sender name
            receiver: receiver,
            files: toDoList.map(file => file.name),
            date: new Date().toLocaleString()
        };
        socket.send(JSON.stringify(message));
        alert('Sending files to ' + receiver);
    };

    socket.onmessage = (event) => {
        const response = JSON.parse(event.data);

        if (response.type === 'file-send-accept') {
            // Simulate file sending
            alert('Files sent successfully!');
            clearFileList();
        } else if (response.type === 'file-send-reject') {
            alert('File send request rejected by ' + receiver);
            clearFileList();
        }
    };
}

// Simulate receiving files (for demo purposes)
setTimeout(() => {
    const receiveContent = document.getElementById('receiveContent');
    const requestDiv = document.createElement('div');
    requestDiv.className = 'receiveRequest';
    requestDiv.innerHTML = `
        <span>Receive files from Friend A - ${new Date().toLocaleString()}</span>
        <button onclick="acceptReceiveRequest(this)">Accept</button>
        <button onclick="rejectReceiveRequest(this)">Reject</button>
    `;
    receiveContent.appendChild(requestDiv);
}, 3000);

function acceptReceiveRequest(button) {
    const requestDiv = button.parentElement;
    alert('Receiving files...');
    setTimeout(() => {
        alert('Files received successfully!');
        requestDiv.remove();
    }, 2000);
}

function rejectReceiveRequest(button) {
    const requestDiv = button.parentElement;
    requestDiv.remove();
}

// Load friends list on startup
document.addEventListener('DOMContentLoaded', () => {
    loadFriends();
});
