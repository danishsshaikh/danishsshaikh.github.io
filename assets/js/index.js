var currentTime = new Date().getTime() / 1e3,
    currentColorScheme = "light",
    lastTimeUsed = localStorage.lastTimeUsed,
    lastColorScheme = localStorage.lastColorScheme,
    vh = window.innerHeight,
    vw = window.innerHeight;

function ready() {
    adjustAboveTheFold();
    initProjectsToggle();

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
