import { youtubeService } from "../src/services/youtube";

async function test() {
  try {
    console.log("Testing metadata fetch for video ID: jNQXAC9IVRw (Me at the zoo)");
    const meta = await youtubeService.getVideoMetadata("jNQXAC9IVRw");
    console.log("Metadata success:", meta);

    if (meta.title === "Me at the zoo") {
      console.log("✅ Metadata verification passed");
    } else {
      console.error("❌ Metadata verification failed: Title mismatch");
    }
  } catch (e: any) {
    console.error("❌ Error during verification:", e);
    if (e.stdout) console.error("Stdout:", e.stdout);
    if (e.stderr) console.error("Stderr:", e.stderr);
    process.exit(1);
  }
}

test();
