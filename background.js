chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clickMoreOptions" && message.url) {
    chrome.tabs.query({ url: message.url }, (tabs) => {
      if (tabs.length > 0) {
        const targetTab = tabs[0];
        chrome.scripting.executeScript(
          {
            target: { tabId: targetTab.id },
            func: interactWithAlbumPage,
          },
          () => {
            sendResponse({ success: true });
          }
        );
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // Keep the messaging channel open
  }
});

// Function to interact with the album page
function interactWithAlbumPage() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const clickMoreOptions = async () => {
    // Locate the "More Options" button
    const moreOptionsButton = document.querySelector('div[role="button"][aria-label="More options"]');
    if (moreOptionsButton) {
      const rect = moreOptionsButton.getBoundingClientRect();
      const x = rect.left + rect.width / 2; // Center of the button
      const y = rect.top + rect.height / 2; // Center of the button

      console.log(`Simulating mouse movement to (${x}, ${y}).`);

      // Simulate mouse movement
      const moveEvent = new MouseEvent("mousemove", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(moveEvent);

      // Simulate click event
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      });
      moreOptionsButton.dispatchEvent(clickEvent);

      console.log("Simulated click on 'More Options' button.");
    } else {
      console.error("More Options button not found.");
    }

    await delay(10000);

    // Locate and click the "Download All" button
    const downloadButton = Array.from(document.querySelectorAll('span'))
      .find((el) => el.textContent.includes("Download all"));
    if (downloadButton) {
      downloadButton.click();
      console.log("Download initiated.");
    } else {
      console.error("Download all button not found.");
    }
  };

  clickMoreOptions().catch(console.error);
}
