const getRandomEmote = async (size = "1x") => {
    const res = await (await fetch("https://api.betterttv.net/3/emotes/shared/trending?offset=0&limit=50")).json();
    const random = res[Math.floor(Math.random() * Math.floor(res.length))];
    if (random?.emote) {
        return `https://cdn.betterttv.net/emote/${random.emote.id}/${size}`;
    }
    return "https://cdn.betterttv.net/emote/5ada077451d4120ea3918426/1x";
};

const getWisdom = async (lang = "en") => {
    const res = await (await fetch(`api/wisdom?lang=${lang}`)).json();
    const wisdomPlaceholder = document.getElementById("wisdom");
    const randomEmoteUrl = await getRandomEmote();
    if (wisdomPlaceholder) {
        wisdomPlaceholder.innerHTML = res.error ? res.error :
            `${res.result.wisdom} <img src=${randomEmoteUrl}>
            <div class="tooltip">
            <button onclick="copyToClip('${res.result.wisdom.replace(/'/g, "")}')" style="margin: 5px; border: 0; color: green; background-color: transparent;" class="fa fa-copy">
            <span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
            </button>
            </div>`;
    }
};

const copyToClip = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    const tooltip = document.getElementById("myTooltip");
    if (tooltip) {
        tooltip.innerHTML = "Copied: " + el.value.substr(0, 5) + "...";
    }
};

function outFunc() {
    const tooltip = document.getElementById("myTooltip");
    if (tooltip) {
        tooltip.innerHTML = "Copy to clipboard";
    }
}

getWisdom();