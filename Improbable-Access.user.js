// ==UserScript==
// @name         Improbable Access
// @namespace   https://distantorig.in/
// @description Makes the Improbable Island interface more accessible for screen readers.
// @include     http://*improbableisland.com/*
// @include     https://*improbableisland.com/*
// @exclude     http://*improbableisland.com/home.php*
// @exclude     https://*improbableisland.com/home.php*
// @version     0.1.45
// ==/UserScript==

(function () {
    'use strict';

    // Define a CSS class for visually hiding elements
    const css = `
        .visually-hidden {
            position: absolute;
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0,0,0,0) !important;    white-space: nowrap !important;
            border: 0 !important;
        }
    `;

    var style = document.createElement('style');
    style.innerHTML = css;

    document.head.appendChild(style);

    function findStatValue(match) {
        const statTitleSpans = document.querySelectorAll('.stat_title span');

        for (let i = 0; i < statTitleSpans.length; i++) {
            const statTitleSpan = statTitleSpans[i];

            const statTitleDiv = statTitleSpan.parentElement;

            const statValueDiv = statTitleDiv.nextElementSibling;

            if (statTitleSpan.textContent.trim() === match) {
                return statValueDiv;
            }
        }

        return null;
    }

    // Define a live region for arbitrary announcements.

    var liveRegion = document.createElement("div");
    liveRegion.id = "live-announcements";
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.setAttribute("aria-atomic", "true");

    document.querySelector('footer').appendChild(liveRegion);

    // Add a ghetto "update" link to the footer.

    const updateLink = document.createElement('a');

    updateLink.textContent = 'Update Improbable Access';
    updateLink.href = 'https://github.com/distantorigin/improbable-access/raw/main/Improbable-Access.user.js';

    document.querySelector("footer").appendChild(updateLink);

    function announceXP() {
        announce(findStatValue("XP").textContent);
    }

    function announceDayRemaining() {
        announce(findStatValue("New day in:").textContent);
    }
    
    function announceStamina() {
        announce(findStatValue("Stamina").textContent);
    }

    function announceBuffs() {
        // Extract the text content of each buff element and store it in an array, and then announce it as an English list.

        const statBuffs = document.querySelectorAll('.stat_buff > span');

        const statBuffList = [];

        statBuffs.forEach(buff => {
            statBuffList.push(buff.textContent.trim().replace(/\n/g, ''));
        });

        let statBuffEnglishList = "";

        if (statBuffList.length === 1) {
            statBuffEnglishList = statBuffList[0];
        } else if (statBuffList.length === 2) {
            statBuffEnglishList = `${statBuffList[0]} and ${statBuffList[1]}`;
        } else if (statBuffList.length > 2) {
            const lastItem = statBuffList.pop();
            statBuffEnglishList = `${statBuffList.join(', ')}, and ${lastItem}`;
        }

        announce(statBuffEnglishList);
    }

    function announce(text) {
        // Announce text using the defined live region.

        document.getElementById("live-announcements").textContent = text;

        setTimeout(function () {
            document.getElementById("live-announcements").textContent = ''
        }, 1000);
    }

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key == ",") {
            announceXP();
        } else if (event.ctrlKey && event.key == "b") {
                        event.preventDefault();
            announceBuffs();
        } else if (event.ctrlKey && event.key == "s") {
            event.preventDefault();
announceStamina();
} else if (event.ctrlKey && event.key == "d") {
    event.preventDefault();
announceDayRemaining();
        }
    });

    // Add alt text to various links.
    // Currently only the donate link, but more may be added later.

    try {
        document.querySelector('#navigationcol > div > div.navigation-extras > a').querySelector("img").alt = "Donate";
    } catch { }

    // Fix hunger stat. ("Title" and "alt" don't get read by some screen readers, so we add a span set to visually-hidden.)

    const statHunger = findStatValue('Hunger');

    if (statHunger) {
        var hungerSpan = document.createElement('span');
        hungerSpan.textContent = statHunger.querySelector("div").title.replace(/\bbar\b/g, '').replace(/\bfilled\b/g, 'full');
        hungerSpan.className = "visually-hidden";
        console.log(hungerSpan.textContent);
        statHunger.appendChild(hungerSpan);
    }

    // Turn groups of nav links into lists.

    // Find all navsections and loop through each one
    var navSections = document.querySelectorAll('.navsection');

    navSections.forEach(function (navSection) {

        // Find the navhead element
        var navHead = navSection.previousElementSibling;

        if (navHead) {
            // Set navHead to aria-hidden
            navHead.setAttribute('aria-hidden', 'true');
        }

        // Create a new ul element
        var newList = document.createElement('ul');

        // If we have a navhead, set aria-label for the ul element using the inner content
        if (navHead) {
            newList.setAttribute('aria-label', navHead.textContent.trim());
        }

        // Find all links inside the current navsection and iterate through each

        var navItems = navSection.querySelectorAll('.nav');

        navItems.forEach(function (navItem) {

            var newListItem = document.createElement('li');

            newListItem.appendChild(navItem);
            newList.appendChild(newListItem);

        });

        // Insert the ul element before the navsection
        navSection.parentNode.insertBefore(newList, navSection);
    });

    // Add headings for each potential navigation. (In addition to the regions that already exist. Sue me.)

    var navigationDivs = document.querySelectorAll('div.navigation');

    // Loop through each navigation div
    navigationDivs.forEach(function (navigationDiv) {

        // Create a new h2 element for each navigation
        var newHeading = document.createElement('h2');

        newHeading.textContent = "Navigation";
        newHeading.className = "VISUALLY-HIDDEN";

        // Insert the h2 element before the navigation div
        navigationDiv.parentNode.insertBefore(newHeading, navigationDiv);
    });

    // Find chat headers and turn them into fake headings for screen readers

    const chatHeaderDivs = document.querySelectorAll('div.chatHeader');

    // Loop through each div element
    chatHeaderDivs.forEach(function (chatDiv) {
        // Add the role and level attributes
        chatDiv.setAttribute('role', 'heading');
        chatDiv.setAttribute('level', '2');
    });

    if (chatHeaderDivs) {
        // Presence of chat headers means we should add labels for chat inputs as well

        const chatInputs = document.querySelectorAll('input[name="comment"]');

        chatInputs.forEach(function (chatInput) {
            var label = document.createElement("label");

            label.setAttribute("for", chatInput.id);
            label.innerText = "Comment:";

            chatInput.parentNode.insertBefore(label, chatInput);
        });
    }

    // Check for the presence of a combat card and add remaining HP to the title of the page

    const combatCardHpDiv = document.querySelector('.combatCard_hp');

    if (combatCardHpDiv) {

        const hpValue = combatCardHpDiv.querySelector('span').textContent;

        // Update the title of the page with current HP
        document.title += ' [' + hpValue + ' HP]';
    }
})();