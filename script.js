const imgGallery = document.querySelector(".img-gallery");
const API_KEY = KEY
let processing = false;

const updateImage = (data) => {
    data.forEach((item, index) => {
        const imgBox = imgGallery.querySelectorAll(".img-box")[index];
        const imgEle = imgBox.querySelector("img");
        const aiImg = item.url;
        imgEle.src = aiImg;

        const downloadBtn = imgBox.querySelector(".download-btn"); // Select within imgBox scope

        imgEle.onload = () => {
            imgBox.classList.remove("loading");
            downloadBtn.setAttribute("href", aiImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
            downloadBtn.style.display = "flex";
        };
    });
};

const imageGenerate = async (userPrompt, imgQuantity) => {
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "prompt": userPrompt,
            "n": parseInt(imgQuantity),
            "size": "512x512",
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', option);
        const { data } = await response.json();
        console.log(data);
        updateImage([...data]);
        return data;
    } catch (error) {
        console.log(error);
    } finally {
        processing = false;
    }
};

const generateBtn = document.getElementById("generate");

generateBtn.addEventListener("click", () => {
    let promptData = document.getElementById("prompt");
    let userImgQuality = document.getElementById("userImgQuality");
    const userPrompt = promptData.value;
    const imgQuantity = userImgQuality.value;

    if (processing) return;
    processing = true;

    const imgBoxMarkUp = Array.from({ length: parseInt(imgQuantity) }, () =>
        `<div class="img-box flex loading">
            <img src="./loading-loading-forever.gif" alt="image">
            <a href="#" class="download-btn">
            <i class="fa-solid fa-download"></i>
            </a>
        </div>`
    ).join("");

    imgGallery.innerHTML = imgBoxMarkUp;

    imageGenerate(userPrompt, imgQuantity);
});