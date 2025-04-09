const imageInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const saturationSlider = document.getElementById("saturation");
const hueSlider = document.getElementById("hue");
const downloadBtn = document.getElementById("downloadBtn");
const temperatureSlider = document.getElementById("temperature");
const tintSlider = document.getElementById("tint");
const sliderContainer = document.querySelector(".slider-container");
const brightnessValue = document.getElementById("brightnessValue");
const contrastValue = document.getElementById("contrastValue");
const saturationValue = document.getElementById("saturationValue");
const hueValue = document.getElementById("hueValue");
const temperatureValue = document.getElementById("temperatureValue");
const tintValue = document.getElementById("tintValue");
const sliders = document.querySelectorAll("input[type='range']");


//upload ảnh
let img = new Image();
let historyIndex = -1;

imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

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
        temperature: 0,
        tint: 0
    }];
    historyIndex = 0;

    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    temperatureSlider.value = 0;
    tintSlider.value = 0;

    // 👉 Thêm 3 dòng này
    redRange.value = 0;
    greenRange.value = 0;
    blueRange.value = 0;

    updateFilters(); // Đảm bảo hiển thị đúng filter mới khi load ảnh
};


function updateFilters() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Temperature
    let tempValue = parseInt(temperatureSlider.value);
    let r = tempValue > 0 ? tempValue * 0.5 : 0;
    let b = tempValue < 0 ? Math.abs(tempValue) * 0.5 : 0;

    // Tint ()
    let tintValue = parseInt(tintSlider.value);
    let greenAdjust = -tintValue * 0.3; 
    let magentaAdjust = tintValue * 0.15; 

    // Áp dụng filter CSS trước (brightness, contrast, saturation, hue)
    ctx.filter = `
        brightness(${50 + brightnessSlider.value * 0.5}%) 
        contrast(${75 + contrastSlider.value * 0.5}%) 
        saturate(${50 + saturationSlider.value * 0.5}%)
        hue-rotate(${hueSlider.value}deg)
    `;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Lấy giá trị RGB từ slider
    let redValue = parseFloat(document.getElementById("redRange").value) * 0.3;
    let greenValue = parseFloat(document.getElementById("greenRange").value) * 0.3;
    let blueValue = parseFloat(document.getElementById("blueRange").value) * 0.3;

    // Lấy dữ liệu ảnh để xử lý màu thủ công
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + r + redValue + magentaAdjust));       // 🔴 Red 
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + greenValue + greenAdjust));    // 🟢 Green 
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + b + blueValue + magentaAdjust)); // 🔵 Blue 
    }

    ctx.putImageData(imageData, 0, 0);
}

// Hàm cập nhật giá trị hiển thị và gọi updateFilters chung cho các slider
function setupSlider(sliderId) {
    const slider = document.getElementById(sliderId);

    if (slider) {
        slider.addEventListener("input", updateFilters);
    }
}

// Áp dụng setupSlider cho tất cả slider cần thiết
[
    "temperature", "tint",
    "brightness", "contrast", "saturation", "hue",
    "redRange", "greenRange", "blueRange"
].forEach(setupSlider);

// Hàm reset giá trị slider và cập nhật lại UI
function resetSlider(id) {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(id + "Value");
    if (slider) {
        let defaultValue = 100; 
        if (["hue", "temperature", "tint", "redRange", "greenRange", "blueRange"].includes(id)) {
            defaultValue = 0;
        }
        slider.value = defaultValue;
        if (valueDisplay) {
            valueDisplay.textContent = slider.value;
        }
        updateFilters();
    }
}

// Đảm bảo khi reset toàn bộ, tất cả các slider được reset về mặc định
document.querySelector(".resetAllBtn").addEventListener("click", function () {
    const allSliders = [
        "temperature", "tint",
        "brightness", "contrast", "saturation", "hue",
        "redRange", "greenRange", "blueRange"
    ];

    allSliders.forEach(resetSlider);
    document.querySelectorAll("input[type='file']").forEach(input => {
        input.value = "";
    });

    console.log("Đã reset toàn bộ thông số!");
});



document.getElementById("downloadBtn").addEventListener("click", function () {
    const canvas = document.getElementById("canvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


document.addEventListener("keydown", function (event){
    if (event.ctrlKey){
       event.preventDefault();
    }
    if(event.keyCode == 123){
       event.preventDefault();
    }
});

document.addEventListener("contextmenu", function(event){
    event.preventDefault(); // Ngăn không cho nhấp chuột phải
});
