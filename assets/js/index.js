var currentTime = new Date().getTime() / 1e3,
    currentColorScheme = "light",
    lastTimeUsed = localStorage.lastTimeUsed,
    lastColorScheme = localStorage.lastColorScheme,
    vh = window.innerHeight,
    vw = window.innerHeight;

function ready() {
    adjustAboveTheFold();
    initProjectsToggle();
    initDesignCarousels();

    let mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (window.matchMedia && mediaQuery.matches) {
        toggleColorScheme("dark");
    }

    if ("undefined" != lastTimeUsed && currentTime - lastTimeUsed < 3600) {
        if ("undefined" != lastColorScheme) {
            toggleColorScheme(lastColorScheme);
        }
    } else {
        localStorage.lastTimeUsed = currentTime;
        localStorage.lastColorScheme = currentColorScheme;
    }

    localStorage.lastTimeUsed = currentTime;
}

function adjustAboveTheFold() {
    var headerHeight = document.querySelector("header").clientHeight,
        contentHeight = document.querySelector("content").clientHeight;
    let marginTop = 0;

    if (vh - headerHeight > 2 * contentHeight) {
        marginTop = Math.min(.5 * (vh - headerHeight), 2.5 * contentHeight);
    } else if (vh - headerHeight > contentHeight) {
        marginTop = vh - 2 * headerHeight - contentHeight;
    }

    if (marginTop > 0) {
        document.querySelector("content").style.marginTop = marginTop + "px";
    }

    document.querySelector("content").classList.add("fadeUp");
}

function initProjectsToggle() {
    const toggleOpenButton = document.getElementById("projects-toggle-open");
    const toggleCloseButton = document.getElementById("projects-toggle-close");
    const toggleTopRow = document.getElementById("projects-toggle-top-row");
    const toggleBottomRow = document.getElementById("projects-toggle-bottom-row");
    const extraProjects = document.getElementById("projects-extra");
    const projectsSection = document.getElementById("stack");

    if (!toggleOpenButton || !toggleCloseButton || !toggleTopRow || !toggleBottomRow || !extraProjects || !projectsSection) {
        return;
    }

    function setExpanded(expanded) {
        toggleOpenButton.setAttribute("aria-expanded", String(expanded));
        toggleCloseButton.setAttribute("aria-expanded", String(expanded));
        extraProjects.classList.toggle("is-expanded", expanded);
        toggleTopRow.hidden = expanded;
        toggleBottomRow.hidden = !expanded;
    }

    setExpanded(false);

    toggleOpenButton.addEventListener("click", function() {
        setExpanded(true);

        window.setTimeout(function() {
            toggleBottomRow.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }, 220);
    });

    toggleCloseButton.addEventListener("click", function() {
        setExpanded(false);

        window.setTimeout(function() {
            projectsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);
    });
}

function initDesignCarousels() {
    const carousels = document.querySelectorAll(".design-carousel");

    carousels.forEach(function(carousel) {
        const viewportElement = carousel.querySelector(".design-carousel-viewport");
        const trackElement = carousel.querySelector(".design-carousel-track");
        const previousButton = carousel.querySelector(".design-carousel-button-prev");
        const nextButton = carousel.querySelector(".design-carousel-button-next");
        const title = carousel.getAttribute("data-title") || "project";
        const destinationUrl = carousel.getAttribute("data-url");
        const images = (carousel.getAttribute("data-images") || "")
            .split(",")
            .map(function(path) {
                return path.trim();
            })
            .filter(Boolean);
        let currentIndex = 1;
        let isAnimating = false;

        if (!viewportElement || !trackElement || !previousButton || !nextButton || !images.length) {
            return;
        }

        if (images.length > 1) {
            const slides = [images[images.length - 1]].concat(images, images[0]);

            trackElement.innerHTML = slides.map(function(path, slideIndex) {
                const realIndex = slideIndex === 0 ? images.length : slideIndex > images.length ? 1 : slideIndex;

                return '<img src="' + path + '" alt="' + title + ' product design screenshot ' + realIndex + '" class="design-carousel-image">';
            }).join("");
        } else {
            trackElement.innerHTML = '<img src="' + images[0] + '" alt="' + title + ' product design screenshot 1" class="design-carousel-image">';
        }

        function setTrackPosition(animated) {
            if (!animated) {
                trackElement.classList.add("is-snapping");
            } else {
                trackElement.classList.remove("is-snapping");
            }

            trackElement.style.transform = "translateX(" + (currentIndex * -100) + "%)";

            if (!animated) {
                window.requestAnimationFrame(function() {
                    trackElement.classList.remove("is-snapping");
                });
            }
        }

        function moveTo(direction) {
            if (images.length < 2 || isAnimating) {
                return;
            }

            isAnimating = true;
            currentIndex += direction;
            setTrackPosition(true);
        }

        function normalizeLoopPosition() {
            if (images.length < 2) {
                return;
            }

            if (currentIndex === 0) {
                currentIndex = images.length;
                setTrackPosition(false);
            } else if (currentIndex === images.length + 1) {
                currentIndex = 1;
                setTrackPosition(false);
            }

            isAnimating = false;
        }

        setTrackPosition(false);

        previousButton.addEventListener("click", function() {
            moveTo(-1);
        });

        nextButton.addEventListener("click", function() {
            moveTo(1);
        });

        function openDestination() {
            if (!destinationUrl) {
                return;
            }

            window.open(destinationUrl, "_blank", "noopener,noreferrer");
        }

        previousButton.addEventListener("click", function(event) {
            event.stopPropagation();
        });

        nextButton.addEventListener("click", function(event) {
            event.stopPropagation();
        });

        carousel.addEventListener("click", function() {
            openDestination();
        });

        carousel.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDestination();
            }
        });

        trackElement.addEventListener("transitionend", function(event) {
            if (event.propertyName !== "transform") {
                return;
            }

            normalizeLoopPosition();
        });
    });
}

function toggleColorScheme(mode) {
    if ("toggle" == mode) {
        mode = "light" == currentColorScheme ? "dark" : "light";
    }

    let switchLabel = "",
        themeColor = "";

    if ("light" == mode) {
        switchLabel = "off";
        themeColor = "hsla(207, 0%, 100%, 1)";
    } else {
        switchLabel = "on";
        themeColor = "hsla(207, 15%, 15%, 1)";
    }

    document.getElementById("colorScheme").setAttribute("href", "assets/css/" + mode + ".css");
    document.getElementById("theme-color").setAttribute("content", themeColor);
    document.querySelector("#lightswitch").innerHTML = "\uD83D\uDCA1 " + switchLabel;
    lastColorScheme = currentColorScheme = mode;
    localStorage.lastColorScheme = lastColorScheme;
}

document.documentElement.style.setProperty("--vh", vh + "px");
