// ==UserScript==
// @name         Improbable Access
// @namespace   https://distantorig.in/
// @description Makes the Improbable Island interface more accessible for screen readers.
// @include     http://*improbableisland.com/*
// @include     https://*improbableisland.com/*
// @exclude     http://*improbableisland.com/home.php*
// @exclude     https://*improbableisland.com/home.php*
// @version     0.1.1
// ==/UserScript==

(function() {
    'use strict';
    // Turn groups of nav links into lists.

    // Find all navsections and loop through each one
    var navSections = document.querySelectorAll('.navsection');
    
    navSections.forEach(function(navSection) {
        
        // Find the navhead element
        var navHead = navSection.previousElementSibling;

        // Set navhead to aria-hidden
        navHead.setAttribute('aria-hidden', 'true');

        // Create a new ul element
        var newList = document.createElement('ul');

        // Set aria-label for the ul element using the content of navhead
        newList.setAttribute('aria-label', navHead.textContent.trim());

        // Find all links inside the current navsection and iterate through each
     
        var navItems = navSection.querySelectorAll('.nav');

        navItems.forEach(function(navItem) {

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
    navigationDivs.forEach(function(navigationDiv) {

        // Create a new h2 element for each navigation
        var newHeading = document.createElement('h2');

        newHeading.textContent = "Navigation";

        // Apply CSS to make the h2 element invisible
        newHeading.style.position = 'absolute';
        newHeading.style.width = '1px';
        newHeading.style.height = '1px';
        newHeading.style.margin = '-1px';
        newHeading.style.border = '0';
        newHeading.style.padding = '0';
        newHeading.style.overflow = 'hidden';
        newHeading.style.clip = 'rect(0 0 0 0)';
        newHeading.style.clipPath = 'inset(50%)';
        newHeading.style.whiteSpace = 'nowrap';

        // Insert the h2 element before the navigation div
        navigationDiv.parentNode.insertBefore(newHeading, navigationDiv);
    });

    // Find chat headers and turn them into fake headings for screen readers

    const chatHeaderDivs = document.querySelectorAll('div.chatHeader');

    // Loop through each div element
    chatHeaderDivs.forEach(function(chatDiv) {
        // Add the role and level attributes
        chatDiv.setAttribute('role', 'heading');
        chatDiv.setAttribute('level', '2');
    });

    if (chatHeaderDivs) {
        // Presence of chat headers means we should add labels for chat inputs as well

        const chatInputs = document.querySelectorAll('input[name="comment"]');

        chatInputs.forEach(function(chatInput) {
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