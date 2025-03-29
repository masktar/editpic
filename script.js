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
let history = [];
let historyIndex = -1;

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Lấy file đã chọn

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                // Hiển thị ảnh lên canvas (nếu bạn dùng canvas)
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };
        reader.readAsDataURL(file);
    }
});

//cập nhật filters

function resetFilters() {
    document.getElementById("temperature").value = 0;
    document.getElementById("tint").value = 0;
    document.getElementById("brightness").value = 100;
    document.getElementById("contrast").value = 100;
    document.getElementById("hue").value = 0;
    document.getElementById("saturation").value = 100;
    document.getElementById("redRange").value = 0;
    document.getElementById("greenRange").value = 0;
    document.getElementById("blueRange").value = 0;

    // Gọi lại các hàm cập nhật để áp dụng giá trị mới
    // adjustImage();
}


imageInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            // resetFilters(); 
        };
        reader.readAsDataURL(file);
    }
});



img.onload = function() {
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
        tint: 0 // 🌟 Thêm Tint vào lịch sử
    }];
    historyIndex = 0;

    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    hueSlider.value = 0;
    temperatureSlider.value = 0;
    tintSlider.value = 0;  // 🌟 Reset Tint về 0
};

function updateFilters(saveHistory = true) {


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let greenValue = parseInt(document.getElementById("greenRange").value);
    let blueValue = parseInt(document.getElementById("blueRange").value); // ✅ Thêm giá trị Blue

    let tempValue = parseInt(temperatureSlider.value);
    let tintValue = parseInt(tintSlider.value);
    let r = tempValue > 0 ? tempValue * 0.5 : 0;
    let b = tempValue < 0 ? Math.abs(tempValue) * 0.5 : 0;
    let g = tintValue > 0 ? tintValue * 0.5 : 0;
    let m = tintValue < 0 ? Math.abs(tintValue) * 0.5 : 0;

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
        data[i] += r - m; // 🌟 Tint tác động lên Red và Magenta
        data[i + 1] += g; // 🌟 Tint tăng Green
        data[i + 2] += b; // 🌟 Temperature ảnh hưởng đến Blue
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + greenValue)); // Điều chỉnh Green
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + blueValue)); // ✅ Điều chỉnh Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

brightnessSlider.addEventListener("input", () => updateFilters());
contrastSlider.addEventListener("input", () => updateFilters());
saturationSlider.addEventListener("input", () => updateFilters());
hueSlider.addEventListener("input", () => updateFilters());
temperatureSlider.addEventListener("input", () => updateFilters());
tintSlider.addEventListener("input", () => updateFilters()); // 🌟 Lắng nghe sự kiện Tint

//reset ảnh

function resetImage() {
    if (history.length > 0) {
        let initialState = history[0];

        let imgReset = new Image();
        imgReset.src = initialState.image;
        imgReset.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgReset, 0, 0, canvas.width, canvas.height);
        };

        brightnessSlider.value = initialState.brightness;
        contrastSlider.value = initialState.contrast;
        saturationSlider.value = initialState.saturation;
        hueSlider.value = initialState.hue;
        temperatureSlider.value = initialState.temperature;
        tintSlider.value = initialState.tint; // 🌟 Reset Tint

        historyIndex = 0;
    }
}

//reset từng chức năng

function resetSlider(id) {
    const slider = document.getElementById(id);
    if (slider) {
        // Xác định giá trị mặc định của từng slider
        let defaultValue = 100; // Mặc định cho Brightness, Contrast, Saturation
        if (id === "hue" || id === "temperature" || id === "tint" || id === "redRange" || id === "greenRange" || id === "blueRange") {
            defaultValue = 0; // Hue, Temperature, Tint mặc định là 0
        }
        slider.value = defaultValue;
        updateFilters(); // Cập nhật bộ lọc sau khi reset
    }
}


const resetButton = document.getElementById("reset-btn");
// resetButton.addEventListener("dblclick", resetImage);

//download ảnh

document.getElementById("downloadBtn").addEventListener("click", function () {
    const canvas = document.getElementById("canvas");
    if (!canvas || !canvas.getContext) {
        alert("Không có ảnh để tải xuống!");
        return;
    }
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});



// Lặp qua từng thanh trượt để cập nhật giá trị khi kéo
sliders.forEach(slider => {
    slider.addEventListener("input", function () {
        const valueDisplay = document.getElementById(this.id + "Value");
        if (valueDisplay) {
            valueDisplay.textContent = this.value;
        }
    });
});
// Lặp qua tất cả thanh trượt để cập nhật giá trị hiển thị
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", function () {
        const valueDisplay = document.getElementById(this.id + "Value"); // Lấy phần tử hiển thị số
        if (valueDisplay) {
            valueDisplay.textContent = this.value; // Cập nhật số
        }
        updateFilters(); // Cập nhật ảnh ngay khi kéo
    });
});

// Đảm bảo cập nhật giá trị hiển thị khi kéo thanh trượt
document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll("input[type='range']");

    sliders.forEach(slider => {
        slider.addEventListener("input", function () {
            const valueDisplay = document.getElementById(this.id + "Value");
            if (valueDisplay) {
                valueDisplay.textContent = this.value; // Cập nhật số khi kéo
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadBtn");
    if (!downloadBtn) {
        console.error("Không tìm thấy nút download!");
        return;
    }
    downloadBtn.addEventListener("click", function () {
        console.log("Nút tải ảnh đã được nhấn!");
    });
});

document.getElementById("redRange").addEventListener("input", adjustRed);
document.getElementById("greenRange").addEventListener("input", updateFilters);

document.getElementById("redRange").addEventListener("input", function () {
    document.getElementById("redValue").textContent = this.value;
    adjustRed();
});


function adjustRed() {
    let redValue = parseInt(document.getElementById("redRange").value);
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + redValue)); // Điều chỉnh Red, giữ trong khoảng [0, 255]
    }

    ctx.putImageData(imageData, 0, 0);
}

function adjustGreen() {
    let greenValue = parseInt(document.getElementById("greenRange").value);
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + greenValue)); // 🟢 Điều chỉnh Green
    }

    ctx.putImageData(imageData, 0, 0);
}

function adjustBlue() {
    let blueValue = parseInt(document.getElementById("blueRange").value);
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + blueValue)); // 🔵 Điều chỉnh Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

function adjustColor() {
    let redValue = parseInt(document.getElementById("redRange").value);
    let greenValue = parseInt(document.getElementById("greenRange").value);
    let blueValue = parseInt(document.getElementById("blueRange").value);

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Điều chỉnh từng kênh màu
        let adjustment = (redValue + greenValue + blueValue) / 3; 

        data[i] = Math.min(255, Math.max(0, data[i] + adjustment));     // 🔴 Kênh đỏ
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + adjustment)); // 🟢 Kênh xanh lá
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + adjustment)); // 🔵 Kênh xanh dương
    }

    ctx.putImageData(imageData, 0, 0);
}
document.getElementById("redRange").addEventListener("input", adjustColor);
document.getElementById("greenRange").addEventListener("input", adjustGreen);
document.getElementById("blueRange").addEventListener("input", adjustBlue);


document.querySelector(".resetAllBtn").addEventListener("click", function ()
    {
    // Reset các thanh trượt về giá trị mặc định
    document.querySelectorAll("input[type='range']").forEach(slider => {
        slider.value = slider.defaultValue || slider.min;
    });

    // Reset tất cả input file (nếu có)
    document.querySelectorAll("input[type='file']").forEach(input => {
        input.value = "";
    });

    // Reset màu sắc, hoặc các tùy chỉnh khác
    document.getElementById("preview-container").style.filter = "none";

    console.log("Đã reset toàn bộ thông số!");
    // Reset tất cả các thanh trượt về giá trị mặc định
    document.getElementById("temperature").value = 0;
    document.getElementById("tint").value = 0;
    document.getElementById("brightness").value = 100;
    document.getElementById("contrast").value = 100;
    document.getElementById("hue").value = 0;
    document.getElementById("saturation").value = 100;
    document.getElementById("redRange").value = 0;
    document.getElementById("greenRange").value = 0;
    document.getElementById("blueRange").value = 0;

    // Gọi lại các hàm cập nhật để áp dụng giá trị mới
    updateFilters(); // Cập nhật lại màu sắc
    resetCanvas();   // Reset lại ảnh về ban đầu

});


function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


