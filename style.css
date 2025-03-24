const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const saturationSlider = document.getElementById("saturation");
const hueSlider = document.getElementById("hue");
const sliderContainer = document.querySelector(".slider-container");
const downloadBtn = document.getElementById("downloadBtn");

let img = new Image();

imageInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            resetFilters(); // Reset thông số khi chọn ảnh mới
        };
        reader.readAsDataURL(file);
    }
});

img.onload = function() {
    let imgWidth = img.width;
    let imgHeight = img.height;

    let screenWidth = window.innerWidth * 0.9;  
    let screenHeight = window.innerHeight * 0.8; 

    let scale = Math.min(screenWidth / imgWidth, screenHeight / imgHeight, 1);
    let newWidth = imgWidth * scale;
    let newHeight = imgHeight * scale;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    sliderContainer.style.display = "block";
    downloadBtn.style.display = "block";
    document.getElementById("preview-container").style.display = "block";
};

// Cập nhật bộ lọc ảnh theo thông số người dùng chỉnh
function updateFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `
        brightness(${brightnessSlider.value}%) 
        contrast(${contrastSlider.value}%) 
        saturate(${saturationSlider.value}%) 
        hue-rotate(${hueSlider.value}deg)
    `;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Reset tất cả thông số về mặc định khi đổi ảnh
function resetFilters() {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    updateFilters();
}

const temperatureSlider = document.getElementById("temperature"); // Lấy slider nhiệt độ màu

function updateFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tính toán giá trị nhiệt độ màu (ấm hoặc lạnh)
    let tempValue = parseInt(temperatureSlider.value);
    let r = tempValue > 0 ? tempValue * 0.5 : 0;  // Nếu ấm, tăng đỏ
    let b = tempValue < 0 ? Math.abs(tempValue) * 0.5 : 0; // Nếu lạnh, tăng xanh

    ctx.filter = `
        brightness(${brightnessSlider.value}%) 
        contrast(${contrastSlider.value}%) 
        saturate(${saturationSlider.value}%) 
        hue-rotate(${hueSlider.value}deg)
    `;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Thêm hiệu ứng nhiệt độ màu bằng cách phủ một lớp màu
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] += r; // Tăng đỏ khi nhiệt độ ấm
        data[i + 2] += b; // Tăng xanh khi nhiệt độ lạnh
    }

    ctx.putImageData(imageData, 0, 0);
}

// Reset nhiệt độ màu khi đổi ảnh
function resetFilters() {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    temperatureSlider.value = 0; // Reset nhiệt độ màu
    updateFilters();
}

// Gán sự kiện thay đổi giá trị cho thanh trượt
temperatureSlider.addEventListener("input", updateFilters);

let history = []; // Lưu lịch sử ảnh & giá trị thanh trượt
let historyIndex = -1; // Vị trí hiện tại trong lịch sử

// 🖼 Lưu trạng thái hiện tại vào history
function saveToHistory() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1); // Xóa redo
    }
    history.push({
        image: canvas.toDataURL(), // Lưu ảnh
        brightness: brightnessSlider.value,
        contrast: contrastSlider.value,
        saturation: saturationSlider.value,
        hue: hueSlider.value,
        temperature: temperatureSlider.value
    });
    historyIndex++;
}

// 🖌 Cập nhật bộ lọc ảnh & lưu vào history
function updateFilters(saveHistory = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let tempValue = parseInt(temperatureSlider.value);
    let r = tempValue > 0 ? tempValue * 0.5 : 0;
    let b = tempValue < 0 ? Math.abs(tempValue) * 0.5 : 0;

    ctx.filter = `
        brightness(${brightnessSlider.value}%) 
        contrast(${contrastSlider.value}%) 
        saturate(${saturationSlider.value}%) 
        hue-rotate(${hueSlider.value}deg)
    `;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] += r;
        data[i + 2] += b;
    }

    ctx.putImageData(imageData, 0, 0);

    if (saveHistory) saveToHistory();
}

// 🔄 Quay lại trạng thái trước đó khi nhấn Ctrl + Z
function undoImage() {
    if (historyIndex > 0) {
        historyIndex--;
        let state = history[historyIndex];

        let imgUndo = new Image();
        imgUndo.src = state.image;
        imgUndo.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgUndo, 0, 0, canvas.width, canvas.height);
        };

        // 🔥 Cập nhật lại thanh trượt
        brightnessSlider.value = state.brightness;
        contrastSlider.value = state.contrast;
        saturationSlider.value = state.saturation;
        hueSlider.value = state.hue;
        temperatureSlider.value = state.temperature;
    }
}

// 📤 Khi upload ảnh mới, reset lịch sử
img.onload = function () {
    let scale = Math.min(window.innerWidth * 0.9 / img.width, window.innerHeight * 0.8 / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    history = [{
        image: canvas.toDataURL(),
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        temperature: 0
    }];
    historyIndex = 0;

    // Reset thanh trượt
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    temperatureSlider.value = 0;
};

// ⌨️ Lắng nghe sự kiện Ctrl + Z
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "z") {
        undoImage();
        event.preventDefault(); // Tránh lỗi lùi trang trình duyệt
    }
});

// 🎛 Lắng nghe sự kiện thay đổi filter
brightnessSlider.addEventListener("input", () => updateFilters());
contrastSlider.addEventListener("input", () => updateFilters());
saturationSlider.addEventListener("input", () => updateFilters());
hueSlider.addEventListener("input", () => updateFilters());
temperatureSlider.addEventListener("input", () => updateFilters());

// 🛑 Reset ảnh và thanh trượt về trạng thái gốc
function resetImage() {
    if (history.length > 0) {
        let initialState = history[0]; // Trạng thái ban đầu

        let imgReset = new Image();
        imgReset.src = initialState.image;
        imgReset.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgReset, 0, 0, canvas.width, canvas.height);
        };

        // 🔥 Reset giá trị thanh trượt
        brightnessSlider.value = initialState.brightness;
        contrastSlider.value = initialState.contrast;
        saturationSlider.value = initialState.saturation;
        hueSlider.value = initialState.hue;
        temperatureSlider.value = initialState.temperature;

        // Reset vị trí trong lịch sử
        historyIndex = 0;
    }
}

// 🖱 Lắng nghe sự kiện double-click trên nút hình tròn
const resetButton = document.getElementById("reset-btn");
resetButton.addEventListener("dblclick", resetImage);

function resetSlider(sliderId) {
    let slider = document.getElementById(sliderId);
    let defaultValue = 100; // Giá trị mặc định của hầu hết các bộ lọc

    if (sliderId === "hue" || sliderId === "temperature") {
        defaultValue = 0; // Hue và Temperature có mặc định là 0
    }

    slider.value = defaultValue;
    updateFilters(); // Cập nhật ảnh sau khi reset
}


// Gán sự kiện thay đổi giá trị cho thanh trượt
brightnessSlider.addEventListener("input", updateFilters);
contrastSlider.addEventListener("input", updateFilters);
saturationSlider.addEventListener("input", updateFilters);
hueSlider.addEventListener("input", updateFilters);

// Nút tải ảnh xuống
downloadBtn.addEventListener("click", function() {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
