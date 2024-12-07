(async () => {
  console.log("Google Photos Album Downloader activated!");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Step 1: Scroll to load all albums
  const scrollToLoadAllAlbums = async () => {
    let lastHeight = 0;
    while (true) {
      window.scrollTo(0, document.body.scrollHeight);
      await delay(1000);
      const currentHeight = document.body.scrollHeight;
      if (currentHeight === lastHeight) break;
      lastHeight = currentHeight;
    }
  };

  await scrollToLoadAllAlbums();

  // Step 2: Locate album links
  const albumLinks = Array.from(document.querySelectorAll('a.MTmRkb[href]')).map(link => link.href);
  if (albumLinks.length === 0) {
    console.error("No albums found. Ensure you're on the correct page and the selector is accurate.");
    return;
  }

  console.log(`Found ${albumLinks.length} albums. Starting the process...`);

  const openedTabs = new Set();

  for (let i = 0; i < 2; i++) {
    const link = albumLinks[i];
    console.log(`Processing album ${i + 1} of ${albumLinks.length}: ${link}`);

    if (openedTabs.has(link)) {
      console.warn(`Album ${link} already processed, skipping.`);
      continue;
    }

    // Open the album in a new tab and notify the background script
    const newTab = window.open(link, "_blank");
    if (newTab) {
      openedTabs.add(link); // Track this link as opened

      // Wait for the new tab to load
      await delay(20000);

      // Send a message to inject the interaction script into the new tab
      chrome.runtime.sendMessage({ action: "clickMoreOptions", url: link }, (response) => {
        if (response.success) {
          console.log(`Interaction script executed for album: ${link}`);
        } else {
          console.error(`Failed to execute interaction script for album: ${link}`);
        }
      });
    } else {
      console.error(`Failed to open tab for album ${link}.`);
      continue;
    }

    // Delay before moving to the next album
    await delay(10000);
  }

  console.log("All albums processed. Downloads initiated!");
})();
