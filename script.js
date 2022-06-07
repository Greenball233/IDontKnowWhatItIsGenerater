const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = document.getElementById("button");
const color = document.getElementById("color");
const width = 800;
const height = 800;
const panelHeight = height/10;
const avatarRadius = 40;
const avatarOffset = 15;
const bottomOffset = 180;
const nameOffset = 20;
const leftPosX = 42;
const avatarPos = {
    x: leftPosX + avatarRadius,
    y: panelHeight + avatarOffset + avatarRadius
}
const nameInputField = document.getElementById("name");
const avatarFile = document.getElementById("avatar");
const contentFile = document.getElementById("content");
let avatarUrl = null;
let contentUrl = null;
const downloadButton = document.getElementById("download");
window.addEventListener("load", function () {
    downloadButton.disabled = true;
    canvas.width = width;
    canvas.height = height;
    contentFile.disabled = false;
    avatarFile.disabled = false;
    const placeholder = new Image();
    placeholder.src = "res/placeholder.png";
    placeholder.onload = function () {
        ctx.drawImage(placeholder, 0, 0, placeholder.width, placeholder.height, 0, 0, width, height);
    }
});
avatarFile.addEventListener("change", readAvatar);
contentFile.addEventListener("change", readContent);
downloadButton.addEventListener("click", download);
button.addEventListener('click', function () {
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, width, height);
    ctx.clearRect(leftPosX, avatarPos.y + avatarOffset + avatarRadius, width - 2 * leftPosX, height - avatarPos.y - avatarOffset - avatarRadius - bottomOffset);
    ctx.fillStyle = colorToRGB(color.value);
    ctx.fillRect(0, 0, width, panelHeight);
    ctx.fillRect(0, height - panelHeight, width, panelHeight);
    const icons = new Image();
    icons.src = "res/icons.png";
    icons.onload = function () {
        ctx.drawImage(icons, 0, 0, icons.width, icons.height, 0, 0, width, height);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.beginPath();
        ctx.arc(avatarPos.x, avatarPos.y, avatarRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarPos.x, avatarPos.y, avatarRadius, 0, 2 * Math.PI);
        ctx.clip();
        const avatar = new Image();
        avatar.src = (avatarUrl == null) ? "res/placeholder.png" : avatarUrl;
        avatar.onload = function () {
            ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, avatarPos.x - avatarRadius, avatarPos.y - avatarRadius, avatarRadius * 2, avatarRadius * 2);
            ctx.restore();
            ctx.textAlign = "left";
            let fontSize = 30;
            ctx.font = `${fontSize}px fangzhengshusong`;
            ctx.fillText((nameInputField.value.trim() === "") ? "名字" : nameInputField.value, avatarPos.x + avatarRadius + nameOffset, avatarPos.y + fontSize / 2 - 5);
            const content = new Image();
            content.src = (contentUrl == null) ? "res/placeholder.png" : contentUrl;
            content.onload = function () {
                ctx.drawImage(content, 0, 0, content.width, content.height, leftPosX, avatarPos.y + avatarOffset + avatarRadius, width - 2 * leftPosX, height - avatarPos.y - avatarOffset - avatarRadius - bottomOffset);
                ctx.strokeRect(leftPosX, avatarPos.y + avatarOffset + avatarRadius, width - 2 * leftPosX, height - avatarPos.y - avatarOffset - avatarRadius - bottomOffset);
                downloadButton.disabled = false;
            }
        }
    }
})

function readAvatar() {
    let fileReader = new FileReader();
    if (avatarFile.files.length < 1) return;
    let file = avatarFile.files[0];
    fileReader.readAsDataURL(file);
    if (fileReader.error) {
        setError('错误：无法读取文件', "avatarMessage");
        return;
    }
    fileReader.onprogress = progress => {
        const size = file.size;
        setLog("读取进度：" + Math.floor(progress.loaded / size * 100) + "%", "avatarMessage");
    };
    fileReader.onloadend = function readEnd() {
        setLog("读取完毕！", "avatarMessage");
        avatarUrl = fileReader.result.substring(0);
        avatarFile.disabled = true;
    };
}

function readContent() {
    let fileReader = new FileReader();
    if (contentFile.files.length < 1) return;
    let file = contentFile.files[0];
    fileReader.readAsDataURL(file);
    if (fileReader.error) {
        setError('错误：无法读取文件', "contentMessage");
        return;
    }
    fileReader.onprogress = progress => {
        const size = file.size;
        setLog("读取进度：" + Math.floor(progress.loaded / size * 100) + "%", "contentMessage");
    };
    fileReader.onloadend = function readEnd() {
        setLog("读取完毕！", "contentMessage");
        contentUrl = fileReader.result.substring(0);
        contentFile.disabled = true;
    };
}

function setLog(msg, id) {
    let msgBox = document.getElementById(id);
    msgBox.style.color = "black";
    msgBox.innerHTML = msg;
}

function setError(msg, id) {
    let msgBox = document.getElementById(id);
    msgBox.style.color = "red";
    msgBox.innerHTML = msg;
}

function colorToRGB(color) {
    let color1, color2, color3;
    color = '' + color;
    if (typeof color !== 'string') return 'rgba(0, 0, 0, 1)';
    if (color.charAt(0) === '#') {
        color = color.substring(1);
    }
    if (color.length === 3) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
        color1 = parseInt(color.substr(0, 2), 16);
        color2 = parseInt(color.substr(2, 2), 16);
        color3 = parseInt(color.substr(4, 2), 16);
        return `rgba(${color1}, ${color2}, ${color3}, 1)`;
    } else {
        return 'rgba(0, 0, 0, 1)';
    }
}

function download() {
    const oA = document.createElement("a");
    oA.download = '';
    oA.href = canvas.toDataURL("image/png");
    document.body.appendChild(oA);
    oA.click();
    oA.remove();
}