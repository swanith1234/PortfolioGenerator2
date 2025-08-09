import fs from "fs-extra";
import path from "path";
import { exec, execSync } from "child_process";
import axios from "axios";
import dotenv from "dotenv";
export const generatePortfolio = async (templatePath, outputPath, userData) => {
  console.log("Generating portfolio at:", outputPath);
  try {
    // Step 1: Copy the template to the output path
    await fs.copy(templatePath, outputPath);

    // Step 2: Replace placeholders and convert .ejs to .jsx
    const processEjsFiles = async (dirPath) => {
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);

        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          // Recursively process subdirectories
          await processEjsFiles(filePath);
        } else if (path.extname(file) === ".ejs") {
          // Read the .ejs file
          let fileContent = await fs.readFile(filePath, "utf-8");

          // Replace placeholders with userData
          fileContent = fileContent
            .replace(/{name}/g, userData.name || "Default Name")
            .replace(/{about}/g, userData.about || "Default About Text")
            .replace(
              /{experience}/g,
              userData.experience || "Default Experience"
            )
            .replace(/{skills}/g, userData.skills || "Default Skills");

          // Rename the file to .jsx
          const newFilePath = filePath.replace(/\.ejs$/, ".jsx");

          // Write the updated content back to the renamed file
          await fs.writeFile(newFilePath, fileContent, "utf-8");

          // Delete the old .ejs file
          await fs.unlink(filePath);
        }
      }
    };

    await processEjsFiles(outputPath);

    // Step 3: Update App.jsx to pass userData to all sections
    const appFilePath = path.join(outputPath, "src", "App.jsx");
    let appContent = await fs.readFile(appFilePath, "utf-8");
    const updatedAppContent = appContent
      .replace(`const App = () => {`, `const App = ({ userData }) => {`)
      .replace(`<Hero />`, `<Hero userData={userData} />`)
      .replace(`<About />`, `<About userData={userData} />`)
      .replace(`<Navbar />`, `<Navbar userData={userData} />`)
      .replace(`<Projects />`, `<Projects userData={userData} />`)
      .replace(`<Clients />`, `<Clients userData={userData} />`)
      .replace(`<WorkExperience />`, `<WorkExperience userData={userData} />`)
      .replace(`<Achievements />`, `<Achievements userData={userData} />`)
      .replace(`<Certifications />`, `<Certifications userData={userData} />`)
      .replace(
        `<Conta
        
        ct />`,
        `<Contact userData={userData} />`
      )
      .replace(`<Footer />`, `<Footer userData={userData} />`);
    await fs.writeFile(appFilePath, updatedAppContent, "utf-8");

    // Step 4: Inject userData into main.jsx
    const mainFilePath = path.join(outputPath, "src", "main.jsx");
    let mainContent = await fs.readFile(mainFilePath, "utf-8");
    const updatedMainContent = mainContent.replace(
      `<App />`,
      `<App userData={${JSON.stringify(userData)}} />`
    );
    await fs.writeFile(mainFilePath, updatedMainContent, "utf-8");

    console.log("Portfolio generated successfully!");
  } catch (err) {
    console.error("Error generating portfolio:", err);
  }
};

export const runGeneratedPortfolio = async (
  templatePath,
  outputPath,
  port = 5000,
  devMode = false // Toggle for running in development or production mode
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (devMode) {
        // Start the Vite development server
        console.log("Starting the development server...");
        const devCommand = "npm run dev";
        const devProcess = exec(devCommand, { cwd: outputPath }, (error) => {
          if (error) {
            console.error("Error running the development server:", error);
            return reject(error);
          }
        });

        // Log server output
        devProcess.stdout.on("data", (data) => console.log(data));
        devProcess.stderr.on("data", (data) => console.error(data));

        setTimeout(() => {
          const url = `http://localhost:${port}`;
          console.log(`Development server is running at: ${url}`);
          resolve(url);
        }, 3000); // Give time for the server to start
      } else {
        // Build the project
        console.log("Building the project for production...");
        try {
          await new Promise((resolve, reject) => {
            const buildCommand = "npm run build";
            const buildProcess = exec(
              buildCommand,
              { cwd: outputPath },
              (error) => {
                if (error) {
                  console.error("Error during build:", error);
                  return reject(error);
                }
                resolve();
              }
            );

            buildProcess.stdout.on("data", (data) => console.log(data));
            buildProcess.stderr.on("data", (data) => console.error(data));
          });
        } catch (buildError) {
          console.error("Failed to build the project:", buildError);
          return reject(buildError);
        }

        // Run the built project using Vite preview
        console.log("Previewing the production build...");
        const previewCommand = `npx vite preview --port ${port}`;
        const previewProcess = exec(
          previewCommand,
          { cwd: outputPath },
          (error) => {
            if (error) {
              console.error("Error running the preview server:", error);
              return reject(error);
            }
          }
        );

        // Log server output
        previewProcess.stdout.on("data", (data) => console.log(data));
        previewProcess.stderr.on("data", (data) => console.error(data));

        setTimeout(() => {
          const url = `http://localhost:${port}`;
          console.log(`Production preview is running at: ${url}`);
          resolve(url);
        }, 3000); // Give time for the server to start
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      reject(err);
    }
  });
};

// Function to create a GitHub repository
async function createGitHubRepo({
  repoName,
  accessToken,
  description = "",
  isPrivate = false,
}) {
  try {
    const apiUrl = "https://api.github.com/user/repos";

    console.log(`Creating repository: ${repoName}...`);

    // Make POST request to GitHub API
    const response = await axios.post(
      apiUrl,
      {
        name: repoName,
        description,
        private: isPrivate,
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("Repository created successfully:", response.data.html_url);

    return response.data.clone_url; // Return the repository's clone URL
  } catch (error) {
    console.error("Error creating repository:", error.response.data.message);
    throw error;
  }
}

function pushToGitHub({ repoUrl, projectPath, branch = "main" }) {
  try {
    console.log("Starting the deployment process in steps...");

    // Step 1: Initialize Git if not already initialized
    if (!fs.existsSync(`${projectPath}/.git`)) {
      console.log("Initializing Git...");
      execSync("git init", { cwd: projectPath });
    }

    let remoteExists;
    try {
      // Check if remote origin exists
      execSync("git remote get-url origin", { cwd: projectPath });
      remoteExists = true;
    } catch (error) {
      remoteExists = false; // If an error occurs, the remote does not exist
    }

    if (remoteExists) {
      // Update remote URL if it exists
      console.log("Updating remote repository URL...");
      execSync(`git remote set-url origin ${repoUrl}`, { cwd: projectPath });
    } else {
      // Add remote if it doesn't exist
      console.log("Adding remote repository...");
      execSync(`git remote add origin ${repoUrl}`, { cwd: projectPath });
    }

    // Ensure the correct branch name
    console.log(`Ensuring branch ${branch} exists...`);
    execSync(`git branch -M ${branch}`, { cwd: projectPath });

    // Step 2: Add node_modules to .gitignore if not already ignored

    // Step 3: Divide the project into manageable chunks for commits
    const largeFolders = ["dist", "public", "src"]; // Example of large folders
    const remainingFiles = "."; // All other files and folders

    // Commit each large folder individually
    for (const folder of largeFolders) {
      if (folder === "node_modules") {
        console.log(`Skipping ignored folder: ${folder}`);
        continue;
      }

      if (fs.existsSync(`${projectPath}/${folder}`)) {
        console.log(`Adding and committing folder: ${folder}...`);
        execSync(`git add ${folder}`, { cwd: projectPath });
        execSync(`git commit -m "Add folder: ${folder}"`, { cwd: projectPath });
      } else {
        console.log(`Folder ${folder} does not exist, skipping...`);
      }
    }

    // Commit the remaining files
    console.log("Adding and committing remaining files...");
    execSync(`git add ${remainingFiles}`, { cwd: projectPath });
    execSync('git commit -m "Add remaining files"', { cwd: projectPath });

    // Push all commits to the remote repository
    console.log(`Pushing code to branch: ${branch}...`);
    execSync(`git push -u origin ${branch}`, { cwd: projectPath });

    console.log("Code pushed successfully in steps!");
  } catch (error) {
    console.error("Error during deployment:", error.message);
  }
}

async function enableGitHubPages({ repoName, accessToken, branch = "main" }) {
  try {
    console.log(`Starting deployment for repository: ${repoName}...`);

    // Step 1: Build the Project
    console.log("Building the project...");
    await runCommand("npm run build");

    // Step 2: Deploy to GitHub Pages
    console.log("Deploying to GitHub Pages...");
    await runCommand("npm run deploy");

    // Step 3: Enable GitHub Pages via API
    console.log("Enabling GitHub Pages...");
    const apiUrl = `https://api.github.com/repos/${repoName}/pages`;

    const response = await axios.post(
      apiUrl,
      {
        source: {
          branch: branch,
          path: "/",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    console.log(
      `GitHub Pages successfully enabled! Your site will be available at: ${response.data.html_url}`
    );

    return response.data.html_url; // Return the GitHub Pages URL
  } catch (error) {
    console.error(
      "Error enabling GitHub Pages:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
}

async function createVercelConfig(projectPath) {
  const vercelConfig = {
    public: true, // Ensure the deployment is public
  };

  const configPath = path.join(projectPath, "vercel.json");
  fs.writeFileSync(configPath, JSON.stringify(vercelConfig, null, 2), "utf8");
  console.log("Generated `vercel.json` configuration.");
}

async function deployToVercel({ projectPath, accessToken }) {
  try {
    console.log(
      `Starting deployment to Vercel for project at: ${projectPath}...`
    );

    // Step 1: Generate `vercel.json` config
    console.log("Generating Vercel configuration...");
    await createVercelConfig(projectPath);

    // Before building, install dependencies
    console.log("Installing dependencies...");
    await runVercelCommand("npm install", projectPath);

    // Then build
    console.log("Building the project...");
    await runVercelCommand("npm run build", projectPath);

    // Step 3: Deploy to Vercel
    console.log("Deploying to Vercel...");
    const deployCommand = `vercel deploy --token ${accessToken} --prod --public --cwd ${projectPath} --yes --force`;
    const output = await runVercelCommand(deployCommand, projectPath);

    // Extract the deployment URL from the output
    const deployedUrlMatch = output.match(/https:\/\/.*\.vercel\.app/);
    if (!deployedUrlMatch) {
      throw new Error("Deployment failed: No deployment URL found.");
    }

    const deployedUrl = deployedUrlMatch[0];
    console.log(`Deployment successful! Your site is live at: ${deployedUrl}`);

    return deployedUrl; // Return the Vercel deployment URL
  } catch (error) {
    console.error("Error during deployment to Vercel:", error.message);
    throw error;
  }
}
function sanitizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-") // only allowed chars
    .replace(/-{3,}/g, "-") // avoid triple dashes
    .substring(0, 100); // max length
}
// Helper function to execute shell commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command);

    process.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    process.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}
function runVercelCommand(command, cwd) {
  console.log("path: " + cwd);
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(error);
      }
      resolve(stdout);
    });
  });
}
async function deleteGeneratedFolder(outputPath) {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log(`Waiting for processes to release folder: ${outputPath}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay

      console.log(`Attempting to delete folder: ${outputPath}`);
      await fs.remove(outputPath);
      console.log("Generated folder deleted successfully!");
      break;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);
      if (attempts >= maxRetries) {
        console.error(
          "Maximum retry attempts reached. Could not delete folder."
        );
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second retry delay
    }
  }
}
// Main function to create and deploy the repository
export async function deployPortfolio(projectPath, userName) {
  const repoName = sanitizeProjectName(userName);
  const githubToken = process.env.GIT_ACCESS_TOKEN;
  const vercelToken = process.env.VERCEL_ACCESS_TOKEN;
  const githubUser = process.env.GITHUB_USERNAME; // Your GitHub username

  try {
    // 1️⃣ Create GitHub repository
    const repoUrl = await createGitHubRepo({
      repoName,
      accessToken: githubToken,
      description: "Portfolio website generated automatically",
      isPrivate: false,
    });

    // 2️⃣ Push local project to GitHub
    await pushToGitHub({ repoUrl, projectPath });

    // 3️⃣ Create & link Vercel project with GitHub repo
    const vercelProject = await linkRepoToVercel({
      projectName: repoName,
      githubRepo: `${githubUser}/${repoName}`,
      vercelToken,
    });
    console.log("Vercel project linked successfully:", vercelProject);
    // 4️⃣ Trigger a deployment
    const deployedUrl = await triggerVercelDeployment(
      repoName,
      vercelProject.link.repoId,
      vercelToken
    );

    console.log(`✅ Portfolio live at: ${deployedUrl}`);

    return {
      repoUrl,
      deployedUrl,
    };
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

// Run the script

async function linkRepoToVercel({ projectName, githubRepo, vercelToken }) {
  const res = await fetch("https://api.vercel.com/v9/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      gitRepository: {
        type: "github",
        repo: githubRepo, // e.g. "username/my-portfolio"
      },
      buildCommand: "npm run build",
      outputDirectory: "dist",
    }),
  });

  if (!res.ok)
    throw new Error(`Vercel project creation failed: ${await res.text()}`);

  const data = await res.json();
  console.log("✅ Linked to Vercel project:", data.id);
  return data;
}
async function triggerVercelDeployment(projectName, projectId, vercelToken) {
  console.log("Triggering Vercel deployment...", projectName, projectId);

  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name: projectName,
      gitSource: {
        type: "github",
        repoId: projectId, // must match your linked repo
        ref: "main", // or "master"
      },
    }),
  });

  if (!res.ok) throw new Error(`Vercel deployment failed: ${await res.text()}`);

  const data = await res.json();
  console.log("🚀 Deployment started:", data.url);
  return `https://${data.url}`;
}
