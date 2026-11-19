const grid = document.getElementById("destinationsGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function pageWidth() {
    // one visible "page" = grid width + the gap, so cards stay aligned
    const gap = parseInt(getComputedStyle(grid).columnGap, 10) || 0;
    return grid.clientWidth + gap;
}

function updateButtons() {
    prevBtn.disabled = grid.scrollLeft <= 2;
    nextBtn.disabled = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 2;
}

nextBtn.addEventListener("click", () => {
    grid.scrollBy({ left: pageWidth(), behavior: "smooth" });
});

prevBtn.addEventListener("click", () => {
    grid.scrollBy({ left: -pageWidth(), behavior: "smooth" });
});

grid.addEventListener("scroll", updateButtons, { passive: true });
window.addEventListener("resize", updateButtons);
updateButtons();