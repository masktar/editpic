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
