//DAT.GUI

const el = document.getElementById("chat");

let backgroundColor = "#FFD700";
let containerWidth = 800;

let senderColor = "#333333";
let senderTextColor = '#fafafa';

let receiverColor = '#FEF9E6';
let receiverTextColor = '#333333';

let mediumColor = "#AAAAAA";

let avatarWidth = 30;
let senderAvatar = 'U';
let receiverAvatar = 'R';

let messageBorderRadius = 20;
let messagePadding = 15;
let messageFontSize = 15;
let messageLineHeight = 20;

let multipleMessageBorder = 20;
let marginBtwMessage = 2;
let marginBtwUser = 10;

let popUpSpeed = 0.5;

let messageComponentMaxWidth = 400;

const params = {
	backgroundColor: backgroundColor,
	containerWidth: containerWidth,

    senderColor: senderColor,
    senderTextColor: senderTextColor,

    receiverColor: receiverColor,
    receiverTextColor: receiverTextColor,

    mediumColor: mediumColor,

    avatarWidth: avatarWidth,
    senderAvatar: senderAvatar,
    receiverAvatar: receiverAvatar,

    messageBorderRadius: messageBorderRadius,
    messagePadding: messagePadding,
    messageFontSize: messageFontSize,
    messageLineHeight: messageLineHeight,

    multipleMessageBorder: multipleMessageBorder,
    marginBtwMessage: marginBtwMessage,
    marginBtwUser: marginBtwUser,

    popUpSpeed: popUpSpeed,
    messageComponentMaxWidth: messageComponentMaxWidth
}

let root = {
    '--sender-color': senderColor,
    '--sender-text-color': senderTextColor,
    '--receiver-color': receiverColor,
    '--receiver-text-color': receiverTextColor,
    '--medium-color': mediumColor,
    '--avatar-width': avatarWidth+'px',
    '--sender-avatar': '"'+senderAvatar+'"',
    '--receiver-avatar': '"'+receiverAvatar+'"',
    '--message-border-radius': messageBorderRadius+'px',
    '--message-padding': messagePadding+'px',
    '--message-font-size': messageFontSize+'px',
    '--message-line-height': messageLineHeight+'px',
    '--comment-font-size': '10px',
    '--multiple-message-border': '20px',
    '--margin-btw-message': '2px',
    '--margin-btw-user': '10px',
    '--pop-up-speed': '0.5s',
    '--message-component-max-width': '400px',
    '--message-component-min-width': '200px'
};

let gui = new dat.GUI();

gui.addColor(params, 'backgroundColor').onChange(function(value) {
    backgroundColor = value;
    
    document.querySelector('html').style.backgroundColor = backgroundColor;
    
    if(lightOrDark(backgroundColor)){
		
        document.getElementById('title').style.color = '#ffffff';
        document.getElementById('description').style.color = '#ffffff';

	} else {
        document.getElementById('title').style.color = '#000000';
        document.getElementById('description').style.color = '#000000';
	}

});

gui.add(params, 'containerWidth', 200, 1200).step(50).onChange(function(value) {
    containerWidth = value;
    document.querySelector('section').style.maxWidth = containerWidth+"px";
});

gui.addColor(params, 'senderColor').onChange(function(value) {
    senderColor = value;
    const property = value;
    const key = '--sender-color';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.addColor(params, 'senderTextColor').onChange(function(value) {
    senderTextColor = value;
    const property = value;
    const key = '--sender-text-color';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.addColor(params, 'receiverColor').onChange(function(value) {
    receiverColor = value;
    const property = value;
    const key = '--receiver-color';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.addColor(params, 'receiverTextColor').onChange(function(value) {
    receiverTextColor = value;
    const property = value;
    const key = '--receiver-text-color';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.addColor(params, 'mediumColor').onChange(function(value) {
    mediumColor = value;
    const property = value;
    const key = '--medium-color';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'avatarWidth', 10, 50).step(5).onChange(function(value) {
    avatarWidth = value;
    const property = value+"px";
    const key = '--avatar-width';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'senderAvatar').onFinishChange(function(value) {
    senderAvatar = value;
    const property = '"'+value+'"';
    const key = '--sender-avatar';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'receiverAvatar').onFinishChange(function(value) {
    receiverAvatar = value;
    const property = '"'+value+'"';
    const key = '--receiver-avatar';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'messageBorderRadius', 0, 50).step(5).onChange(function(value) {
    messageBorderRadius = value;
    const property = value+"px";
    const key = '--message-border-radius';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'messagePadding', 0, 50).step(5).onChange(function(value) {
    messagePadding = value;
    const property = value+"px";
    const key = '--message-padding';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'messageFontSize', 10, 50).step(5).onChange(function(value) {
    messageFontSize = value;
    const property = value+"px";
    const key = '--message-font-size';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'messageLineHeight', 10, 70).step(5).onChange(function(value) {
    messageLineHeight = value;
    const property = value+"px";
    const key = '--message-line-height';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'multipleMessageBorder', 10, 70).step(5).onChange(function(value) {
    multipleMessageBorder = value;
    const property = value+"px";
    const key = '--multiple-message-border';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'marginBtwMessage', 0, 100).step(1).onChange(function(value) {
    marginBtwMessage = value;
    const property = value+"px";
    const key = '--margin-btw-message';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'marginBtwUser', 0, 50).step(1).onChange(function(value) {
    marginBtwUser = value;
    const property = value+"px";
    const key = '--margin-btw-user';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'popUpSpeed', 0, 1).step(0.1).onChange(function(value) {
    popUpSpeed = value;
    const property = value+"s";
    const key = '--pop-up-speed';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

gui.add(params, 'messageComponentMaxWidth', 200, 800).step(50).onChange(function(value) {
    messageComponentMaxWidth = value;
    const property = value+"px";
    const key = '--message-component-max-width';
    root[key] = property;
    document.documentElement.style.setProperty(key, property);
    update();
});

function update(){
    const keys = Object.keys(root);
    let cssRoot = ":root{\n";
    for (let i = 0; i < keys.length; i++ ){
    	cssRoot += "	"+keys[i]+': '+root[keys[i]]+";\n";
    }
    cssRoot += "}";

    document.getElementById('css').textContent = cssRoot;
}

update();

function lightOrDark(color) {

    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
    } else {  
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>75) {
        return false;
    } else {
        return true;
    }
}