function generateLink() {
    let url = document.getElementById("targetUrl");

    if (!url || url.value.trim() === "") {
        alert("Masukkan URL terlebih dahulu");
        return;
    }

    let target = url.value.trim();
    let encoded = btoa(target);

    let safelink =
        window.location.origin +
        window.location.pathname.replace("index.html", "") +
        "artikel.html?url=" +
        encoded;

    document.getElementById("resultLink").value = safelink;
    document.getElementById("resultBox").style.display = "block";
}

function copyLink() {
    let copyText = document.getElementById("resultLink");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
    alert("Link berhasil dicopy");
}

/* artikel page */
(function () {

    let counterEl = document.getElementById("counter");
    if (!counterEl) return;

    let progressBar = document.getElementById("progressBar");
    let verifyBox = document.getElementById("verifyBox");
    let verifyCheck = document.getElementById("verifyCheck");
    let unlockBtn = document.getElementById("unlockBtn");
    let getLinkBtn = document.getElementById("getLinkBtn");

    let params = new URLSearchParams(window.location.search);
    let encoded = params.get("url");
    let target = "#";

    if (encoded) {
        try {
            target = atob(encoded);
        } catch (e) {
            target = "#";
        }
    }

    let total = 10;
    let current = total;

    let timer = setInterval(function () {

        current--;

        counterEl.innerText = current;

        let percent = ((total - current) / total) * 100;
        progressBar.style.width = percent + "%";

        if (current <= 0) {
            clearInterval(timer);
            verifyBox.classList.add("active");
        }

    }, 1000);

    verifyCheck.addEventListener("change", function () {
        unlockBtn.disabled = !this.checked;
    });

    unlockBtn.addEventListener("click", function () {
        getLinkBtn.classList.remove("d-none");
        unlockBtn.classList.add("d-none");
    });

    getLinkBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = target;
    });

})();