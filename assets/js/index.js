var currentTime=new Date().getTime()/1e3,currentColorScheme="light",lastTimeUsed=localStorage.lastTimeUsed,lastColorScheme=localStorage.lastColorScheme,vh=window.innerHeight,vw=window.innerHeight;function ready(){adjustAboveTheFold();let e=window.matchMedia("(prefers-color-scheme: dark)");window.matchMedia&&e.matches&&toggleColorScheme("dark"),"undefined"!=lastTimeUsed&&currentTime-lastTimeUsed<3600?"undefined"!=lastColorScheme&&toggleColorScheme(lastColorScheme):(localStorage.lastTimeUsed=currentTime,localStorage.lastColorScheme=currentColorScheme),localStorage.lastTimeUsed=currentTime}function adjustAboveTheFold(){var e=document.querySelector("header").clientHeight,t=document.querySelector("content").clientHeight;let r=0;vh-e>2*t?r=Math.min(.5*(vh-e),2.5*t):vh-e>t&&(r=vh-2*e-t),r>0&&(document.querySelector("content").style.marginTop=r+"px"),document.querySelector("content").classList.add("fadeUp")}function toggleColorScheme(e){"toggle"==e&&(e="light"==currentColorScheme?"dark":"light");let t="",r="";"light"==e?(t="off",r="hsla(207, 0%, 100%, 1)"):(t="on",r="hsla(207, 15%, 15%, 1)"),document.getElementById("colorScheme").setAttribute("href","assets/css/"+e+".css"),document.getElementById("theme-color").setAttribute("content",r),document.querySelector("#lightswitch").innerHTML="\uD83D\uDCA1 "+t,lastColorScheme=currentColorScheme=e,localStorage.lastColorScheme=lastColorScheme}document.documentElement.style.setProperty("--vh",vh+"px");