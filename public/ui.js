function msgElement(msg) {
    let media = $('<article>', {
        class: 'media'
    });

    let mediaLeft = $('<figure>', {
        class: 'media-left'
    });
    media.append(mediaLeft);

    let mediaContent = $('<div>', {
        class: 'media-content'
    });
    let content = $('<div>', {
        class: 'content'
    });
    let paragraph = $('<p>');
    let name = $('<strong>');
    name.text(msg.senderName);
    paragraph.append(name);
    paragraph.append($('<br>'));
    paragraph.append(msg.body);
    content.append(paragraph);
    mediaContent.append(content);
    media.append(mediaContent);

    return media;
}