$(function () {
    var socket = io();
    $('form').submit(() => {
        let message = {
            body: $('#body').val(),
            sender: +$('#user-id').html()
        }
        socket.emit('chat message', message);
        $('#body').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append(msgElement(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});