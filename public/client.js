$(function () {
    var socket = io();
    $('form').submit(() => {
        let d = new Date();
        let message = {
            body: $('#body').val(),
            sender: $('#nick').val(),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss.SSSSSS')
        }

        socket.emit('chat message', message);
        $('#body').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>', {
            class: 'message'
        }).text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});