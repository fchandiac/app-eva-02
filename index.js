const { SerialPort } = require('serialport')

const select_port = document.getElementById('select_port')
const btn_conexion = document.getElementById('btn_conexion')
const btn_close_conexion = document.getElementById('btn_close_conexion')
const select_rate = document.getElementById('select_rate')
const console_container = document.getElementById('console_container')
const command_input = document.getElementById('command_input')
const btn_command = document.getElementById('btn_command')
const status_port_input = document.getElementById('status_port_input')
const status_rate_input = document.getElementById('status_rate_input')
const status_conexion_input = document.getElementById('status_conexion_input')


var configure_port = ''
var rate = 7200
var port




SerialPort.list().then(res => {
    res.forEach(item => {
        var opt = document.createElement("option")
        opt.value = item.path
        opt.innerHTML = item.path
        select_port.appendChild(opt)
    })
})

select_port.addEventListener('change', () => {
    configure_port = select_port.value
})

select_rate.addEventListener('change', () => {
    rate = select_rate.value
})


btn_conexion.addEventListener('click', () => {
    var rateInt = parseInt(rate)
    port = new SerialPort({ path: configure_port, baudRate: rateInt })
    
    
    port.on('open', () => {
        //port.write('AT+GMR\r\n'); // set SMS text mode
        port.write('AT\r\n')
    })
    port.on('data', function (data) {
        checkStatus()
        addConsoleData(data)
    })
})

btn_close_conexion.addEventListener('click', () => {
    port.close()
    checkStatus()
    console_container.innerHTML = ''
})

btn_command.addEventListener('click', () => {
    var command = command_input.value + '\r\n'
    port.write(command)
    checkStatus()
})




function addConsoleData(text) {
    var data = document.createElement('label')
    data.classList.add('form-label')
    data.classList.add('data')
    data.innerHTML = 'data: ' + text
    console_container.appendChild(data)
}

function checkStatus() {
    if (port.isOpen == true) {
        status_conexion_input.value = 'Ok'
        status_port_input.value = port.path
        status_rate_input.value = port.baudRate
    } else {
        status_conexion_input.value = 'sin conexión'
        status_port_input.value = ''
        status_rate_input.value = ''
    }
}