import { useState } from "react";
import Globe from "react-globe.gl";
import { iconPaths, platformIcons } from "../constants/index.js";
import Button from "../components/Button.jsx";

const About = ({ userData }) => {
  const [showContactIcons, setShowContactIcons] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const calculateIconSize = (technologies) => {
    const baseSize = 14; // Max size in rem
    const minSize = 5; // Min size in rem
    const iconCount = technologies.length;
    return Math.max(baseSize - iconCount, minSize); // Decrease size with more icons
  };

  const getSocialMediaLink = (socialMedia) => {
    const socialMediaLinks = {
      github: "github.com",
      linkedin: "linkedin.com",
      twitter: "twitter.com",
      facebook: "facebook.com",
    };

    const foundContact = userData.contactDetails.find((contact) =>
      contact.includes(socialMediaLinks[socialMedia])
    );

    if (foundContact) {
      return {
        isPresent: true,
        link: foundContact,
      };
    }

    return {
      isPresent: false,
      link: null,
    };
  };

  const getIcons = (technologies) => {
    // Define platform-to-icon mapping

    // Process each technology (URL)
    return technologies.map((tech) => {
      const matchingPlatform = platformIcons.find((platform) =>
        tech.toLowerCase().includes(platform.domain)
      );

      if (matchingPlatform) {
        return (
          <a href={tech}>
            {" "}
            <img
              key={tech}
              src={matchingPlatform.icon}
              alt={matchingPlatform.name}
              className="tech-logo-about w-16 h-16"
            />
          </a>
        );
      }

      return (
        <span key={tech} className="tech-text">
          {tech}
        </span>
      ); // Fallback for unknown platforms
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.emailId);
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };
  const getTechnologyIcons = (technologies) => {
    const iconSize = calculateIconSize(technologies);

    return technologies.map((tech) => {
      console.log(tech);
      const matchingIcon = iconPaths.find(
        (icon) => icon.name.toLowerCase() === tech.toLowerCase()
      );
      if (matchingIcon) {
        return (
          <img
            key={tech}
            src={matchingIcon.path}
            alt={tech}
            className="tech-logo-about "
            style={{
              width: `${iconSize}rem`,
              height: `${iconSize}rem`,
            }}
          />
        );
      }
      return (
        <span key={tech} className="tech-text">
          {tech}
        </span>
      ); // Fallback for unknown technologies
    });
  };
  return (
    <section className="c-space my-20" id="about">
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container" style={{ "max-height": "33rem" }}>
            <img
              src={userData.profilePhoto}
              alt="grid-1"
              className="w-full sm:h-[276px] h-fit object-contain"
            />

            <div>
              <p className="grid-headtext">Hi, I’m {userData.name}!</p>
              <p className="grid-subtext overflow-hidden break-words">
                {userData.about}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            {/* <img src="assets/grid2.png" alt="grid-2" className="w-full sm:h-[276px] h-fit object-contain" /> */}
            <img
              src="assets/grid3.png"
              alt="grid-3"
              className="w-full sm:h-[266px] h-fit object-contain"
            />
            <div>
              <p className="grid-headtext">My Passion for Coding</p>
              <p className="grid-subtext">
                I specialize in a variety of languages, frameworks, and tools
                that allow me to build robust and scalable applications
              </p>
              <p className="flex gap-4 mt-4">
                {getIcons(userData.codingProfiles)}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
              <Globe
                height={326}
                width={326}
                backgroundColor="rgba(0, 0, 0, 0)"
                backgroundImageOpacity={0.5}
                showAtmosphere
                showGraticules
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                labelsData={[
                  {
                    lat: 40,
                    lng: -100,
                    text: "Rjieka, Croatia",
                    color: "white",
                    size: 15,
                  },
                ]}
              />
            </div>
            <div>
              <p className="grid-headtext">
                I’m very flexible with time zone communications & locations
              </p>
              <p className="grid-subtext">
                I&apos;m based in Tirupati, India and open to remote work
                worldwide.
              </p>
              {/* <div className="relative">
                <Button
                  name="Contact Me"
                  isBeam
                  containerClass="w-full mt-10"
                  onClick={toggleContactIcons}
                />
                <div
                  className={`absolute top-[-120%] left-0 w-full flex justify-center items-center transition-opacity duration-500 ${
                    showContactIcons
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <div className="p-4 bg-white rounded-xl shadow-md space-x-4 flex">
                    {getIcons(userData.contactDetails)}
                  </div>
                </div>
              </div> */}
              {/* <div className="flex">{getIcons(userData.contactDetails)}</div> */}
              <div class="tooltip-container">
                <div class="button-content">
                  <span class="text">Contact Me</span>

                  <svg
                    width="24px"
                    className="share-icon"
                    height="24px"
                    viewBox="0 0 192 192"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                  >
                    <circle
                      cx="96"
                      cy="96"
                      r="74"
                      stroke="#000000"
                      stroke-width="12"
                    />
                    <ellipse
                      cx="96"
                      cy="96"
                      stroke="#000000"
                      stroke-width="12"
                      rx="30"
                      ry="74"
                    />
                    <path
                      stroke="#000000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="12"
                      d="M28 72h136M28 120h136"
                    />
                  </svg>
                </div>
                <div class="tooltip-content">
                  <div class="social-icons">
                    {getSocialMediaLink("twitter").isPresent && (
                      <a
                        href={getSocialMediaLink("twitter").link}
                        class="social-icon twitter"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                        </svg>
                      </a>
                    )}
                    {getSocialMediaLink("facebook").isPresent && (
                      <a
                        href={getSocialMediaLink("facebook").link}
                        class="social-icon facebook"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                        </svg>
                      </a>
                    )}
                    {getSocialMediaLink("linkedin").isPresent && (
                      <a
                        href={getSocialMediaLink("linkedin").link}
                        class="social-icon linkedin"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                        </svg>
                      </a>
                    )}
                    {getSocialMediaLink("github").isPresent && (
                      <a
                        href={getSocialMediaLink("github").link}
                        className="social-icon github"
                      >
                        <svg
                          width="800px"
                          height="800px"
                          viewBox="0 0 20 20"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                        >
                          <title>github [#142]</title>
                          <desc>Created with Sketch.</desc>
                          <defs></defs>
                          <g
                            id="Page-1"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <g
                              id="Dribbble-Light-Preview"
                              transform="translate(-140.000000, -7559.000000)"
                              fill="#000000"
                            >
                              <g
                                id="icons"
                                transform="translate(56.000000, 160.000000)"
                              >
                                <path
                                  d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                                  id="github-[#142]"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 xl:row-span-3">
          <div className="grid-container">
            {/* <img src="assets/grid3.png" alt="grid-3" className="w-full sm:h-[266px] h-fit object-contain" /> */}

            <div>
              <p className="grid-headtext">Tech Stacks</p>
              <div
                className="flex gap-4 justify-center items-center overflow-x-auto flex-wrap"
                style={{
                  scrollbarWidth: "none", // Hide scrollbar for Firefox
                  msOverflowStyle: "none", // Hide scrollbar for IE
                }}
              >
                {getTechnologyIcons(userData.techStacks)}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <a href={`tel:+${userData.phoneNo}`}>
              {" "}
              <img
                src="assets/grid4.png"
                alt="grid-4"
                className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
              />
              <div className="button text-center p-2">Phone Me</div>
            </a>
            <div className="space-y-2">
              <div className="copy-container" onClick={handleCopy}>
                <img
                  src={hasCopied ? "assets/tick.svg" : "assets/copy.svg"}
                  alt="copy"
                />
                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white break-words">
                  {userData.emailId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          /* From Uiverse.io by Mohammad-Rahme-576 */
          /* Container Styles */
          .tooltip-container {
            position: relative;
            display: inline-block;
            font-family: "Arial", sans-serif;
            overflow: visible;
            margin-top: 2rem;
          }

          /* Button Styles */
          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(215deg, #003459, #212529);
            color: white;
            padding: 14px 28px;
            border-radius: 50px;
            cursor: pointer;
            transition:
              background 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
              transform 0.3s ease,
              box-shadow 0.4s ease;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 10;
            overflow: hidden;
          }

          .button-content::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              135deg,
              rgba(110, 142, 251, 0.4),
              rgba(167, 119, 227, 0.4)
            );
            filter: blur(15px);
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: -1;
          }

          .button-content::after {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0) 70%
            );
            transform: scale(0);
            transition: transform 0.6s ease-out;
            z-index: -1;
          }

          .button-content:hover::before {
            opacity: 1;
          }

          .button-content:hover::after {
            transform: scale(1);
          }

          .button-content:hover {
            background: linear-gradient(135deg, #1d3557, black);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            transform: translateY(-4px) scale(1.03);
          }

          .button-content:active {
            transform: translateY(-2px) scale(0.98);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
          }

          .text {
            font-size: 18px;
            font-weight: 600;
            margin-right: 12px;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            transition: letter-spacing 0.3s ease;
          }

          .button-content:hover .text {
            letter-spacing: 1px;
          }

          .share-icon {
            fill: white;
            transition:
              transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              fill 0.3s ease;
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
          }

          .button-content:hover .share-icon {
            transform: rotate(180deg) scale(1.1);
            fill: #ffffff;
          }

          /* Tooltip Styles */
          .tooltip-content {
            position: absolute;
            top: 102%;
            left: 50%;
            transform: translateX(-50%) scale(0.8);
            background: black;
            border-radius: 15px;
            padding: 22px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            opacity: 0;
            visibility: hidden;
            transition:
              opacity 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              visibility 0.5s ease;
            z-index: 100;
            pointer-events: none;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.9);
          }

          .tooltip-container:hover .tooltip-content {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) scale(1);
            pointer-events: auto;
          }

          /* Social Icons Styles */
          .social-icons {
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }

          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #f0f0f0;
            transition:
              transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              background 0.3s ease,
              box-shadow 0.4s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .social-icon::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0) 70%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .social-icon:hover::before {
            opacity: 1;
          }

          .social-icon svg {
            width: 24px;
            height: 24px;
            fill: #333;
            transition:
              transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              fill 0.3s ease;
            z-index: 1;
          }

          .social-icon:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }

          .social-icon:active {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          }

          .social-icon:hover svg {
            transform: scale(1.2);
            fill: white;
          }

          .social-icon.twitter:hover {
            background: linear-gradient(135deg, #1da1f2, #1a91da);
          }

          .social-icon.facebook:hover {
            background: linear-gradient(135deg, #1877f2, #165ed0);
          }

          .social-icon.linkedin:hover {
            background: linear-gradient(135deg, #0077b5, #005e94);
          }
          .social-icon.github:hover {
            background: linear-gradient(135deg, #0077b5, #005e94);
          }

          /* Animation for Pulse Effect */
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(29, 53, 87, 0.4);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(69, 123, 157, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(89, 131, 146, 0);
            }
          }

          .button-content {
            animation: pulse 3s infinite;
          }

          /* Hover Ripple Effect */
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }

          .button-content::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: inherit;
            transform: scale(0);
            opacity: 0;
          }

          .button-content:active::before {
            animation: ripple 0.6s linear;
          }

          /* Tooltip Arrow */
          .tooltip-content::before {
            content: "";
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 10px 10px 10px;
            border-style: solid;
            border-color: transparent transparent rgba(255, 255, 255, 0.9)
              transparent;
            filter: drop-shadow(0 -3px 3px rgba(0, 0, 0, 0.1));
          }

          /* Accessibility */
          .button-content:focus {
            outline: none;
            box-shadow:
              0 0 0 3px rgba(110, 142, 251, 0.5),
              0 8px 15px rgba(0, 0, 0, 0.1);
          }

          .button-content:focus:not(:focus-visible) {
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .button-content {
              padding: 12px 24px;
              border-radius: 40px;
            }

            .text {
              font-size: 16px;
            }

            .tooltip-content {
              width: 240px;
              padding: 18px;
            }

            .social-icon {
              width: 44px;
              height: 44px;
            }

            .social-icon svg {
              width: 20px;
              height: 20px;
            }
          }

          @media (max-width: 480px) {
            .button-content {
              padding: 10px 20px;
            }

            .text {
              font-size: 14px;
            }

            .tooltip-content {
              width: 200px;
              padding: 15px;
            }

            .social-icon {
              width: 40px;
              height: 40px;
            }

            .social-icon svg {
              width: 18px;
              height: 18px;
            }
          }

          /* Dark Mode Support */
          @media (prefers-color-scheme: dark) {
            .tooltip-content {
              background: rgba(30, 30, 30, 0.9);
              color: white;
            }

            .tooltip-content::before {
              border-color: transparent transparent rgba(30, 30, 30, 0.9)
                transparent;
            }

            .social-icon {
              background: #2a2a2a;
            }

            .social-icon svg {
              fill: #e0e0e0;
            }
          }

          /* Print Styles */
          @media print {
            .tooltip-container {
              display: none;
            }
          }

          /* Reduced Motion */
          @media (prefers-reduced-motion: reduce) {
            .button-content,
            .share-icon,
            .social-icon,
            .tooltip-content {
              transition: none;
            }

            .button-content {
              animation: none;
            }
          }

          /* Custom Scrollbar for Tooltip Content */
          .tooltip-content::-webkit-scrollbar {
            width: 6px;
          }

          .tooltip-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          .tooltip-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }

          .tooltip-content::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          .grid-container {
            position: relative;
            overflow-y: auto;
            /* Set max-height if needed */
          }

          .grid-container::-webkit-scrollbar {
            display: none; /* Hides scrollbar in Webkit browsers */
          }

          .button {
            border-radius: 0.25rem;
            text-transform: uppercase;
            font-style: normal;
            font-weight: 400;
            padding-left: 25px;
            padding-right: 25px;
            color: #fff;
            -webkit-clip-path: polygon(
              0 0,
              0 0,
              100% 0,
              100% 0,
              100% calc(100% - 15px),
              calc(100% - 15px) 100%,
              15px 100%,
              0 100%
            );
            clip-path: polygon(
              0 0,
              0 0,
              100% 0,
              100% 0,
              100% calc(100% - 15px),
              calc(100% - 15px) 100%,
              15px 100%,
              0 100%
            );
            height: 40px;
            font-size: 0.7rem;
            line-height: 14px;
            letter-spacing: 1.2px;
            transition: 0.2s 0.1s;
            background-image: linear-gradient(240deg, #1c1c1c, #190b1c);
            border: 0 solid;
            overflow: hidden;
          }

          .button:hover {
            cursor: pointer;
            transition: all 0.3s ease-in;
            padding-right: 30px;
            padding-left: 30px;
          }
        `}
      </style>
    </section>
  );
};
export default About;
