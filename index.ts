console.log("Hello via Bun!");

import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday
startOfWeek.setHours(0, 0, 0, 0);
const today = new Date();
const date = today.toISOString().substring(0, 10);
const outputFile = `changelog-${date}.txt`;

async function getCompletedIssues() {
  try {
    const issues = await linearClient.issues({
      filter: {
        completedAt: { gte: startOfWeek.toISOString() },
        state: { type: { eq: "completed" } },
      },
    });

    console.log(
      "🚚 Number of issues completed this week: ",
      issues.nodes.length
    );

    const list = issues.nodes.map((node) => node.title);

    console.log("🚚 Issues:");
    list.forEach((i) => console.log(i));

    await Bun.write(outputFile, list.join("\n"));

    console.log("🚚 Saved list to", outputFile);

    return list;
  } catch (error) {
    console.error("Error fetching Linear issues:", error);
    throw error;
  }
}

getCompletedIssues();
