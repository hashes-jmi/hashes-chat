function msgElement(msg) {
    let media = $('<article>', {
        class: 'media'
    });

    let mediaLeft = $('<figure>', {
        class: 'media-left'
    });
    let imageHolder = $('<p>', {
        class: 'image is-64x64'
    });
    let image = $('<img>', {
        src: "https://bulma.io/images/placeholders/128x128.png"
    });
    imageHolder.append(image);
    mediaLeft.append(imageHolder);
    media.append(mediaLeft);

    let mediaContent = $('<div>', {
        class: 'media-content'
    });
    let content = $('<div>', {
        class: 'content'
    });
    let paragraph = $('<p>');
    let name = $('<strong>');
    name.text(msg.sender);
    paragraph.append(name);
    paragraph.append($('<br>'));
    paragraph.append(msg.body);
    content.append(paragraph);
    mediaContent.append(content);
    media.append(mediaContent);

    return media;
}