import { UserInfo } from "../models/userInfo.js";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  deployPortfolio,
  generatePortfolio,
  runGeneratedPortfolio,
} from "../controllers/portfolioGeneratorController.js"; // Import the function to run the portfolio
import { sendEmailSelect } from "../mail.js";
import { zipFolder } from "../utils/zip.js";
import { supabase } from "../databases/supabaseClient.js"; // Import your Supabase client
import { uploadToSupabase } from "../utils/uploadToSupabase.js";
// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createUserInfo = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      name,
      emailId,
      phoneNo,
      projects,
      resume,
      experiences,
      techStacks,
      contactDetails,
      codingProfiles,
      certifications,
      achievements,
      about,
      profilePhoto,
      preferredThemeName,
    } = req.body;

    console.log("Request Body:", req.body);
    console.log("Projects Selected", projects);
    // Create a new instance of the UserInfo model
    const newUser = new UserInfo({
      name,
      emailId,
      phoneNo,
      techStacks,
      projects,
      resume,
      experiences,
      contactDetails,
      codingProfiles,
      certifications,
      achievements,
      about,
      profilePhoto,
      preferredThemeName,
    });

    // Save the new user portfolio in the database
    // const savedUser = await newUser.save();

    const templatePath = path.join(
      __dirname,
      "../templates/threejs-portfolio-main"
    );
    const outputPath = path.join(
      __dirname,
      `../${name.split(" ")[0].toLowerCase()}`
    );

    // Generate and deploy the portfolio
    await generatePortfolio(templatePath, outputPath, newUser);

    const zipFilePath = path.join(
      __dirname,
      `../${name.split(" ")[0].toLowerCase()}.zip`
    );

    await zipFolder(outputPath, zipFilePath);
    console.log("Zipped folder successfully:", zipFilePath);
    const uploadedPath = await uploadToSupabase(
      zipFilePath,
      `${name.split(" ")[0].toLowerCase()}.zip`
    );

    console.log("Uploaded to Supabase at:", uploadedPath);

    // Run the generated portfolio and retrieve the URL
    // const runURL = await runGeneratedPortfolio(templatePath, outputPath, 4000);
    // console.log("local server", runURL);
    // Deploy the portfolio
    const { deployedUrl } = await deployPortfolio(
      outputPath,
      name.split(" ")[0]
    );
    const { data: publicUrl } = supabase.storage
      .from("portfolios")
      .getPublicUrl(`generated/${name.split(" ")[0].toLowerCase()}.zip`);
    const repoUrl = publicUrl.publicUrl;

    console.log("Deployed URL:", deployedUrl);
    // console.log("Repo URL:", repoUrl);
    console.log("Zip File Path:", zipFilePath);
    console.log("Uploaded Path:", uploadedPath);
    console.log("Public Download Link:", publicUrl.publicUrl);

    console.log(`Generated portfolio is accessible at: ${deployedUrl}`);
    // Delete local files to save space
    // await fs.remove(outputPath);
    await fs.remove(zipFilePath);
    await sendEmailSelect(emailId, name, deployedUrl, publicUrl.publicUrl);
    // Send a success response with the generated URL
    res.status(201).json({
      success: true,
      message: "User portfolio created successfully!",
      data: newUser,
      portfolioURL: deployedUrl,
    });
  } catch (error) {
    console.error("Error saving user portfolio:", error);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "Failed to create user portfolio.",
      error: error.message,
    });
  }
};
