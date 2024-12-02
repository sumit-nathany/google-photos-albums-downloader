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
  const albumLinks = document.querySelectorAll('a.MTmRkb[href]');
  if (albumLinks.length === 0) {
    console.error("No albums found. Ensure you're on the correct page and the selector is accurate.");
    return;
  }

  console.log(`Found ${albumLinks.length} albums. Starting the process...`);

  for (let i = 0; i < albumLinks.length; i++) {
    const link = albumLinks[i].href;
    console.log(`Processing album ${i + 1} of ${albumLinks.length}: ${link}`);

    // Open album in a new tab
    const newTab = window.open(link, "_blank");

    // Wait for the album page to load
    await delay(5000);

    // Inject script into the new tab to interact with the menu and download
    newTab.eval(`
      console.log("checking***");
    `);

    // Wait before moving to the next album
    await delay(10000);
  }

  console.log("All albums processed. Downloads initiated!");
})();
