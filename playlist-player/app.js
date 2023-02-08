const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Upload']

let stateIndex = 0
let mediaRecorder, chunks = [], audioUrl = ''

const application = (index) => {
    switch(State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()
            addMessage('Press start to start recording')
            addButton('record', 'record()', 'Start recording')
            break;
        case 'Record':
            clearDisplay()
            clearControls()
            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop recording')
            break;
        case 'Upload':
            clearDisplay()
            clearControls()
            addButton('upload', 'uploadAudio()', 'Upload audio to playlist')
            addButton('record', 'record()', 'Re-record')
            break;
        default:
            clearDisplay()
            clearControls()
            addMessage('Browser does not support mediaDevices')
            break;
    }
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addAudio = (audioUrl) => {
    const audio = document.createElement('audio')
    audio.classList.add('new-recording');
    audio.controls = true
    audio.src = audioUrl
    display.append(audio)
}

const appendToPlaylist = (audioObject) => {
    const playlist = document.getElementById("aList")
    idx = playlist.children.length
    let row = document.createElement("div");
    row.className = "aRow";
    row.innerHTML = "recording";
    audioObject.classList.remove('new-recording')
    row.appendChild(audioObject)
    row.src = audioObject.src
    row.idx = idx
    row.addEventListener("click", () => { audPlay(row.idx); });
    playlist.appendChild(row);

}

audPlay = (idx, nostart) => {
    const playlist = document.getElementById("aList")
    const audio = new Audio()
    audNow = idx;
    audStart = nostart ? false : true;
    audio.src = playlist.children[idx].src;
    for (let i =0; i < playlist.children.length; i++) {
        if (i == idx) { playlist.children[i].classList.add("now"); }
        else {
            playlist.children[i].classList.remove("now"); }
    }
  };

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices is supported')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, {'type': 'audio/egg; codecs=opus'})
            chunks = []
            audioUrl = window.URL.createObjectURL(blob)
            console.log(audioUrl)
            addAudio(audioUrl)
            //document.querySelector('audio').src = audioUrl
        }
    }).catch(error => {
        console.log('Following error has occured: ', error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}


const uploadAudio = () => {
    // Add to playlist
    let newAudio = document.getElementsByClassName('new-recording')
    appendToPlaylist(newAudio[0])
    stateIndex = 0
    application(stateIndex)
    
}

application(stateIndex)


